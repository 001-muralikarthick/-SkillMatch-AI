from typing import List, Dict, Any

PRESET_JOBS: List[Dict[str, Any]] = [
    {
        "id": "job-1",
        "title": "Frontend Developer",
        "department": "Engineering",
        "company": "Nexus Web Systems",
        "location": "San Francisco, CA (Hybrid)",
        "experience_required": "3+ years",
        "required_skills": ["React", "JavaScript", "HTML", "CSS", "Git", "REST API"],
        "description": """
Frontend Developer

We are seeking a creative Frontend Developer with 3+ years of experience building modern single-page applications.

Required Skills:
- React.js / React
- JavaScript (ES6+)
- HTML5 & CSS3
- Git version control
- REST API integration

Responsibilities:
- Build responsive, fast, and accessible user interfaces using React and modern CSS.
- Collaborate with backend engineers to integrate REST APIs.
- Optimize application performance and ensure cross-browser compatibility.
"""
    },
    {
        "id": "job-2",
        "title": "Full Stack Engineer",
        "department": "Core Product",
        "company": "CloudPulse Technologies",
        "location": "Remote",
        "experience_required": "4+ years",
        "required_skills": ["React", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript", "Docker", "REST API"],
        "description": """
Full Stack Engineer

Join our high-growth platform team building full-stack web products at scale.

Required Skills:
- React & TypeScript
- Node.js & Express framework
- MongoDB / NoSQL databases
- Docker containerization
- REST API design & GraphQL

Responsibilities:
- Design end-to-end full stack architecture from React UI to Node.js Microservices.
- Manage MongoDB document schemas and Redis caching layers.
- Implement CI/CD deployment pipelines using Docker.
"""
    },
    {
        "id": "job-3",
        "title": "Python Data Scientist / AI Engineer",
        "department": "AI Labs",
        "company": "Cognitive AI Solutions",
        "location": "New York, NY",
        "experience_required": "3+ years",
        "required_skills": ["Python", "Machine Learning", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "NLP", "SQL"],
        "description": """
Python Data Scientist / AI Engineer

Looking for an AI Engineer passionate about Natural Language Processing (NLP) and Machine Learning models.

Required Skills:
- Python (advanced)
- Machine Learning & Deep Learning
- PyTorch or TensorFlow
- Scikit-learn, Pandas, NumPy
- NLP (Sentence Transformers, NLTK, SpaCy)
- SQL databases

Responsibilities:
- Develop NLP algorithms for automated text classification and semantic feature extraction.
- Train predictive machine learning models using Scikit-learn and PyTorch.
- Deploy ML models via FastAPI web services.
"""
    },
    {
        "id": "job-4",
        "title": "Backend Java Engineer",
        "department": "Enterprise Cloud",
        "company": "Apex Financial Systems",
        "location": "Austin, TX",
        "experience_required": "5+ years",
        "required_skills": ["Java", "Spring Boot", "PostgreSQL", "Microservices", "Docker", "AWS", "Git"],
        "description": """
Senior Backend Java Engineer

Seeking a Senior Backend Engineer to develop high-throughput financial transaction microservices.

Required Skills:
- Java (11/17)
- Spring Boot & Hibernate
- PostgreSQL & SQL query optimization
- Microservices Architecture
- AWS Cloud services (EC2, S3)
- Docker & Kubernetes
"""
    },
    {
        "id": "job-5",
        "title": "DevOps & Cloud Engineer",
        "department": "Infrastructure",
        "company": "ScaleOps Cloud",
        "location": "Remote",
        "experience_required": "4+ years",
        "required_skills": ["AWS", "Docker", "Kubernetes", "Terraform", "Linux", "CI/CD", "Python"],
        "description": """
DevOps & Cloud Engineer

Seeking a Cloud DevOps Engineer to manage Kubernetes clusters and automated CI/CD pipelines.

Required Skills:
- AWS Infrastructure
- Docker & Kubernetes (K8s)
- Terraform Infrastructure-as-Code
- Linux System Administration
- CI/CD (GitHub Actions / Jenkins)
- Python / Bash scripting
"""
    }
]

PRESET_RESUMES: List[Dict[str, Any]] = [
    {
        "candidate_id": "cand-1",
        "name": "Candidate A (Alex Chen)",
        "email": "alex.chen@example.com",
        "headline": "Frontend & React Specialist",
        "raw_text": """
ALEX CHEN
San Francisco, CA | alex.chen@example.com | 4+ Years Experience

SUMMARY
Senior Frontend Developer with 4 years of experience specializing in React, JavaScript, HTML, CSS, and Git. Proven track record of building accessible web applications with clean component architecture and REST API integrations.

SKILLS
- Programming: JavaScript, Python, Java
- Frontend: React, HTML, CSS, Redux, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- Tools: Git, Webpack, Postman

EXPERIENCE
Frontend Developer | WebCraft Studios (2022 - Present)
- Developed responsive web interface modules using React and JavaScript.
- Integrated REST API backend services with modern state management.
- Improved page load performance by 35% through code splitting and Vite.

Web Developer | PixelCraft (2020 - 2022)
- Built interactive user landing pages using HTML, CSS, and JavaScript.
- Maintained code repositories using Git and GitHub workflows.

EDUCATION
B.S. in Computer Science | University of California, Berkeley (2016 - 2020)
"""
    },
    {
        "candidate_id": "cand-2",
        "name": "Candidate B (Brenda Miller)",
        "email": "brenda.m@example.com",
        "headline": "Full Stack Engineer (Node & React)",
        "raw_text": """
BRENDA MILLER
Remote | brenda.m@example.com | 5+ Years Experience

SUMMARY
Experienced Full Stack Engineer proficient in React, Node.js, Express, TypeScript, and MongoDB. Passionate about scalable web application design, Docker deployment, and clean REST APIs.

SKILLS
- Frontend: React, TypeScript, HTML, CSS, Next.js
- Backend: Node.js, Express, REST API, GraphQL
- Database: MongoDB, PostgreSQL, Redis
- DevOps: Docker, Git, CI/CD

EXPERIENCE
Full Stack Developer | CloudScale Solutions (2021 - Present)
- Engineered scalable Node.js microservices connected to MongoDB and Redis.
- Built dashboard analytics interfaces with React, TypeScript, and Tailwind.
- Containerized development environments using Docker and Docker Compose.

Software Engineer | TechStart Inc (2019 - 2021)
- Developed RESTful APIs in Express and integrated frontend React clients.

EDUCATION
B.S. in Software Engineering | University of Texas (2015 - 2019)
"""
    },
    {
        "candidate_id": "cand-3",
        "name": "Candidate C (Carlos Rodriguez)",
        "email": "carlos.r@example.com",
        "headline": "AI/ML & Python Engineer",
        "raw_text": """
CARLOS RODRIGUEZ
New York, NY | carlos.r@example.com | 3+ Years Experience

SUMMARY
Data Scientist & AI Engineer with expertise in Python, Machine Learning, NLP, Scikit-learn, PyTorch, Pandas, and SQL. Developed NLP sentiment analysis pipelines and predictive models.

SKILLS
- Languages: Python, SQL, C++
- AI/ML: Machine Learning, NLP, Deep Learning, PyTorch, Scikit-learn
- Data Science: Pandas, NumPy, OpenCV, NLTK
- Tools: Git, Docker, Jupyter Notebooks

EXPERIENCE
AI Data Scientist | DataMind Systems (2022 - Present)
- Trained machine learning classifiers in Scikit-learn achieving 92% accuracy.
- Built NLP text vectorization and semantic search modules using Sentence Transformers.
- Processed complex datasets using Pandas and NumPy.

Data Analyst | Analytics Lab (2020 - 2022)
- Querying relational databases using SQL and creating executive reports.

EDUCATION
M.S. in Data Science | Columbia University (2020 - 2021)
B.S. in Computer Science | NYU (2016 - 2020)
"""
    },
    {
        "candidate_id": "cand-4",
        "name": "Candidate D (David Kim)",
        "email": "david.kim@example.com",
        "headline": "Java Backend Engineer",
        "raw_text": """
DAVID KIM
Austin, TX | david.kim@example.com | 5+ Years Experience

SUMMARY
Senior Java Developer with 5 years of backend engineering experience focusing on Java, Spring Boot, PostgreSQL, Microservices, and Docker.

SKILLS
- Languages: Java, Python, SQL
- Frameworks: Spring Boot, Hibernate, REST API
- Databases: PostgreSQL, MySQL, Redis
- Infrastructure: Docker, AWS, Git

EXPERIENCE
Backend Engineer | Apex Finance (2021 - Present)
- Built high-performance financial API microservices using Java and Spring Boot.
- Optimized PostgreSQL database schema and complex SQL query performance.
- Deployed microservices on AWS EC2 instances with Docker containers.

Java Developer | Enterprise Solutions (2018 - 2021)
- Developed REST API endpoints and transactional business logic in Java.

EDUCATION
B.S. in Computer Engineering | Texas A&M University (2014 - 2018)
"""
    },
    {
        "candidate_id": "cand-5",
        "name": "Candidate E (Elena Rostova)",
        "email": "elena.r@example.com",
        "headline": "DevOps & Infrastructure Specialist",
        "raw_text": """
ELENA ROSTOVA
Seattle, WA | elena.r@example.com | 4+ Years Experience

SUMMARY
DevOps Engineer with 4 years hands-on experience managing AWS cloud infrastructure, Kubernetes, Terraform, Linux systems, and automated CI/CD pipelines.

SKILLS
- Cloud: AWS, GCP
- Containers & Orchestration: Docker, Kubernetes, Helm
- IaC & CI/CD: Terraform, Ansible, GitHub Actions, Jenkins
- Systems & Code: Linux, Bash, Python, Git

EXPERIENCE
DevOps Engineer | CloudGrid Infrastructure (2022 - Present)
- Managed multi-cluster Kubernetes deployments on AWS EKS.
- Wrote Terraform scripts to automate cloud infrastructure provisioning.
- Implemented CI/CD pipelines with GitHub Actions reducing build times by 40%.

Systems Administrator | NetTech (2020 - 2022)
- Managed Linux server clusters and system security configurations.

EDUCATION
B.S. in Information Technology | University of Washington (2016 - 2020)
"""
    }
]
