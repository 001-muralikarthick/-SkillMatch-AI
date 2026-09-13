import re
from typing import Dict, List, Set, Tuple, Any

# Expanded Taxonomy database categorized by tech domain
SKILL_TAXONOMY: Dict[str, List[str]] = {
    "Programming": [
        "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "C", "Go", "Rust", 
        "Ruby", "PHP", "Kotlin", "Swift", "Scala", "R", "MATLAB", "Perl", "Dart",
        "Elixir", "Haskell", "Lua", "Assembly", "Julia", "Groovy", "Bash", "Shell"
    ],
    "Frontend": [
        "React", "React.js", "Angular", "Vue.js", "Vue", "Next.js", "Nuxt.js", "Svelte",
        "SvelteKit", "Redux", "Zustand", "MobX", "HTML", "HTML5", "CSS", "CSS3",
        "Tailwind CSS", "Tailwind", "Sass", "SCSS", "LESS", "Bootstrap", "MUI", "Chakra UI",
        "Webpack", "Vite", "Babel", "REST API", "RESTful API", "GraphQL", "WebSockets",
        "WebGL", "Three.js", "RxJS", "PWA"
    ],
    "Backend": [
        "Node.js", "Node", "Express", "Express.js", "Spring Boot", "Spring", "Django",
        "Flask", "FastAPI", "NestJS", "ASP.NET", ".NET Core", "Ruby on Rails", "Rails",
        "Laravel", "Symfony", "CodeIgniter", "Microservices", "gRPC", "RabbitMQ",
        "Kafka", "Celery", "Socket.io", "GraphQL API", "Serverless"
    ],
    "Databases": [
        "MongoDB", "PostgreSQL", "Postgres", "MySQL", "Redis", "Elasticsearch",
        "SQLite", "Oracle", "Cassandra", "DynamoDB", "Firebase", "Firestore",
        "MariaDB", "Neo4j", "CouchDB", "Supabase", "SQL", "NoSQL", "TimescaleDB",
        "ClickHouse", "Snowflake", "BigQuery"
    ],
    "Cloud & DevOps": [
        "AWS", "Amazon Web Services", "GCP", "Google Cloud", "Azure", "Docker",
        "Kubernetes", "K8s", "Terraform", "Ansible", "Puppet", "Chef", "Jenkins",
        "CI/CD", "GitHub Actions", "GitLab CI", "Linux", "Unix", "NGINX", "Apache",
        "Cloudflare", "Helm", "ArgoCD", "Prometheus", "Grafana", "OpenTelemetry"
    ],
    "AI, ML & Data Science": [
        "Machine Learning", "Deep Learning", "NLP", "Natural Language Processing",
        "Computer Vision", "PyTorch", "TensorFlow", "Scikit-learn", "Pandas", "NumPy",
        "SciPy", "OpenCV", "LLM", "Generative AI", "RAG", "Sentence Transformers",
        "LangChain", "LlamaIndex", "SpaCy", "NLTK", "Hugging Face", "Data Analysis",
        "Data Engineering", "Apache Spark", "Databricks", "Kafka"
    ],
    "Mobile Development": [
        "React Native", "Flutter", "iOS", "Swift", "Android", "Kotlin", "MAUI",
        "Ionic", "Cordova", "Xcode", "Android Studio"
    ],
    "Testing & QA": [
        "Git", "GitHub", "GitLab", "Jira", "Jest", "Cypress", "Selenium", "Postman",
        "Swagger", "JUnit", "PyTest", "Mocha", "Chai", "Playwright", "Vitest",
        "Robot Framework", "LoadRunner"
    ],
    "Security & Networking": [
        "Cybersecurity", "Penetration Testing", "OWASP", "OAuth", "OAuth2", "JWT",
        "SSL/TLS", "Encryption", "Wireshark", "Metasploit", "Nmap", "SIEM", "IAM"
    ],
    "Architecture & Methodologies": [
        "System Design", "Agile", "Scrum", "Kanban", "OOP", "Object-Oriented Programming",
        "Functional Programming", "Clean Code", "Design Patterns", "Test-Driven Development", "TDD"
    ]
}

# Expanded Skill canonical map (resolves aliases)
SKILL_ALIASES: Dict[str, str] = {
    "react.js": "React",
    "reactjs": "React",
    "js": "JavaScript",
    "ts": "TypeScript",
    "node": "Node.js",
    "nodejs": "Node.js",
    "expressjs": "Express",
    "express.js": "Express",
    "vuejs": "Vue.js",
    "k8s": "Kubernetes",
    "amazon web services": "AWS",
    "google cloud platform": "GCP",
    "google cloud": "GCP",
    "postgres": "PostgreSQL",
    "restful api": "REST API",
    "rest": "REST API",
    "rest-api": "REST API",
    "py": "Python",
    "tailwind": "Tailwind CSS",
    "html5": "HTML",
    "css3": "CSS",
    "scss": "Sass",
    "nextjs": "Next.js",
    "nuxt": "Nuxt.js",
    "sveltekit": "Svelte",
    "django framework": "Django",
    "fast api": "FastAPI",
    "spring boot": "Spring Boot",
    "springboot": "Spring Boot",
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "tf": "TensorFlow",
    "torch": "PyTorch",
    "sklearn": "Scikit-learn",
    "scikit learn": "Scikit-learn",
    "nlp": "NLP",
    "llms": "LLM",
    "large language models": "LLM",
    "react-native": "React Native",
    "ci/cd": "CI/CD",
    "github-actions": "GitHub Actions"
}

# Graph of related/adjacent skills to suggest recommendations
RELATED_SKILLS_GRAPH: Dict[str, List[str]] = {
    "React": ["JavaScript", "Redux", "Next.js", "HTML", "CSS", "TypeScript", "REST API", "Tailwind CSS"],
    "JavaScript": ["React", "Node.js", "TypeScript", "HTML", "CSS", "Express", "Vue.js"],
    "Node.js": ["Express", "MongoDB", "JavaScript", "TypeScript", "REST API", "Redis", "PostgreSQL"],
    "Python": ["Django", "Flask", "FastAPI", "Pandas", "NumPy", "Scikit-learn", "SQL", "PyTorch"],
    "Java": ["Spring Boot", "Hibernate", "Microservices", "SQL", "Docker", "Maven", "PostgreSQL"],
    "TypeScript": ["React", "Node.js", "Angular", "Next.js", "Express", "JavaScript"],
    "REST API": ["Node.js", "Express", "FastAPI", "GraphQL", "Postman", "Swagger"],
    "MongoDB": ["Express", "Node.js", "NoSQL", "Redis", "Mongoose"],
    "PostgreSQL": ["SQL", "Docker", "Python", "Node.js", "Redis", "Prisma"],
    "AWS": ["Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Serverless", "GCP"],
    "Docker": ["Kubernetes", "AWS", "CI/CD", "Linux", "Terraform", "NGINX"],
    "Kubernetes": ["Docker", "AWS", "Terraform", "Helm", "Prometheus", "Linux"],
    "Machine Learning": ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "Pandas", "NumPy", "NLP", "LLM"],
    "PyTorch": ["Python", "Deep Learning", "Machine Learning", "TensorFlow", "NLP", "Computer Vision"],
    "LLM": ["Python", "LangChain", "RAG", "PyTorch", "NLP", "Hugging Face", "Sentence Transformers"],
    "Flutter": ["Dart", "Mobile Development", "React Native", "iOS", "Android"],
    "React Native": ["React", "JavaScript", "TypeScript", "Mobile Development", "Redux"]
}


def normalize_skill_name(skill: str) -> str:
    """Canonicalize skill names using alias map."""
    raw = skill.strip().lower().rstrip('.,;')
    if raw in SKILL_ALIASES:
        return SKILL_ALIASES[raw]
    
    # Capitalization match against taxonomy
    for category, skills in SKILL_TAXONOMY.items():
        for canonical in skills:
            if canonical.lower() == raw:
                return canonical
                
    return skill.strip().rstrip('.,;')


def extract_skills_from_text(text: str) -> List[str]:
    """
    Level 2 — Skill Extraction:
    Scans document text against taxonomy regex patterns and extracts recognized candidate skills.
    """
    if not text:
        return []
        
    found_skills: Set[str] = set()
    cleaned_lower = " " + text.lower() + " "
    
    for category, skills in SKILL_TAXONOMY.items():
        for canonical_skill in skills:
            skill_lower = canonical_skill.lower()
            
            # Pattern matching with boundary checks for C++, C#, .NET, etc.
            if skill_lower in ["c++", "c#", ".net"]:
                escaped = re.escape(skill_lower)
                pattern = r'(?:\b|\s)' + escaped + r'(?:\b|\s)'
            else:
                pattern = r'\b' + re.escape(skill_lower) + r'\b'
                
            if re.search(pattern, cleaned_lower):
                normalized = normalize_skill_name(canonical_skill)
                found_skills.add(normalized)
                
    # Also scan explicit aliases
    for alias, canonical in SKILL_ALIASES.items():
        pattern = r'\b' + re.escape(alias) + r'\b'
        if re.search(pattern, cleaned_lower):
            found_skills.add(canonical)
            
    return sorted(list(found_skills))


def compare_resume_and_jd_skills(resume_skills: List[str], jd_skills: List[str]) -> Dict[str, Any]:
    """
    Compare extracted resume skills against target JD required skills.
    Categorizes into:
    - Matched Skills (✓)
    - Missing Skills (✗)
    - Related Skills (•)
    - Additional Candidate Skills
    """
    resume_set = set(resume_skills)
    jd_set = set(jd_skills)
    
    matched = sorted(list(resume_set.intersection(jd_set)))
    missing = sorted(list(jd_set - resume_set))
    additional = sorted(list(resume_set - jd_set))
    
    # Calculate related skills for missing required skills
    related_set: Set[str] = set()
    for m_skill in missing:
        if m_skill in RELATED_SKILLS_GRAPH:
            for rel in RELATED_SKILLS_GRAPH[m_skill]:
                if rel in resume_set and rel not in matched:
                    related_set.add(rel)
                    
    # Also find related skills that candidate HAS which connect to missing skills
    for c_skill in additional:
        if c_skill in RELATED_SKILLS_GRAPH:
            for rel in RELATED_SKILLS_GRAPH[c_skill]:
                if rel in missing:
                    related_set.add(c_skill)
                    
    skill_match_ratio = (len(matched) / len(jd_set)) if jd_set else 1.0
    skill_match_score_pct = round(skill_match_ratio * 100, 2)
    
    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "related_skills": sorted(list(related_set)),
        "additional_skills": additional,
        "total_jd_skills_count": len(jd_set),
        "matched_count": len(matched),
        "missing_count": len(missing),
        "skill_match_score_pct": skill_match_score_pct
    }
