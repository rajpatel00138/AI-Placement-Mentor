import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("[Python Gemini Service] Warning: GEMINI_API_KEY not found in environment.")

client = genai.Client(api_key=api_key) if api_key else None


def analyze_resume(resume_text: str):
    if not client:
        return {
            "atsScore": 85,
            "placementReadiness": 88,
            "ats_compatibility": "High",
            "skills": ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL"],
            "missingSkills": ["Kubernetes", "CI/CD Pipelines", "System Design"],
            "strengths": ["Clear technical stack", "Demonstrable project portfolio"],
            "weaknesses": ["Add more quantifiable metrics to project descriptions"],
            "suggestions": ["Quantify impact metrics (% performance improved)", "Align keywords with target JD"],
        }

    prompt = f"""
You are an expert Technical Recruiter and ATS (Applicant Tracking System) Evaluation Engine for Software Engineering roles.

Evaluate the provided candidate resume text realistically and fairly, providing well-calibrated scores that span the full 0 to 100 spectrum based on concrete tier standards:

### SCORING RUBRIC (0 - 100):
1. ATS SCORE (0 - 100):
   - 90 - 100 (Exceptional): Clean standard section headings (Contact Info, Education, Skills, Experience, Projects), rich keyword density for modern software stacks (React, Node, TypeScript, Python, SQL, Docker, AWS, DSA), clear action-oriented bullet points.
   - 75 - 89 (Solid / Standard): Clear layout, standard sections present, good keyword coverage with minor formatting or keyword opportunities.
   - 50 - 74 (Average / Needs Refinement): Contains basic info, but lacks comprehensive keyword density, lacks structured bullet points, or has ambiguous sections.
   - Below 50 (Poor): Incomplete document, missing core sections (e.g. no technical skills, no projects, no contact info), or sparse non-technical text.

2. PLACEMENT READINESS (0 - 100):
   - 88 - 98 (Tier-1 Placement Ready / Top 10% Candidate): Real industry internships at recognized tech enterprises (e.g. Walmart, Google, Amazon, ISRO, Microsoft, high-growth startups), quantifiable achievements (% latency reduction, throughput), hackathon/competition wins (SIH, ICPC, LeetCode Knight/Guardian), complex deployed full-stack/systems architectures.
   - 72 - 87 (Strong / Placement Ready): Solid deployed projects in modern frameworks (React, Next.js, Node.js, Python, SQL, Git, DSA), good technical depth, internship or capstone experience.
   - 50 - 71 (Developing / Academic Baseline): Academic coursework, standard tutorial-level projects (e.g. basic calculator, simple to-do list), lacking industry experience, live deployments, or quantitative metrics.
   - Below 50 (Early Stage / High Skill Gap): Non-technical background, no software projects, or missing core programming fundamentals.

Return ONLY a valid, parseable JSON object with zero markdown formatting or backticks, matching this exact structure:
{{
  "atsScore": 92,
  "placementReadiness": 95,
  "ats_compatibility": "High",
  "summary": "2-3 sentence overview highlighting genuine candidate achievements.",
  "skills": ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "Git", "DSA"],
  "missingSkills": ["Kubernetes", "CI/CD Pipelines", "System Design"],
  "strengths": [
    "Specific strength 1 based on actual resume content",
    "Specific strength 2 based on actual resume content"
  ],
  "weaknesses": [
    "Specific actionable weakness 1",
    "Specific actionable weakness 2"
  ],
  "suggestions": [
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2",
    "Specific improvement suggestion 3"
  ]
}}

Candidate Resume Content:
{resume_text[:10000]}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
    )

    text = response.text.strip()

    if text.startswith("```"):
        text = (
            text.replace("```json", "")
            .replace("```", "")
            .strip()
        )

    return json.loads(text)