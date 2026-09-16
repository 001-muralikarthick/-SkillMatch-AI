import os
import json
import urllib.request
import urllib.parse
from typing import List, Dict, Any, Optional

def _call_gemini_api(prompt: str, api_key: str) -> Optional[str]:
    """Call Google Gemini REST API."""
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.3,
                "responseMimeType": "application/json"
            }
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=12) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            candidates = res_json.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "")
    except Exception as e:
        print(f"[LLM Copilot] Gemini API error: {e}")
    return None

def _call_openai_api(prompt: str, api_key: str) -> Optional[str]:
    """Call OpenAI REST API."""
    try:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are an expert HR Talent Intelligence and Technical Screener AI. Respond strictly in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "response_format": {"type": "json_object"}
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=12) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            choices = res_json.get("choices", [])
            if choices:
                return choices[0].get("message", {}).get("content", "")
    except Exception as e:
        print(f"[LLM Copilot] OpenAI API error: {e}")
    return None

def _call_ollama_api(prompt: str, host: str = "http://localhost:11434") -> Optional[str]:
    """Call Ollama local LLM REST API."""
    try:
        url = f"{host.rstrip('/')}/api/generate"
        headers = {"Content-Type": "application/json"}
        payload = {
            "model": "llama3",
            "prompt": prompt,
            "format": "json",
            "stream": False
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=15) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            return res_json.get("response", "")
    except Exception as e:
        print(f"[LLM Copilot] Ollama API error: {e}")
    return None


def generate_copilot_insights(
    job_title: str,
    matching_skills: List[str],
    missing_skills: List[str],
    experience_years: float,
    match_score: float,
    provider: Optional[str] = None,
    api_key: Optional[str] = None,
    resume_text: Optional[str] = None,
    jd_text: Optional[str] = None
) -> Dict[str, Any]:
    """
    Unified AI Co-Pilot pipeline with fallback engine.
    Supports provider = 'gemini' | 'openai' | 'ollama' | 'fallback' (auto-detects keys if not set).
    """
    env_gemini_key = api_key or os.getenv("GEMINI_API_KEY", "")
    env_openai_key = api_key or os.getenv("OPENAI_API_KEY", "")
    ollama_host = os.getenv("OLLAMA_HOST", "http://localhost:11434")

    chosen_provider = provider or os.getenv("PREFERRED_LLM_PROVIDER", "auto")
    
    if chosen_provider == "auto":
        if env_gemini_key:
            chosen_provider = "gemini"
        elif env_openai_key:
            chosen_provider = "openai"
        else:
            chosen_provider = "fallback"

    llm_raw_response = None
    used_provider = "fallback"

    prompt = f"""
    You are an AI Recruitment Copilot evaluating a candidate for the role of '{job_title}'.
    Candidate Match Score: {match_score}%
    Years of Experience: {experience_years}
    Matching Skills: {', '.join(matching_skills) if matching_skills else 'None'}
    Missing Skill Gaps: {', '.join(missing_skills) if missing_skills else 'None'}
    
    Please provide a JSON object with the following exact keys:
    1. "executive_summary": A concise 2-3 sentence executive assessment for the recruiter.
    2. "recruiter_verdict": One of ["Strong Candidate", "Good Potential", "Skill Gap Alert"].
    3. "strengths": Array of 2-3 key candidate technical/experience highlights.
    4. "watchouts": Array of 1-3 potential risks or missing prerequisite areas to probe.
    5. "questions": Array of 3-4 object items, each with:
       - "category": e.g. "Skill Gap: Docker"
       - "question": Detailed technical or scenario question
       - "what_to_look_for": Specific answer key / depth indicator for recruiters
    6. "candidate_tips": Array of 3 object items, each with:
       - "title": Concise action title
       - "detail": ATS resume optimization recommendation
    """

    if chosen_provider == "gemini" and env_gemini_key:
        llm_raw_response = _call_gemini_api(prompt, env_gemini_key)
        if llm_raw_response:
            used_provider = "gemini"
    elif chosen_provider == "openai" and env_openai_key:
        llm_raw_response = _call_openai_api(prompt, env_openai_key)
        if llm_raw_response:
            used_provider = "openai"
    elif chosen_provider == "ollama":
        llm_raw_response = _call_ollama_api(prompt, ollama_host)
        if llm_raw_response:
            used_provider = "ollama"

    # Try parsing LLM JSON output
    if llm_raw_response:
        try:
            parsed = json.loads(llm_raw_response)
            parsed["provider_used"] = used_provider
            parsed["is_llm_generated"] = True
            parsed["job_title"] = job_title
            parsed["match_score"] = match_score
            return parsed
        except Exception as err:
            print(f"[LLM Copilot] Failed to parse JSON from {used_provider}: {err}")

    # Fallback Engine (Rule-based)
    questions = []
    if missing_skills:
        for skill in missing_skills[:3]:
            questions.append({
                "category": f"Skill Gap: {skill}",
                "question": f"The job description highlights '{skill}', which wasn't explicitly detected on your resume. Could you share your hands-on experience or relevant projects working with {skill}?",
                "what_to_look_for": f"Assess practical knowledge of {skill}, willingness to learn, or equivalent experience with related tools."
            })

    if len(questions) < 3:
        top_skill = matching_skills[0] if matching_skills else "Core Tech"
        questions.append({
            "category": f"Mastery: {top_skill}",
            "question": f"You demonstrated proficiency in {top_skill}. Describe a complex production challenge you solved using {top_skill} and how you measured impact.",
            "what_to_look_for": f"Depth of mastery in {top_skill}, architectural decision-making, and metrics-driven outcomes."
        })
        questions.append({
            "category": "System Architecture & Trade-offs",
            "question": f"For the position of {job_title}, describe a situation where you had to balance rapid delivery against technical debt and architectural scalability.",
            "what_to_look_for": "Pragmatic engineering judgment, communication skills, and code maintainability standards."
        })

    tips = []
    if missing_skills:
        missing_str = ", ".join(missing_skills[:3])
        tips.append({
            "title": f"Explicitly Highlight Skill Gaps ({missing_str})",
            "detail": f"If you have hands-on experience with {missing_str}, list them explicitly in a dedicated 'Technical Skills' section."
        })
    tips.append({
        "title": "Quantify Accomplishments & Impact",
        "detail": "Transform bullet points from passive task lists to metric-backed outcomes (e.g., 'Optimized API latency by 35%')."
    })
    tips.append({
        "title": "Align Resume Keywords with Role",
        "detail": f"Tailor your summary section to reflect key terms for '{job_title}' to maximize ATS index scores."
    })

    if match_score >= 80:
        verdict = "Strong Candidate — High alignment on core technical requirements and experience level."
        strengths = [
            f"Strong match on core skills ({', '.join(matching_skills[:3])})",
            f"Solid experience alignment ({experience_years} years detected)"
        ]
        watchouts = ["Verify depth on edge cases during technical round."]
    elif match_score >= 60:
        verdict = "Good Potential — Matches core requirements but has manageable skill gaps. Recommended for technical phone screen."
        strengths = [f"Foundational alignment on key requirements ({', '.join(matching_skills[:2]) if matching_skills else 'General Tech'})"]
        watchouts = [f"Skill gaps identified: {', '.join(missing_skills[:2]) if missing_skills else 'Domain specific tools'}"]
    else:
        verdict = "Skill Gap Alert — Substantial missing skill requirements. Consider screening for lower seniority or alternative roles."
        strengths = ["Has relevant baseline technical exposure."]
        watchouts = [f"Major missing skills: {', '.join(missing_skills[:3]) if missing_skills else 'Core skills'}"]

    return {
        "job_title": job_title,
        "match_score": match_score,
        "recruiter_verdict": verdict,
        "executive_summary": f"Candidate scores {match_score}% alignment for {job_title}. {verdict}",
        "strengths": strengths,
        "watchouts": watchouts,
        "questions": questions[:4],
        "candidate_tips": tips,
        "key_focus_area": f"Focus interview on missing skills ({', '.join(missing_skills[:3]) if missing_skills else 'Architectural Depth'})",
        "provider_used": "fallback",
        "is_llm_generated": False
    }
