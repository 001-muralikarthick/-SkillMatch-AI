from typing import List, Dict, Any

def generate_interview_questions_and_tips(
    job_title: str,
    matching_skills: List[str],
    missing_skills: List[str],
    experience_years: float,
    match_score: float
) -> Dict[str, Any]:
    """
    Generates AI Recruiter Co-Pilot insights:
    1. Custom technical interview questions targeting identified missing skill gaps.
    2. Candidate resume improvement recommendations.
    3. Interview focus areas for recruiters.
    """
    questions = []
    
    # 1. Generate skill-gap specific interview questions
    if missing_skills:
        for skill in missing_skills[:4]:
            q_template = {
                "category": f"Skill Gap: {skill}",
                "question": f"The job description highlights '{skill}', which wasn't explicitly found on your resume. Could you share your hands-on experience or relevant projects working with {skill}?",
                "what_to_look_for": f"Assess practical knowledge of {skill}, willingness to learn, or equivalent experience with related tools."
            }
            questions.append(q_template)
            
    # Fallback/General technical questions if missing skills are few
    if len(questions) < 3:
        if matching_skills:
            top_skill = matching_skills[0]
            questions.append({
                "category": f"Core Competency: {top_skill}",
                "question": f"You demonstrated strong proficiency in {top_skill}. Describe a complex engineering problem you solved using {top_skill} and how you measured success.",
                "what_to_look_for": f"Depth of mastery in {top_skill}, architectural decision-making, and metrics-driven outcomes."
            })
        questions.append({
            "category": "System Architecture & Trade-offs",
            "question": f"For the position of {job_title}, describe a situation where you had to balance quick delivery against technical debt and architectural scalability.",
            "what_to_look_for": "Pragmatic engineering judgment, communication skills, and code maintainability standards."
        })
        
    # 2. Generate Candidate Resume Improvement Tips
    tips = []
    if missing_skills:
        missing_str = ", ".join(missing_skills[:3])
        tips.append({
            "title": f"Explicitly Highlight Key Missing Skills ({missing_str})",
            "detail": f"If you have experience with {missing_str}, explicitly list them in a dedicated 'Technical Skills' section with key framework names."
        })
    
    tips.append({
        "title": "Quantify Accomplishments & Business Impact",
        "detail": "Transform bullet points from task lists to metric-backed results (e.g., 'Optimized API response latency by 35%' or 'Scaled microservices to 10k daily users')."
    })
    
    tips.append({
        "title": "Align Resume Keywords with Job Requirements",
        "detail": f"Tailor your summary section to match the specific requirements of roles like '{job_title}' to boost ATS keyword indexing."
    })
    
    # 3. Recruiter Recommendation Summary
    if match_score >= 80:
        rec_status = "Strong Candidate — High alignment on core technical requirements and experience level."
    elif match_score >= 60:
        rec_status = "Good Potential — Matches core requirements but has manageable skill gaps. Recommended for technical phone screen."
    else:
        rec_status = "Skill Gap Alert — Substantial missing skill requirements. Consider screening for lower seniority or alternative roles."

    return {
        "job_title": job_title,
        "match_score": match_score,
        "recruiter_verdict": rec_status,
        "questions": questions[:4],
        "candidate_tips": tips,
        "key_focus_area": f"Focus interview on missing skills ({', '.join(missing_skills[:3]) if missing_skills else 'Architectural Depth'})"
    }
