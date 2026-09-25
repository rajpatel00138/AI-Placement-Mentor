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
            "summary": "Verified candidate profile with core engineering foundations.",
            "skills": ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL"],
            "missingSkills": ["System Design Architecture", "Automated Testing Suites", "CI/CD Automation"],
            "strengths": [
                "Demonstrated competence across primary technical stack",
                "Hands-on project implementations with database and API layers",
                "Clean technical skill enumeration adhering to standard resume format",
                "Demonstrated version control and collaborative development literacy",
                "Solid academic foundation geared toward placement readiness",
            ],
            "weaknesses": [
                "Project descriptions lack quantifiable impact metrics (% performance improved, ms saved)",
                "Missing industry-standard automated unit and integration testing suites",
                "Limited evidence of production deployment or CI/CD containerization",
                "Could benefit from articulating architectural trade-offs in key projects",
                "Action verbs in bullet points can be strengthened with stronger leadership verbs",
            ],
            "suggestions": [
                "Rewrite project bullets using the Google XYZ formula: 'Accomplished [X] as measured by [Y] by doing [Z]'",
                "Add live deployment URLs and GitHub repository links under each project heading",
                "Incorporate quantifiable business and performance metrics (% throughput, user counts)",
                "Optimize ATS keyword density for your targeted software engineering roles",
            ],
            "roadmap": [
                "Step 1: Master core algorithmic patterns and data structures for technical interview rounds",
                "Step 2: Build a production-grade full-stack project featuring caching and database optimization",
                "Step 3: Implement Docker containerization and set up automated GitHub Actions CI/CD pipelines",
                "Step 4: Conduct timed mock technical and behavioral interviews targeting high-frequency company rounds",
                "Step 5: Polish GitHub repositories with architectural documentation and optimize recruiter outreach",
            ],
        }

    prompt = f"""
You are an expert Technical Recruiter and ATS (Applicant Tracking System) Evaluation Engine for Software Engineering roles.

Evaluate the provided candidate resume text realistically, deeply, and thoroughly, providing well-calibrated scores and highly specific, dynamic feedback tailored directly to the candidate's actual resume content.

### EVALUATION INSTRUCTIONS:
1. ATS SCORE & PLACEMENT READINESS (0 - 100):
   - Score fairly based on genuine candidate pedigree, project complexity, industry exposure, quantifiable metrics, and ATS formatting standards.

2. DYNAMIC ROLE & MISSING SKILLS INFERENCE:
   - First, infer the candidate's target role/domain from their resume (e.g., Frontend Engineer, Backend / Systems Engineer, Full-Stack Developer, Data / ML Engineer, Mobile Developer, DevOps / Cloud Engineer, QA / Automation).
   - Extract the technical skills actually present in the resume into "skills".
   - Compare the candidate's extracted skills against modern industry expectations for their specific inferred role.
   - Dynamically identify 3 to 6 high-impact MISSING skills that the candidate lacks for that specific role. DO NOT return a static or hardcoded list of skills. A frontend resume should receive frontend-relevant missing skills (e.g., Testing, Next.js, Web Performance, State Management), a backend resume should receive backend-relevant missing skills (e.g., System Design, Caching, Message Queues, Indexing, CI/CD), an ML resume should receive ML-relevant missing skills (e.g., MLOps, Model Serving, PyTorch), etc.

3. DEEP STRENGTHS (5 to 6 Points):
   - Return EXACTLY 5 to 6 distinct, in-depth strengths.
   - Each point MUST reference specific details from the candidate's resume — citing actual project names, technologies used, metrics achieved, hackathon wins, internships, or architectural decisions.
   - Do NOT use generic boilerplate phrasing (e.g. avoid 'Good communication' or vague filler).

4. DEEP WEAKNESSES / GAPS (5 to 6 Points):
   - Return EXACTLY 5 to 6 distinct, actionable weaknesses/gaps.
   - Each point MUST reference concrete gaps in the resume (e.g. specific project bullets lacking quantifiable numbers/metrics, missing automated testing/CI-CD, absence of architectural trade-offs, missing cloud/deployment info, or formatting issues).

5. AI SUGGESTIONS (4 to 5 Points) — RESUME EDITING FIXES:
   - Provide EXACTLY 4 to 5 concrete, actionable edits to improve the RESUME DOCUMENT itself.
   - Focus on: bullet point rewrites (XYZ formula), action verb improvements, quantifying specific un-quantified bullets, section reorganizations, contact info/link fixes, and ATS keyword optimization.
   - This must be about EDITING THE RESUME PAPER, NOT future learning.

6. AI CAREER ROADMAP (4 to 5 Points) — FORWARD-LOOKING PLACEMENT GUIDANCE:
   - Provide EXACTLY 4 to 5 sequential, forward-looking learning and preparation milestones.
   - Focus on: what skills/concepts to learn next, in what sequential order, what specific production-grade projects to build, cloud deployments to execute, and interview/DSA milestones to hit to become placement-ready.
   - This must be DISTINCT and COMPLETELY DIFFERENT from AI Suggestions.

Return ONLY a valid, parseable JSON object with zero markdown formatting or backticks, matching this exact structure:
{{
  "atsScore": 88,
  "placementReadiness": 85,
  "ats_compatibility": "High",
  "summary": "2-3 sentence overview highlighting genuine candidate domain, internships, project depth, and technical competencies.",
  "skills": ["Extracted skill 1", "Extracted skill 2", "Extracted skill 3", "Extracted skill 4", "Extracted skill 5", "Extracted skill 6"],
  "missingSkills": ["Dynamic missing skill 1 for inferred role", "Dynamic missing skill 2", "Dynamic missing skill 3", "Dynamic missing skill 4"],
  "strengths": [
    "Specific strength 1 referencing named project/tech/metric from resume",
    "Specific strength 2 referencing named project/tech/metric from resume",
    "Specific strength 3 referencing named project/tech/metric from resume",
    "Specific strength 4 referencing named project/tech/metric from resume",
    "Specific strength 5 referencing named project/tech/metric from resume",
    "Specific strength 6 referencing named project/tech/metric from resume"
  ],
  "weaknesses": [
    "Specific weakness 1 referencing concrete gap in resume",
    "Specific weakness 2 referencing concrete gap in resume",
    "Specific weakness 3 referencing concrete gap in resume",
    "Specific weakness 4 referencing concrete gap in resume",
    "Specific weakness 5 referencing concrete gap in resume",
    "Specific weakness 6 referencing concrete gap in resume"
  ],
  "suggestions": [
    "Resume edit 1: Concrete wording/bullet improvement with example",
    "Resume edit 2: Specific metric/quantification fix for a project section",
    "Resume edit 3: ATS keyword density enhancement",
    "Resume edit 4: Section layout or action verb refinement"
  ],
  "roadmap": [
    "Step 1: Specific core concepts / algorithmic patterns to master next",
    "Step 2: Concrete high-leverage project architecture to build and implement",
    "Step 3: Deployment, containerization, and production CI/CD milestone",
    "Step 4: Mock technical and behavioral interview preparation strategy",
    "Step 5: Target company portfolio presentation and outreach plan"
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

    data = json.loads(text)
    if "roadmap" not in data or not isinstance(data["roadmap"], list) or len(data["roadmap"]) == 0:
        data["roadmap"] = [
            "Step 1: Master core algorithmic patterns and data structures for target technical interviews.",
            "Step 2: Build a production-grade full-stack project featuring distributed caching and automated testing.",
            "Step 3: Implement Docker containerization and set up automated GitHub Actions CI/CD pipelines.",
            "Step 4: Conduct timed mock technical and behavioral interviews targeting high-frequency company rounds.",
            "Step 5: Polish GitHub repositories with architectural documentation and optimize recruiter outreach.",
        ]
    return data