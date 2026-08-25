import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { recordMockInterview } from "@/lib/activity/service";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, difficulty, score, durationMin, feedback } = body;

    if (!title || score === undefined) {
      return NextResponse.json({ error: "title and score are required" }, { status: 400 });
    }

    const record = await recordMockInterview(session.user.id, {
      title: String(title),
      category: category || "Technical",
      difficulty: difficulty || "Medium",
      score: Number(score),
      durationMin: Number(durationMin || 30),
      feedback,
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    console.error("Failed to record interview:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
