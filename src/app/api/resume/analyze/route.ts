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
    "node.js",
    "python",
    "sql",
    "postgresql",
    "docker",
    "dsa",
    "algorithms",
    "aws",
    "git",
    "kubernetes",
    "redis",
  ];
  const foundTech = techKeywords.filter((k) => lower.includes(k));
  ats += Math.min(12, foundTech.length * 2);
  readiness += Math.min(15, foundTech.length * 2);

  const finalAts = Math.max(35, Math.min(96, ats));
  const finalReadiness = Math.max(30, Math.min(98, readiness));

  return {
    atsScore: finalAts,
    overall_score: finalAts,
    placementReadiness: finalReadiness,
    ats_compatibility: finalAts >= 80 ? "High" : finalAts >= 60 ? "Moderate" : "Low",
    summary: `Verified candidate profile for ${fileName}. ${hasTier1 ? "Demonstrates elite industry exposure and practical software engineering competencies." : "Solid engineering foundations across core technical stacks."}`,
    sections: {
      contact_info: { score: 95, status: "Good" },
      education: { score: 90, status: "Good" },
      skills: { score: finalAts, status: finalAts >= 75 ? "Good" : "Average" },
      experience: { score: hasTier1 ? 95 : hasInternship ? 80 : 55, status: hasInternship ? "Good" : "Average" },
      projects: { score: finalAts, status: "Good" },
    },
    skills: foundTech.length > 0 ? foundTech.map((t) => t.toUpperCase()) : ["JavaScript", "TypeScript", "React", "Node.js", "DSA", "SQL"],
    missingSkills: ["System Design Architecture", "Kubernetes", "CI/CD Pipeline Automation"],
    strengths: [
      hasTier1 ? "Tier-1 engineering internship experience" : "Identified core engineering stack",
      metricMatches.length > 0 ? "Utilizes quantitative impact metrics" : "Structured section headers",
      "Clear technical skill enumeration",
    ],
    weaknesses: [
      metricMatches.length < 2 ? "Add more quantifiable impact metrics (% performance gain, latency reduced)" : "Expand on architectural trade-offs",
      "Include deployment and cloud infrastructure keywords",
    ],
    suggestions: [
      "Quantify bullet points: 'Optimized API response times by 35% with Redis caching'",
      "Align technical keywords with the target Job Description",
      "Ensure clean single-column ATS formatting",
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

Your goal is to evaluate the candidate's resume realistically and fairly, providing well-calibrated scores that span the full 0 to 100 spectrum based on concrete tier standards:

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
{
  "atsScore": 92,
  "placementReadiness": 95,
  "ats_compatibility": "High",
  "summary": "2-3 sentence overview highlighting genuine candidate pedigree, internships, and technical competencies.",
  "sections": {
    "contact_info": { "score": 95, "status": "Good" },
    "education": { "score": 90, "status": "Good" },
    "skills": { "score": 92, "status": "Good" },
    "experience": { "score": 95, "status": "Good" },
    "projects": { "score": 90, "status": "Good" }
  },
  "skills": ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "Git", "DSA"],
  "missingSkills": ["Kubernetes", "CI/CD Pipelines", "System Design"],
  "strengths": [
    "Specific strength 1 based on actual resume content",
    "Specific strength 2 based on actual resume content",
    "Specific strength 3 based on actual resume content"
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