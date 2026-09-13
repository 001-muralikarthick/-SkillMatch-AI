import re
from typing import Dict, Any, List, Set, Tuple
from backend.nlp.tfidf_matcher import compute_tfidf_similarity
from backend.nlp.skill_extractor import extract_skills_from_text, compare_resume_and_jd_skills
from backend.nlp.ml_classifier import ml_model
from backend.nlp.semantic_matcher import compute_semantic_similarity

def extract_years_of_experience(text: str) -> float:
    """Extract estimated years of professional experience from resume text."""
    if not text:
        return 0.0
        
    patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)',
        r'experience\s*:\s*(\d+)\+?\s*(?:years?|yrs?)',
        r'(\d+)\s*(?:years?|yrs?)\s+working'
    ]
    
    found_years = []
    text_lower = text.lower()
    for p in patterns:
        matches = re.findall(p, text_lower)
        for m in matches:
            try:
                found_years.append(float(m))
            except ValueError:
                pass
                
    if found_years:
        return max(found_years)
        
    # Heuristic based on date ranges (e.g. 2018 - 2023)
    date_matches = re.findall(r'(20\d{2})\s*[\-–to]+\s*(20\d{2}|present|current)', text_lower)
    total_duration = 0.0
    current_year = 2026
    for start_str, end_str in date_matches:
        try:
            start_yr = float(start_str)
            end_yr = current_year if end_str in ['present', 'current'] else float(end_str)
            dur = max(0.0, end_yr - start_yr)
            total_duration += dur
        except ValueError:
            pass
            
    if total_duration > 0:
        return min(total_duration, 20.0)
        
    # Baseline fallback estimate based on resume word count/depth
    word_count = len(text.split())
    if word_count > 400:
        return 4.0
    elif word_count > 200:
        return 2.0
    return 1.0


def extract_required_exp_years(jd_text: str) -> float:
    """Extract required years of experience from job description."""
    if not jd_text:
        return 2.0
    patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:required|experience|exp)',
        r'at least\s*(\d+)\+?\s*(?:years?|yrs?)',
        r'minimum\s*(\d+)\+?\s*(?:years?|yrs?)'
    ]
    for p in patterns:
        m = re.search(p, jd_text.lower())
        if m:
            try:
                return float(m.group(1))
            except ValueError:
                pass
    return 2.0


def calculate_experience_match(resume_text: str, jd_text: str) -> Tuple[float, Dict[str, Any]]:
    """Calculates experience match score based on extracted experience parameters."""
    candidate_exp = extract_years_of_experience(resume_text)
    required_exp = extract_required_exp_years(jd_text)
    
    if candidate_exp >= required_exp:
        score = 100.0
    else:
        ratio = candidate_exp / max(required_exp, 1.0)
        score = round(ratio * 100.0, 1)
        
    return score, {
        "candidate_years": candidate_exp,
        "required_years": required_exp,
        "score_pct": score
    }


def calculate_education_match(resume_text: str, jd_text: str) -> Tuple[float, Dict[str, Any]]:
    """Evaluate education alignment (degrees, certifications, CS background)."""
    text_lower = resume_text.lower()
    
    degrees = []
    if any(k in text_lower for k in ['phd', 'doctorate', 'doctor of philosophy']):
        degrees.append("PhD")
    if any(k in text_lower for k in ['master', 'm.s.', 'ms degree', 'm.tech', 'm.sc']):
        degrees.append("Master's")
    if any(k in text_lower for k in ['bachelor', 'b.s.', 'bs degree', 'b.tech', 'b.e.', 'b.sc']):
        degrees.append("Bachelor's")
    if any(k in text_lower for k in ['bootcamp', 'diploma', 'associate']):
        degrees.append("Certification/Bootcamp")
        
    cs_field = any(k in text_lower for k in [
        'computer science', 'software engineering', 'information technology',
        'data science', 'electrical engineering', 'computer engineering'
    ])
    
    # Base score computation
    if degrees:
        base_score = 90.0 if ("Master's" in degrees or "PhD" in degrees) else 85.0
    else:
        base_score = 70.0
        
    if cs_field:
        base_score = min(100.0, base_score + 10.0)
        
    return round(base_score, 1), {
        "detected_degrees": degrees if degrees else ["Self-taught / Portfolio"],
        "has_cs_degree_field": cs_field,
        "score_pct": base_score
    }


def generate_recommended_learning(missing_skills: List[str]) -> List[Dict[str, str]]:
    """Generate structured learning recommendations for missing candidate skills."""
    learning_paths = []
    
    skill_guides: Dict[str, str] = {
        "Docker": "Learn containerization basics, Dockerfile creation, image building, and multi-container orchestration.",
        "AWS": "Study AWS core services (EC2, S3, Lambda, IAM, CloudFront) and cloud security fundamentals.",
        "Kubernetes": "Master Kubernetes architecture, pod deployment, services, ingress controllers, and Helm charts.",
        "REST API": "Understand HTTP status codes, RESTful resource design, authentication (JWT/OAuth), and API documentation.",
        "GraphQL": "Learn GraphQL schemas, resolvers, query optimization, and Apollo server integration.",
        "React": "Practice component state management, hooks (useEffect, useMemo), React Router, and context API.",
        "TypeScript": "Master strong static typing, interfaces, generics, type aliases, and tsconfig settings.",
        "Node.js": "Understand event loop, asynchronous IO, Express framework routing, and middleware pipelines.",
        "MongoDB": "Practice NoSQL document modeling, indexing, aggregation pipelines, and Mongoose ORM.",
        "PostgreSQL": "Learn relational database normalization, SQL queries, indexing, joins, and ACID transactions."
    }
    
    for skill in missing_skills:
        guide = skill_guides.get(
            skill, 
            f"Build hands-on practice projects using {skill} and complete structured tutorial modules."
        )
        learning_paths.append({
            "skill": skill,
            "recommendation": f"→ {skill}: {guide}"
        })
        
    return learning_paths


def analyze_resume_explainable(resume_text: str, jd_text: str) -> Dict[str, Any]:
    """
    Level 5 — Complete Explainable AI (XAI) Analysis Engine:
    Combines Level 1 (TF-IDF), Level 2 (Skills), Level 3 (ML Classifier), Level 4 (Semantic Embeddings),
    and calculates 5-dimensional breakdown:
    - Overall Match (%)
    - Skills Match (%)
    - Experience Match (%)
    - Education Match (%)
    - Project Relevance (%)
    """
    # Level 1: TF-IDF
    tfidf_score, tfidf_meta = compute_tfidf_similarity(resume_text, jd_text)
    
    # Level 2: Skill Extraction
    r_skills = extract_skills_from_text(resume_text)
    j_skills = extract_skills_from_text(jd_text)
    skill_comparison = compare_resume_and_jd_skills(r_skills, j_skills)
    skills_match_score = skill_comparison["skill_match_score_pct"]
    
    # Experience & Education Match
    exp_score, exp_meta = calculate_experience_match(resume_text, jd_text)
    edu_score, edu_meta = calculate_education_match(resume_text, jd_text)
    
    # Level 4: Semantic Embeddings
    semantic_score, semantic_meta = compute_semantic_similarity(resume_text, jd_text)
    
    # Project Relevance (weighted combination of semantic + TF-IDF)
    project_relevance_score = round(semantic_score * 0.65 + tfidf_score * 0.35, 1)
    
    # Level 3: ML Suitability Model Prediction
    ml_result = ml_model.predict_suitability(
        tfidf_sim=tfidf_score / 100.0,
        skill_coverage=skills_match_score / 100.0,
        exp_match=exp_score / 100.0,
        edu_match=edu_score / 100.0,
        keyword_density=project_relevance_score / 100.0
    )
    
    # Overall Weighted Score Calculation
    overall_match_score = round(
        skills_match_score * 0.35 +
        semantic_score * 0.25 +
        exp_score * 0.20 +
        edu_score * 0.10 +
        project_relevance_score * 0.10,
        1
    )
    
    # Recommended learning path
    learning_recs = generate_recommended_learning(skill_comparison["missing_skills"])
    
    return {
        "overall_match_pct": overall_match_score,
        "match_breakdown": {
            "skills_match_pct": skills_match_score,
            "experience_match_pct": exp_score,
            "education_match_pct": edu_score,
            "project_relevance_pct": project_relevance_score,
            "semantic_similarity_pct": semantic_score,
            "tfidf_similarity_pct": tfidf_score
        },
        "strong_matches": skill_comparison["matched_skills"],
        "missing_skills": skill_comparison["missing_skills"],
        "related_skills": skill_comparison["related_skills"],
        "candidate_skills": r_skills,
        "required_jd_skills": j_skills,
        "recommended_learning": learning_recs,
        "ml_suitability": ml_result,
        "experience_meta": exp_meta,
        "education_meta": edu_meta,
        "level_details": {
            "level1_tfidf": tfidf_meta,
            "level2_skills": skill_comparison,
            "level3_ml": ml_result,
            "level4_semantic": semantic_meta,
            "level5_explainable": {
                "overall_score": overall_match_score,
                "dimension_weights": {
                    "skills": "35%",
                    "semantic": "25%",
                    "experience": "20%",
                    "education": "10%",
                    "projects": "10%"
                }
            }
        }
    }
