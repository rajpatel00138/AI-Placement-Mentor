import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { recordResumeAnalysis } from "@/lib/activity/service";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fileName, atsScore, summary, skills, skillGaps } = body;

    if (!fileName || atsScore === undefined) {
      return NextResponse.json({ error: "fileName and atsScore are required" }, { status: 400 });
    }

    const record = await recordResumeAnalysis(session.user.id, {
      fileName: String(fileName),
      atsScore: Number(atsScore),
      summary,
      skills: Array.isArray(skills) ? skills : [],
      skillGaps: Array.isArray(skillGaps) ? skillGaps : [],
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    console.error("Failed to record resume analysis:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
