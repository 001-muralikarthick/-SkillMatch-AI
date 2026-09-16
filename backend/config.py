import os

class Config:
    PROJECT_NAME = "ResumeIQ-AI"
    VERSION = "1.0.0"
    SECRET_KEY = os.getenv("SECRET_KEY", "resume_iq_secret_key_2026_super_secure")
    
    # Upload Directories
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    UPLOAD_RESUMES_DIR = os.path.join(BASE_DIR, "backend", "uploads", "resumes")
    UPLOAD_JDS_DIR = os.path.join(BASE_DIR, "backend", "uploads", "job_descriptions")
    
    # Data Directories
    SKILLS_CSV = os.path.join(BASE_DIR, "data", "skills", "skills.csv")
    RAW_JDS_JSON = os.path.join(BASE_DIR, "data", "raw", "job_descriptions", "sample_jds.json")
    
    # Models & Transformers
    EMBEDDINGS_MODEL_NAME = "all-MiniLM-L6-v2"
    
    # Database
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/resumeiq_db")
    
    # LLM & AI Co-Pilot Configuration
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    PREFERRED_LLM_PROVIDER = os.getenv("PREFERRED_LLM_PROVIDER", "auto")

