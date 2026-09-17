# 🚀 SkillMatch AI — Explainable AI Candidate Screening & Talent Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Transformers](https://img.shields.io/badge/Sentence--BERT-v2.5.0-orange?logo=huggingface&logoColor=white)](https://huggingface.co)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**SkillMatch AI** is a recruitment intelligence platform built using **Python, FastAPI, Sentence-BERT, Scikit-Learn, and React.js**. It automates candidate resume parsing, calculates multi-dimensional match scores (0-100%), redacts candidate PII for unbiased screening, and generates custom AI technical interview questions.

---

## ✨ Key Features

### 1. 🛡️ Blind / Anonymized Screening (Ethical AI & Bias Mitigation)
- **Automatic PII Redaction**: Regex-powered PII mask that removes candidate names, emails, phone numbers, and location details (`[CANDIDATE NAME REDACTED]`, `[EMAIL REDACTED]`, `[PHONE REDACTED]`).
- **1-Click Toggle**: Switch between full candidate profiles and unbiased screening mode.

### 2. 🤖 Multi-Provider LLM Recruiter Co-Pilot (Executive Summary, Interview Questions & Resume Optimizer)
- **Multi-LLM Integration**: Supports **Google Gemini API**, **OpenAI GPT-4o-mini**, **Local Ollama LLMs**, and an enhanced **Fast Rule Engine**.
- **Executive Candidate Summary**: Synthesizes 5-dimensional scores into executive recruiter recommendations, key technical strengths, and probe watchout areas.
- **Custom Technical Questions**: Generates tailored technical & behavioral interview questions targeting missing skill gaps with *"What to look for"* guidance for recruiters.
- **ATS Resume Tailoring Guidance**: Actionable advice for candidates on keyword positioning and metric-backed impact framing.


### 3. 📊 5-Dimensional Explainable Scoring Engine
Instead of black-box predictions, SkillMatch AI evaluates candidate alignment across 5 weighted dimensions:
- 🟢 **Skill Taxonomy Coverage (35%)**: Canonical alias extraction & exact match overlap.
- 🔵 **Semantic Embedding Fit (25%)**: Cosine similarity using Sentence-BERT (`all-MiniLM-L6-v2`).
- 🟣 **Experience Level Alignment (20%)**: Extracted years of experience vs required job threshold.
- 🟡 **Education Profile Match (10%)**: Degrees & STEM background evaluation.
- 🟠 **Project Context Relevance (10%)**: TF-IDF keyword density across domain terms.

### 4. 📥 Executive Exporter (PDF & CSV)
- **Candidate Pool CSV**: Export entire ranked candidate pools as a downloadable `.csv` report.
- **Printable PDF Scorecard**: Generate formatted 1-page printable scorecards with print-optimized CSS layout.

### 5. ⚡ Live Resume Drag & Drop Uploader & Real-Time AI Parser
- **Multi-Format Document Parsing**: Drag & drop `.pdf`, `.docx`, or `.txt` resumes for instant text extraction.
- **On-The-Fly Skill Taxonomy & PII Preview**: Auto-detect canonical skills, preview blind PII redactions, and calculate 5-dimensional explainable match scores against active job descriptions.
- **1-Click Candidate Dashboard Sync**: Instantly inject parsed candidates into the active recruiter screening pool.

---


## 🛠️ Architecture & Tech Stack

```
                     ┌──────────────────────────────┐
                     │   React.js Frontend (Vite)   │
                     └──────────────┬───────────────┘
                                    │ REST API
                     ┌──────────────▼───────────────┐
                     │     FastAPI Microservices    │
                     └──────────────┬───────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
│ PyPDF / Docx Parser│   │ TF-IDF / NLTK NLP  │   │ SentenceTransformer│
└────────────────────┘   └────────────────────┘   └────────────────────┘
```

- **Backend Framework:** FastAPI (Python 3.10+)
- **NLP & Machine Learning:** Sentence-Transformers (BERT), Scikit-Learn, NLTK, NumPy, Pandas
- **Resume Document Parsers:** PyPDF, python-docx, Python Regex PII Engine
- **Frontend App:** React.js, Vite, Lucide-React, Glassmorphism CSS Design

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 2. Backend Setup
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/SkillMatch-AI.git
cd SkillMatch-AI

# Create & activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Start FastAPI dev server
python -m uvicorn backend.main:app --reload --port 8000
```
*API Swagger Documentation will be live at: `http://localhost:8000/docs`*

### 3. Frontend Setup
Open a new terminal window in the root directory:
```bash
cd frontend

# Install Node modules
npm install

# Start React development server
npm run dev
```
*Web App will be running live at: `http://localhost:5173`*

---

## 🧪 Running Unit Tests
```bash
python -m unittest tests/test_new_features.py
```

---

## 📄 License
This project is licensed under the **MIT License**.
