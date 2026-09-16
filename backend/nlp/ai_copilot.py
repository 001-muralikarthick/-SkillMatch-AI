from typing import List, Dict, Any, Optional
from backend.nlp.llm_copilot import generate_copilot_insights

def generate_interview_questions_and_tips(
    job_title: str,
    matching_skills: List[str],
    missing_skills: List[str],
    experience_years: float,
    match_score: float,
    provider: Optional[str] = None,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generates AI Recruiter Co-Pilot insights:
    1. Custom technical interview questions targeting identified missing skill gaps.
    2. Candidate resume improvement recommendations.
    3. Executive candidate summary & risk watchouts.
    """
    return generate_copilot_insights(
        job_title=job_title,
        matching_skills=matching_skills,
        missing_skills=missing_skills,
        experience_years=experience_years,
        match_score=match_score,
        provider=provider,
        api_key=api_key
    )
