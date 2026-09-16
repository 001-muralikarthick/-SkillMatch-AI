import unittest
from backend.nlp.llm_copilot import generate_copilot_insights
from backend.nlp.ai_copilot import generate_interview_questions_and_tips

class TestLLMCopilot(unittest.TestCase):
    def test_fallback_copilot_insights(self):
        """Test deterministic fallback engine when no LLM API key is provided."""
        res = generate_copilot_insights(
            job_title="Senior Full-Stack Engineer",
            matching_skills=["React", "Python", "FastAPI"],
            missing_skills=["Docker", "Kubernetes"],
            experience_years=4.5,
            match_score=82.0,
            provider="fallback"
        )
        
        self.assertEqual(res["job_title"], "Senior Full-Stack Engineer")
        self.assertEqual(res["match_score"], 82.0)
        self.assertEqual(res["provider_used"], "fallback")
        self.assertFalse(res["is_llm_generated"])
        self.assertIn("recruiter_verdict", res)
        self.assertIn("executive_summary", res)
        self.assertIn("strengths", res)
        self.assertIn("watchouts", res)
        self.assertGreaterEqual(len(res["questions"]), 3)
        self.assertGreaterEqual(len(res["candidate_tips"]), 3)

    def test_ai_copilot_wrapper_integration(self):
        """Test ai_copilot wrapper function."""
        res = generate_interview_questions_and_tips(
            job_title="Data Scientist",
            matching_skills=["Python", "Scikit-Learn"],
            missing_skills=["PyTorch", "MLOps"],
            experience_years=2.0,
            match_score=65.0
        )
        
        self.assertIn("questions", res)
        self.assertIn("candidate_tips", res)
        self.assertIn("provider_used", res)

if __name__ == "__main__":
    unittest.main()
