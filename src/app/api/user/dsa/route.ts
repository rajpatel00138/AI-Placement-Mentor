import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserDsaSolves, recordDsaSolve } from "@/lib/activity/service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const solves = await getUserDsaSolves(session.user.id);
    return NextResponse.json({ success: true, solves });
  } catch (error: any) {
    console.error("Failed to get DSA solves:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { problemId, difficulty, category, problemTitle, isSolved } = body;

    if (!problemId) {
      return NextResponse.json({ error: "Problem ID is required" }, { status: 400 });
    }

    await recordDsaSolve(session.user.id, {
      problemId: String(problemId),
      difficulty: difficulty || "Medium",
      category: category || "General",
      problemTitle: problemTitle || String(problemId),
      isSolved: Boolean(isSolved),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update DSA solve:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
