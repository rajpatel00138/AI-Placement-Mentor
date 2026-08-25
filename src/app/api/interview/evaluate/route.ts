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

    const prompt = `
You are a Senior FAANG Technical Interview Evaluator.

Evaluate the candidate exactly like a real interviewer.

The evaluation must be fair, realistic, detailed and constructive.

Return ONLY valid JSON.

Do NOT return markdown.
Do NOT wrap inside \`\`\`.

Return exactly this structure:

{
  "overallScore":0,
  "communication":0,
  "technicalKnowledge":0,
  "problemSolving":0,
  "confidence":0,

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
0-100

Communication:
How clearly the candidate explained.

Technical Knowledge:
Accuracy of concepts.

Problem Solving:
Reasoning and approach.

Confidence:
Based on answer quality and completeness.

Strengths:
Give 3-6 specific strengths.

Weaknesses:
Give 3-6 specific weaknesses.

Overall overallFeedback:
Write 5-8 sentences.

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

Difficulty:
${difficulty}

Company:
${company}

Questions and Candidate Answers:

${questions
  .map(
    (q: any, index: number) => `
Question ${index + 1}
${q.question}

Candidate Answer:
${q.answer}
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