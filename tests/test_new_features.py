import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.parsers.resume_parser import anonymize_resume_text
from backend.nlp.ai_copilot import generate_interview_questions_and_tips

class TestNewFeatures(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_anonymize_resume_text(self):
        sample_resume = """
        John Doe
        Email: john.doe@example.com
        Phone: (555) 123-4567
        LinkedIn: https://linkedin.com/in/johndoe
        Experienced Python and React developer located in San Francisco.
        """
        anonymized = anonymize_resume_text(sample_resume, candidate_name="John Doe")
        self.assertIn("[EMAIL REDACTED]", anonymized)
        self.assertNotIn("john.doe@example.com", anonymized)
        self.assertIn("[PHONE REDACTED]", anonymized)
        self.assertNotIn("(555) 123-4567", anonymized)
        self.assertIn("[LINK REDACTED]", anonymized)
        self.assertNotIn("John Doe", anonymized)

    def test_ai_copilot_generation(self):
        result = generate_interview_questions_and_tips(
            job_title="Senior Frontend Engineer",
            matching_skills=["React", "JavaScript"],
            missing_skills=["TypeScript", "GraphQL"],
            experience_years=4.0,
            match_score=75.0
        )
        self.assertGreater(len(result["questions"]), 0)
        self.assertGreater(len(result["candidate_tips"]), 0)
        self.assertIn("TypeScript", result["questions"][0]["question"])

    def test_ai_copilot_endpoint(self):
        response = self.client.post("/api/ai-interview-questions", json={
            "job_title": "Fullstack Engineer",
            "matching_skills": ["Python", "FastAPI"],
            "missing_skills": ["Docker", "Kubernetes"],
            "experience_years": 3.0,
            "match_score": 72.5
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("copilot", data)
        self.assertGreater(len(data["copilot"]["questions"]), 0)

    def test_csv_export_endpoint(self):
        response = self.client.get("/api/export-candidates-csv?jd_id=job-1")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.headers["content-type"].startswith("text/csv"))
        self.assertIn("Rank,Candidate Name", response.text)


if __name__ == '__main__':
    unittest.main()
