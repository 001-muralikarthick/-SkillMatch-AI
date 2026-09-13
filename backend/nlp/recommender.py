from typing import List, Dict, Any
from backend.nlp.explainable_engine import analyze_resume_explainable

def recommend_jobs_for_candidate(resume_text: str, job_database: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Reverse AI Matcher:
    Takes candidate resume text, screens it against all available job descriptions,
    ranks the jobs by overall match score (%), and provides tailored gap analysis per role.
    """
    if not resume_text or not job_database:
        return []
        
    recommendations = []
    
    for job in job_database:
        job_id = job.get("id", "")
        title = job.get("title", "Untitled Job")
        jd_text = job.get("description", "")
        required_skills = job.get("required_skills", [])
        
        # Format full JD text if required skills are provided separately
        full_jd_text = jd_text
        if required_skills:
            full_jd_text += "\nRequired Skills: " + ", ".join(required_skills)
            
        analysis = analyze_resume_explainable(resume_text, full_jd_text)
        
        recommendations.append({
            "job_id": job_id,
            "title": title,
            "company": job.get("company", "TechCorp"),
            "location": job.get("location", "Remote"),
            "overall_match_pct": analysis["overall_match_pct"],
            "match_breakdown": analysis["match_breakdown"],
            "matched_skills": analysis["strong_matches"],
            "missing_skills": analysis["missing_skills"],
            "suitability_label": analysis["ml_suitability"]["status_label"],
            "recommendations": analysis["recommended_learning"][:3]
        })
        
    # Sort recommendations by highest match percentage descending
    recommendations.sort(key=lambda x: x["overall_match_pct"], reverse=True)
    return recommendations
