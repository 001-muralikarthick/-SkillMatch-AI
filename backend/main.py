import uuid
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.data.sample_data import PRESET_JOBS, PRESET_RESUMES
from backend.parsers.resume_parser import parse_resume_file, anonymize_resume_text
from backend.nlp.skill_extractor import SKILL_TAXONOMY, SKILL_ALIASES, extract_skills_from_text
from backend.nlp.tfidf_matcher import compute_tfidf_similarity
from backend.nlp.semantic_matcher import compute_semantic_similarity
from backend.nlp.explainable_engine import analyze_resume_explainable
from backend.nlp.recommender import recommend_jobs_for_candidate
from backend.nlp.ai_copilot import generate_interview_questions_and_tips
from fastapi.responses import Response

app = FastAPI(
    title="AI Resume Screener & Job Matcher API",
    description="Full-stack Recruitment Intelligence Platform powered by NLP and Machine Learning.",
    version="2.1.0"
)

# CORS middleware for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for jobs and candidate screenings
JOBS_DB: List[Dict[str, Any]] = list(PRESET_JOBS)

class JobDescriptionCreate(BaseModel):
    title: str
    company: Optional[str] = "TechCorp"
    department: Optional[str] = "Engineering"
    location: Optional[str] = "Remote"
    experience_required: Optional[str] = "3+ years"
    required_skills: List[str]
    description: str

class TextAnalysisRequest(BaseModel):
    resume_text: str
    jd_id: Optional[str] = None
    jd_text: Optional[str] = None

class RecommendJobsRequest(BaseModel):
    resume_text: str

class SandboxRequest(BaseModel):
    resume_text: str
    jd_text: str

class AiCopilotRequest(BaseModel):
    job_title: str
    matching_skills: List[str] = []
    missing_skills: List[str] = []
    experience_years: float = 0.0
    match_score: float = 0.0
    provider: Optional[str] = None
    api_key: Optional[str] = None
    resume_text: Optional[str] = None
    jd_text: Optional[str] = None



@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Resume Screener & Job Matcher API",
        "version": "2.1.0"
    }


@app.get("/api/jobs")
def get_job_descriptions():
    """Retrieve all available job descriptions."""
    return {"jobs": JOBS_DB}


@app.post("/api/jobs")
def create_job_description(job: JobDescriptionCreate):
    """Create a custom job description."""
    new_job = {
        "id": f"job-custom-{uuid.uuid4().hex[:6]}",
        "title": job.title,
        "company": job.company,
        "department": job.department,
        "location": job.location,
        "experience_required": job.experience_required,
        "required_skills": job.required_skills,
        "description": job.description
    }
    JOBS_DB.insert(0, new_job)
    return {"message": "Job description created successfully", "job": new_job}


@app.get("/api/jobs/{job_id}")
def get_job_detail(job_id: str):
    """Retrieve details for a specific job."""
    for j in JOBS_DB:
        if j["id"] == job_id:
            return {"job": j}
    raise HTTPException(status_code=404, detail="Job not found")


@app.get("/api/sample-candidates")
def get_sample_candidates():
    """Retrieve preset sample candidate resumes for quick recruiter dashboard testing."""
    return {"candidates": PRESET_RESUMES}


@app.get("/api/skill-taxonomy")
def get_skill_taxonomy():
    """Retrieve system skill taxonomy categories and canonical alias mappings."""
    return {
        "categories": SKILL_TAXONOMY,
        "aliases": SKILL_ALIASES
    }


@app.post("/api/analyze-resume")
def analyze_single_resume(req: TextAnalysisRequest):
    """
    Analyze a resume string against a job description.
    Supports either passing a stored `jd_id` or raw `jd_text`.
    """
    jd_text = req.jd_text or ""
    if req.jd_id:
        for j in JOBS_DB:
            if j["id"] == req.jd_id:
                jd_text = j["description"]
                if j.get("required_skills"):
                    jd_text += "\nRequired Skills: " + ", ".join(j["required_skills"])
                break
                
    if not jd_text:
        raise HTTPException(status_code=400, detail="Job description text or valid jd_id is required.")
        
    analysis = analyze_resume_explainable(req.resume_text, jd_text)
    return {"analysis": analysis}


@app.post("/api/batch-screen")
async def batch_screen_candidates(
    jd_id: str = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    include_samples: bool = Form(True),
    anonymize: bool = Form(False)
):
    """
    Recruiter Dashboard API:
    Screens multiple candidate resumes against a selected Job Description,
    calculates match scores across Level 1-5, and returns ranked candidates.
    Supports Blind Screening (PII Redaction) when anonymize=True.
    """
    target_job = None
    for j in JOBS_DB:
        if j["id"] == jd_id:
            target_job = j
            break
            
    if not target_job:
        raise HTTPException(status_code=404, detail="Selected job description not found.")
        
    jd_text = target_job["description"]
    if target_job.get("required_skills"):
        jd_text += "\nRequired Skills: " + ", ".join(target_job["required_skills"])
        
    candidates_to_screen = []
    
    # 1. Process uploaded files if provided
    if files:
        for idx, file in enumerate(files):
            content_bytes = await file.read()
            if not content_bytes:
                continue
            text, fmt = parse_resume_file(file.filename, content_bytes)
            name_guess = file.filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()
            candidates_to_screen.append({
                "candidate_id": f"upload-{idx}-{uuid.uuid4().hex[:4]}",
                "name": name_guess,
                "email": f"candidate_{idx+1}@uploaded.file",
                "headline": f"Uploaded {fmt} Resume",
                "raw_text": text,
                "file_format": fmt
            })
            
    # 2. Include preset demo candidates if requested or if no files uploaded
    if include_samples or not candidates_to_screen:
        for s in PRESET_RESUMES:
            candidates_to_screen.append({
                "candidate_id": s["candidate_id"],
                "name": s["name"],
                "email": s["email"],
                "headline": s["headline"],
                "raw_text": s["raw_text"],
                "file_format": "PRESET"
            })
            
    screened_results = []
    
    for idx_cand, cand in enumerate(candidates_to_screen):
        working_text = cand["raw_text"]
        cand_name = cand["name"]
        cand_email = cand["email"]
        
        if anonymize:
            working_text = anonymize_resume_text(working_text, cand_name)
            cand_name = f"Candidate #{idx_cand + 101} (Anonymized)"
            cand_email = "[REDACTED]"
            
        analysis = analyze_resume_explainable(working_text, jd_text)
        screened_results.append({
            "candidate_id": cand["candidate_id"],
            "name": cand_name,
            "email": cand_email,
            "headline": "Candidate Profile" if anonymize else cand["headline"],
            "file_format": cand.get("file_format", "TXT"),
            "is_anonymized": anonymize,
            "overall_match_pct": analysis["overall_match_pct"],
            "suitability": analysis["ml_suitability"],
            "match_breakdown": analysis["match_breakdown"],
            "strong_matches": analysis["strong_matches"],
            "missing_skills": analysis["missing_skills"],
            "related_skills": analysis["related_skills"],
            "recommended_learning": analysis["recommended_learning"],
            "experience_meta": analysis["experience_meta"],
            "education_meta": analysis["education_meta"],
            "full_analysis": analysis,
            "resume_snippet": working_text[:300] + ("..." if len(working_text) > 300 else "")
        })
        
    # Rank candidates by overall match score descending
    screened_results.sort(key=lambda x: x["overall_match_pct"], reverse=True)
    
    # Add rank index
    for idx, c in enumerate(screened_results):
        c["rank"] = idx + 1
        
    return {
        "job": target_job,
        "is_anonymized": anonymize,
        "total_candidates": len(screened_results),
        "candidates": screened_results
    }


@app.get("/api/llm/providers")
def get_llm_providers():
    """Returns available LLM providers and active status."""
    import os
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    openai_key = os.getenv("OPENAI_API_KEY", "")
    ollama_host = os.getenv("OLLAMA_HOST", "http://localhost:11434")

    return {
        "providers": [
            {"id": "auto", "name": "⚡ Auto-Detect (Best Available)", "available": True},
            {"id": "gemini", "name": "✨ Google Gemini API", "available": bool(gemini_key)},
            {"id": "openai", "name": "🤖 OpenAI GPT-4o-mini", "available": bool(openai_key)},
            {"id": "ollama", "name": "🦙 Local Ollama LLM", "available": True, "host": ollama_host},
            {"id": "fallback", "name": "⚙️ Fast Deterministic Engine", "available": True}
        ]
    }


@app.post("/api/ai-interview-questions")
def get_ai_interview_questions(req: AiCopilotRequest):
    """
    AI Recruiter Co-Pilot Endpoint:
    Generates executive candidate summaries, targeted technical interview questions & ATS resume tips.
    """
    copilot_insights = generate_interview_questions_and_tips(
        job_title=req.job_title,
        matching_skills=req.matching_skills,
        missing_skills=req.missing_skills,
        experience_years=req.experience_years,
        match_score=req.match_score,
        provider=req.provider,
        api_key=req.api_key
    )
    return {"copilot": copilot_insights}



@app.get("/api/export-candidates-csv")
def export_candidates_csv(jd_id: str):
    """
    Generates a CSV evaluation report of candidates screened for a specific job.
    """
    target_job = None
    for j in JOBS_DB:
        if j["id"] == jd_id:
            target_job = j
            break
            
    if not target_job:
        raise HTTPException(status_code=404, detail="Job description not found.")
        
    jd_text = target_job["description"]
    if target_job.get("required_skills"):
        jd_text += "\nRequired Skills: " + ", ".join(target_job["required_skills"])
        
    csv_rows = ["Rank,Candidate Name,Email,Overall Match %,Verdict,Top Matching Skills,Missing Skills,Years Experience"]
    
    screened = []
    for cand in PRESET_RESUMES:
        analysis = analyze_resume_explainable(cand["raw_text"], jd_text)
        screened.append({
            "name": cand["name"],
            "email": cand["email"],
            "match_pct": analysis["overall_match_pct"],
            "verdict": analysis["ml_suitability"].get("status_label", analysis["ml_suitability"].get("prediction", "Evaluated")),

            "matching_skills": "; ".join(analysis["strong_matches"][:5]),
            "missing_skills": "; ".join(analysis["missing_skills"][:5]),
            "exp_years": analysis["experience_meta"]["candidate_years"]
        })
        
    screened.sort(key=lambda x: x["match_pct"], reverse=True)
    
    for idx, c in enumerate(screened):
        row = f'{idx+1},"{c["name"]}","{c["email"]}",{c["match_pct"]}%,"{c["verdict"]}","{c["matching_skills"]}","{c["missing_skills"]}",{c["exp_years"]}'
        csv_rows.append(row)
        
    csv_content = "\n".join(csv_rows)
    headers = {
        'Content-Disposition': f'attachment; filename="Candidate_Screening_Report_{jd_id}.csv"'
    }
    return Response(content=csv_content, media_type="text/csv", headers=headers)


@app.post("/api/recommend-jobs")
async def recommend_jobs_endpoint(
    resume_text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """
    Candidate API — Reverse Job Matcher:
    Upload or paste resume -> returns top matching jobs with fit score % and gap analysis.
    """
    text_content = ""
    if file:
        content_bytes = await file.read()
        text_content, _ = parse_resume_file(file.filename, content_bytes)
    elif resume_text:
        text_content = resume_text
        
    if not text_content or len(text_content.strip()) < 10:
        raise HTTPException(status_code=400, detail="Valid resume text or uploaded resume file is required.")
        
    recommendations = recommend_jobs_for_candidate(text_content, JOBS_DB)
    extracted_skills = extract_skills_from_text(text_content)
    
    return {
        "candidate_skills_extracted": extracted_skills,
        "total_jobs_evaluated": len(JOBS_DB),
        "recommendations": recommendations
    }


@app.post("/api/sandbox-nlp")
def sandbox_nlp_inspection(req: SandboxRequest):
    """Interactive NLP Inspector for comparing Level 1 to Level 5 NLP results live."""
    analysis = analyze_resume_explainable(req.resume_text, req.jd_text)
    return {"sandbox_results": analysis}

