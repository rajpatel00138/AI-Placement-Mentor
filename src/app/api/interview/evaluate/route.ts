import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MODEL =
  process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";

export async function POST(req: NextRequest) {
  try {
    const {
      interviewType,  
      difficulty,
      company,
      questions,
    } = await req.json();

    const isPseudocode =
      interviewType === "pseudocode" || interviewType === "pseudo-code";

    let totalMcqs = 0;
    let correctMcqs = 0;

    questions.forEach((q: any) => {
      if (q.type === "mcq" || (isPseudocode && q.correctAnswer)) {
        totalMcqs++;
        const candidateAns = (q.answer || "").trim().toLowerCase();
        const correctAns = (q.correctAnswer || "").trim().toLowerCase();
        if (
          candidateAns &&
          (candidateAns === correctAns ||
            candidateAns.includes(correctAns) ||
            correctAns.includes(candidateAns))
        ) {
          correctMcqs++;
        }
      }
    });

    const mcqScorePercent =
      totalMcqs > 0 ? Math.round((correctMcqs / totalMcqs) * 100) : null;

    const prompt = `
You are a Senior FAANG Technical Interview Evaluator.

Evaluate the candidate exactly like a real interviewer.

The evaluation must be fair, realistic, detailed and constructive.

Return ONLY valid JSON.

Do NOT return markdown.
Do NOT wrap inside \`\`\`.

Return exactly this structure:

{
  "overallScore": ${mcqScorePercent ?? 0},
  "communication": ${mcqScorePercent !== null ? Math.min(10, Math.round(mcqScorePercent / 10)) : 0},
  "technicalKnowledge": ${mcqScorePercent !== null ? Math.min(10, Math.round(mcqScorePercent / 10)) : 0},
  "problemSolving": ${mcqScorePercent !== null ? Math.min(10, Math.round(mcqScorePercent / 10)) : 0},
  "confidence": ${mcqScorePercent !== null ? Math.min(10, Math.round(mcqScorePercent / 10)) : 0},

  "strengths":[
    ""
  ],

  "weaknesses":[
    ""
  ],

  "overalloverallFeedback":"",

  "hiringRecommendation":{
    "status":"",
    "confidence":"",
    "reason":""
  },

  "recommendedTopics":[
    {
      "topic":"",
      "priority":"High"
    }
  ],

  "suggestions":[
    ""
  ]
}

Scoring Rules

Overall Score:
0-100 (Objective MCQ accuracy is ${correctMcqs} / ${totalMcqs} = ${mcqScorePercent ?? 0}%)

Communication:
How clearly the candidate reasoned.

Technical Knowledge:
Accuracy on pseudocode algorithms, Big-O complexity, and logic patterns.

Problem Solving:
Reasoning on tracing, loop invariants, and bug hunting.

Confidence:
Based on answer accuracy and completeness.

Strengths:
Give 3-6 specific strengths.

Weaknesses:
Give 3-6 specific weaknesses.

Overall overallFeedback:
Write 5-8 sentences analyzing their algorithmic reasoning.

Hiring Recommendation:

status must be one of:
"Strong Hire"
"Hire"
"Lean Hire"
"No Hire"

confidence must be:
High
Medium
Low

Recommended Topics:
Return 5 topics.

Priority must be:
High
Medium
Low

Suggestions:
Return 5 actionable suggestions.

Interview Type:
${interviewType}
${
  isPseudocode || totalMcqs > 0
    ? `Special Evaluation Rule for MCQ Assessment:
- The candidate took an objective MCQ assessment (${correctMcqs} / ${totalMcqs} correct, ${mcqScorePercent}%).
- Anchored overallScore: ${mcqScorePercent}%.
- Highlight their performance on pseudocode tracing, Big-O complexity, and edge-case bug detection.`
    : ""
}

Difficulty:
${difficulty}

Company:
${company}

Questions and Candidate Answers:

${questions
  .map(
    (q: any, index: number) => `
Question ${index + 1} (${q.type === "mcq" ? "MCQ" : "Descriptive"})
${q.question}

Candidate Selected Answer:
${q.answer || "No answer chosen"}
${q.correctAnswer ? `Correct Key: ${q.correctAnswer}` : ""}
${q.explanation ? `Explanation: ${q.explanation}` : ""}
`
  )
  .join("\n")}
`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let evaluation;

    try {
      evaluation = JSON.parse(cleaned);
      if (mcqScorePercent !== null) {
        evaluation.overallScore = mcqScorePercent;
      }
    } catch {
      throw new Error(
        "Gemini returned invalid evaluation JSON."
      );
    }

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      {
        status: 500,
      }
    );
  }
}