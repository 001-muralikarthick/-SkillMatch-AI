import io
import unittest
from fastapi.testclient import TestClient
from backend.main import app

class TestResumeUploadParser(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_upload_parse_txt_file(self):
        """Test uploading a raw text resume file to /api/upload-parse."""
        resume_content = (
            "Alex Smith\n"
            "Software Engineer with 5 years experience.\n"
            "Skills: Python, React, FastAPI, Docker, SQL, Git.\n"
            "Education: BS in Computer Science from MIT."
        )
        file_bytes = resume_content.encode("utf-8")
        
        response = self.client.post(
            "/api/upload-parse",
            files={"file": ("alex_smith_resume.txt", io.BytesIO(file_bytes), "text/plain")},
            data={"jd_id": "job-1"}
        )
        
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertTrue(json_data["success"])
        self.assertEqual(json_data["file_format"], "TXT")
        
        cand = json_data["candidate"]
        self.assertEqual(cand["name"], "Alex Smith Resume")
        self.assertIn("Python", cand["extracted_skills"])
        self.assertIn("React", cand["extracted_skills"])
        self.assertGreater(cand["overall_match_pct"], 0)
        self.assertIn("[CANDIDATE NAME REDACTED]", cand["anonymized_text"])

    def test_upload_empty_file_fails(self):
        """Test uploading an empty file returns 400 error."""
        response = self.client.post(
            "/api/upload-parse",
            files={"file": ("empty.txt", io.BytesIO(b""), "text/plain")}
        )
        self.assertEqual(response.status_code, 400)

if __name__ == "__main__":
    unittest.main()
