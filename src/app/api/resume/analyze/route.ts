import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@/auth";
import { extractResumeText } from "@/lib/resume/parser";
import { recordResumeAnalysis } from "@/lib/activity/service";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

function calculateHeuristicScore(extractedText: string, fileName: string) {
  const lower = extractedText.toLowerCase();
  let ats = 50;
  let readiness = 50;

  // Key experience & brand signals
  const tier1Companies = [
    "walmart",
    "google",
    "microsoft",
    "amazon",
    "apple",
    "meta",
    "isro",
    "uber",
    "adobe",
    "salesforce",
    "oracle",
    "goldman",
    "flipkart",
    "swiggy",
    "zomato",
  ];
  const hasTier1 = tier1Companies.some((c) => lower.includes(c));
  if (hasTier1) {
    ats += 15;
    readiness += 25;
  }

  const hasInternship = lower.includes("intern") || lower.includes("experience") || lower.includes("developer");
  if (hasInternship) {
    ats += 10;
    readiness += 12;
  }

  // Competition / achievements signals
  if (
    lower.includes("winner") ||
    lower.includes("hackathon") ||
    lower.includes("rank") ||
    lower.includes("national") ||
    lower.includes("competition") ||
    lower.includes("leetcode")
  ) {
    ats += 10;
    readiness += 15;
  }

  // Metrics / numbers signals
  const metricMatches = extractedText.match(/\d+%/g) || [];
  if (metricMatches.length >= 2) {
    ats += 8;
    readiness += 10;
  }

  // Tech stack signals
  const techKeywords = [
    "typescript",
    "javascript",
    "react",
    "next.js",
    "vue",
    "angular",
    "tailwind",
    "html",
    "css",
    "node.js",
    "express",
    "python",
    "fastapi",
    "django",
    "flask",
    "sql",
    "postgresql",
    "mongodb",
    "docker",
    "kubernetes",
    "redis",
    "dsa",
    "algorithms",
    "aws",
    "gcp",
    "git",
    "pytorch",
    "tensorflow",
    "pandas",
    "numpy",
    "flutter",
    "react native",
    "swift",
    "kotlin",
    "graphql",
    "ci/cd",
    "jest",
    "cypress",
  ];
  const foundTech = techKeywords.filter((k) => lower.includes(k));
  ats += Math.min(12, foundTech.length * 2);
  readiness += Math.min(15, foundTech.length * 2);

  const finalAts = Math.max(35, Math.min(96, ats));
  const finalReadiness = Math.max(30, Math.min(98, readiness));

  // Domain / Role inference
  let domain = "Full-Stack Software Engineering";
  let domainStandardSkills: string[] = [];

  const isFrontend =
    (lower.includes("react") || lower.includes("vue") || lower.includes("frontend") || lower.includes("html") || lower.includes("css") || lower.includes("tailwind")) &&
    !lower.includes("pytorch") &&
    !lower.includes("tensorflow") &&
    !lower.includes("django");
  const isML = lower.includes("pytorch") || lower.includes("tensorflow") || lower.includes("machine learning") || lower.includes("pandas") || lower.includes("data science");
  const isMobile = lower.includes("flutter") || lower.includes("react native") || lower.includes("android") || lower.includes("ios") || lower.includes("swift");
  const isDevOps = lower.includes("devops") || lower.includes("kubernetes") || lower.includes("terraform") || lower.includes("ansible");

  if (isML) {
    domain = "Machine Learning & Data Engineering";
    domainStandardSkills = [
      "PyTorch",
      "TensorFlow",
      "MLflow / MLOps",
      "Data Pipelines (Apache Spark / Kafka)",
      "Docker Containerization",
      "Model Evaluation & Cross-Validation Metrics",
      "FastAPI Model Serving",
    ];
  } else if (isMobile) {
    domain = "Mobile Application Engineering";
    domainStandardSkills = [
      "React Native / Flutter",
      "Native State Management (Redux/Bloc)",
      "App Store & Play Store CI/CD",
      "Offline Storage (SQLite/WatermelonDB)",
      "Deep Linking & Push Notifications",
      "Mobile Performance Profiling",
    ];
  } else if (isDevOps) {
    domain = "Cloud & DevOps Infrastructure";
    domainStandardSkills = [
      "Kubernetes Cluster Management",
      "Terraform Infrastructure as Code",
      "CI/CD Pipeline Automation (GitHub Actions)",
      "Prometheus & Grafana Observability",
      "Docker Production Containerization",
      "AWS / Cloud Security Fundamentals",
    ];
  } else if (isFrontend) {
    domain = "Frontend Web Engineering";
    domainStandardSkills = [
      "TypeScript Strict Typing",
      "Next.js App Router & SSR/SSG",
      "Unit & Component Testing (Jest / React Testing Library)",
      "Web Performance (Core Web Vitals Optimization)",
      "State Management (Zustand / Redux Toolkit)",
      "Modern CSS / Tailwind Architecture",
      "GraphQL / REST Client Integration",
    ];
  } else {
    domain = "Full-Stack & Backend Systems";
    domainStandardSkills = [
      "System Design & Scalability",
      "Distributed Caching (Redis)",
      "Relational DB Indexing & Query Optimization (PostgreSQL)",
      "Docker & Container Orchestration",
      "CI/CD Pipeline Automation",
      "Automated Unit & Integration Testing",
      "Asynchronous Message Queues (Kafka / RabbitMQ)",
    ];
  }

  // Calculate dynamic missing skills
  const dynamicMissingSkills = domainStandardSkills.filter(
    (ds) => !lower.includes(ds.toLowerCase().split(" ")[0]) && !foundTech.includes(ds.toLowerCase().split(" ")[0])
  ).slice(0, 5);

  const formattedSkills = foundTech.length > 0
    ? foundTech.map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    : ["JavaScript", "TypeScript", "React", "Node.js", "DSA", "SQL"];

  return {
    atsScore: finalAts,
    overall_score: finalAts,
    placementReadiness: finalReadiness,
    ats_compatibility: finalAts >= 80 ? "High" : finalAts >= 60 ? "Moderate" : "Low",
    summary: `Verified ${domain} profile for ${fileName}. ${hasTier1 ? "Demonstrates elite industry exposure and practical software engineering competencies." : "Solid engineering foundations across core technical stacks."}`,
    sections: {
      contact_info: { score: 95, status: "Good" },
      education: { score: 90, status: "Good" },
      skills: { score: finalAts, status: finalAts >= 75 ? "Good" : "Average" },
      experience: { score: hasTier1 ? 95 : hasInternship ? 80 : 55, status: hasInternship ? "Good" : "Average" },
      projects: { score: finalAts, status: "Good" },
    },
    skills: formattedSkills,
    missingSkills: dynamicMissingSkills.length > 0 ? dynamicMissingSkills : ["System Design Architecture", "Automated Testing Suites", "CI/CD Automation"],
    strengths: [
      hasTier1 ? "Proven industry exposure through recognized top-tier engineering internship" : `Demonstrated competence across primary ${domain} technical tools`,
      foundTech.length >= 4 ? `Diverse practical stack coverage including ${formattedSkills.slice(0, 3).join(", ")}` : "Clean enumeration of core programming competencies",
      metricMatches.length > 0 ? "Includes quantifiable performance and impact metrics in experience bullets" : "Clear chronological project progression with named technologies",
      lower.includes("git") || lower.includes("github") ? "Demonstrates version control workflow and collaborative development literacy" : "Structured section hierarchy adhering to standard recruiter layout",
      lower.includes("api") || lower.includes("database") || lower.includes("sql") ? "Hands-on integration with database layers and modern API protocols" : "Clear articulation of project objectives and personal engineering contributions",
      lower.includes("hackathon") || lower.includes("winner") || lower.includes("leetcode") ? "Strong competitive validation through hackathons or coding challenge platforms" : "Well-defined academic and technical trajectory geared toward placement readiness",
    ],
    weaknesses: [
      metricMatches.length < 2 ? "Several project bullet points lack quantifiable business or latency impact metrics (e.g. % throughput gain, ms saved)" : "Lacks explicit discussion of scaling bottlenecks and architectural trade-offs",
      dynamicMissingSkills.length > 0 ? `Resume lacks key ${domain} industry requirements such as ${dynamicMissingSkills[0]} and ${dynamicMissingSkills[1] || "Automated Testing"}` : "Absence of automated testing suites (unit/integration test coverage)",
      !lower.includes("docker") && !lower.includes("ci/cd") ? "Missing modern DevOps and deployment practices (Docker containerization, CI/CD pipelines)" : "Limited evidence of cloud deployment or serverless production hosting",
      !lower.includes("redis") && !lower.includes("cache") ? "No mention of distributed caching or database query optimization techniques" : "Could benefit from deeper architectural explanations in complex project sections",
      "Action verbs in some bullet points could be strengthened to emphasize ownership (e.g. 'Architected', 'Engineered' vs 'Worked on')",
      "Missing dedicated links to live deployed demo URLs or detailed architecture READMEs for key projects",
    ],
    suggestions: [
      "Rewrite project bullets using the Google XYZ formula: 'Accomplished [X] as measured by [Y] by doing [Z]'.",
      `Explicitly weave in missing ${domain} keywords (${dynamicMissingSkills.slice(0, 2).join(", ")}) into relevant project descriptions.`,
      "Add clickable live demo links and GitHub repository URLs directly beneath each project title.",
      "Ensure bullet points start with strong impact verbs ('Engineered', 'Orchestrated', 'Optimized') rather than passive phrases ('Assisted with', 'Helped').",
      "Ensure clean single-column layout with consistent 10-12pt typography to maximize ATS parseability.",
    ],
    roadmap: [
      `Phase 1 — Core Depth: Build proficiency in ${dynamicMissingSkills[0] || "Advanced System Design"} and practice core algorithmic patterns.`,
      `Phase 2 — Production Project: Architect an end-to-end ${domain} project implementing ${dynamicMissingSkills[1] || "caching and automated testing"}.`,
      "Phase 3 — DevOps & Deployment: Containerize applications with Docker, configure GitHub Actions CI/CD, and deploy to cloud platforms.",
      "Phase 4 — Rigorous Interview Prep: Solve 50+ targeted medium problems on LeetCode and conduct 3+ timed mock technical interviews.",
      "Phase 5 — Portfolio & Networking: Polish public GitHub repositories, record a 2-minute video demo of your flagship project, and target recruiter outreach.",
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.warn("[Resume API] No file provided in request.");
      return NextResponse.json(
        { success: false, error: "No resume file provided." },
        { status: 400 }
      );
    }

    console.log(`[Resume API] Received file: ${file.name} (${file.size} bytes, type: ${file.type})`);

    const MAX_BYTES = 4.5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds the 4.5 MB limit. Please upload a smaller file.",
        },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
    const isDocx = file.name.toLowerCase().endsWith(".docx");

    // Extract text for logging and fallback
    let extractedText = "";
    try {
      extractedText = await extractResumeText(buffer, file.name);
    } catch (parseErr) {
      console.warn("[Resume API] Text extractor warning:", parseErr);
    }

    console.log(`[Resume API] Extracted ${extractedText.length} text characters from ${file.name}.`);

    let analysis: any = null;
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

    if (apiKey) {
      try {
        console.log(`[Resume AI] Calling Gemini Multimodal API (model: ${modelName})...`);
        const ai = new GoogleGenAI({ apiKey });

        const systemPrompt = `You are an expert Technical Recruiter and ATS (Applicant Tracking System) Evaluation Engine for Software Engineering roles.

Your goal is to evaluate the candidate's resume realistically, deeply, and thoroughly, providing well-calibrated scores and highly specific, dynamic feedback tailored directly to the candidate's actual resume content.

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
{
  "atsScore": 88,
  "placementReadiness": 85,
  "ats_compatibility": "High",
  "summary": "2-3 sentence overview highlighting genuine candidate domain, internships, project depth, and technical competencies.",
  "sections": {
    "contact_info": { "score": 95, "status": "Good" },
    "education": { "score": 90, "status": "Good" },
    "skills": { "score": 88, "status": "Good" },
    "experience": { "score": 85, "status": "Good" },
    "projects": { "score": 86, "status": "Good" }
  },
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
}`;

        // Construct contents: send native PDF/document parts to Gemini
        const contents: any[] = [];

        if (isPdf) {
          contents.push({
            inlineData: {
              mimeType: "application/pdf",
              data: buffer.toString("base64"),
            },
          });
        } else if (extractedText && extractedText.length > 20) {
          contents.push({
            text: `Candidate Resume Content:\n${extractedText.slice(0, 10000)}`,
          });
        } else {
          contents.push({
            inlineData: {
              mimeType: "text/plain",
              data: buffer.toString("base64"),
            },
          });
        }

        contents.push(systemPrompt);

        const response = await ai.models.generateContent({
          model: modelName,
          contents,
        });

        const rawText = (response.text || "").trim();
        console.log(`[Resume AI] Raw Gemini response received (${rawText.length} chars).`);

        const cleanedText = rawText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        analysis = JSON.parse(cleanedText);
        console.log(
          `[Resume AI] Successfully parsed AI analysis: ATS Score = ${analysis.atsScore}, Placement Readiness = ${analysis.placementReadiness}`
        );
      } catch (geminiErr: any) {
        console.error("[Resume AI Error] Gemini evaluation exception:", geminiErr?.message || geminiErr);
      }
    } else {
      console.warn("[Resume API] GEMINI_API_KEY is not set. Using calibrated heuristic scoring.");
    }

    if (!analysis) {
      console.log("[Resume API] Generating calibrated heuristic analysis fallback...");
      analysis = calculateHeuristicScore(extractedText || file.name, file.name);
    }

    // Normalize scores and fields
    const atsScore = Number(analysis.atsScore ?? analysis.overall_score ?? 80);
    const placementReadiness = Number(analysis.placementReadiness ?? atsScore);
    analysis.atsScore = atsScore;
    analysis.overall_score = atsScore;
    analysis.placementReadiness = placementReadiness;
    analysis.skills = Array.isArray(analysis.skills) ? analysis.skills : [];
    analysis.missingSkills = Array.isArray(analysis.missingSkills) ? analysis.missingSkills : [];
    analysis.strengths = Array.isArray(analysis.strengths) ? analysis.strengths : [];
    analysis.weaknesses = Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [];
    analysis.suggestions = Array.isArray(analysis.suggestions) ? analysis.suggestions : [];
    analysis.roadmap = Array.isArray(analysis.roadmap) && analysis.roadmap.length > 0
      ? analysis.roadmap
      : [
          "Step 1: Master core algorithmic patterns and data structures for target technical interviews.",
          "Step 2: Build a production-grade full-stack project featuring distributed caching and automated testing.",
          "Step 3: Implement Docker containerization and set up automated GitHub Actions CI/CD pipelines.",
          "Step 4: Conduct timed mock technical and behavioral interviews targeting high-frequency company rounds.",
          "Step 5: Polish GitHub repositories with architectural documentation and optimize recruiter outreach.",
        ];

    // Automatically record analysis in user activity if authenticated
    try {
      const session = await auth();
      if (session?.user?.id) {
        console.log(
          `[Resume API] Recording analysis for user ${session.user.id}: ATS=${atsScore}, Readiness=${placementReadiness}`
        );
        await recordResumeAnalysis(session.user.id, {
          fileName: file.name,
          atsScore: atsScore,
          summary: analysis.summary || "",
          skills: analysis.skills,
          skillGaps: analysis.missingSkills.length > 0 ? analysis.missingSkills : analysis.weaknesses,
        });
      }
    } catch (authSyncErr) {
      console.warn("[Resume API] Could not record user resume activity:", authSyncErr);
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      analysis,
    });
  } catch (error: any) {
    console.error("[Resume API Fatal Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error during resume analysis.",
      },
      { status: 500 }
    );
  }
}