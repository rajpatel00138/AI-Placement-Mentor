import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserRoadmapProgress, recordRoadmapProgress } from "@/lib/activity/service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await getUserRoadmapProgress(session.user.id);
    return NextResponse.json({ success: true, progress });
  } catch (error: any) {
    console.error("Failed to get roadmap progress:", error);
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
    const { courseId, topicKey, completed, topicTitle } = body;

    if (!courseId || !topicKey) {
      return NextResponse.json({ error: "courseId and topicKey are required" }, { status: 400 });
    }

    await recordRoadmapProgress(session.user.id, {
      courseId: String(courseId),
      topicKey: String(topicKey),
      completed: Boolean(completed),
      topicTitle,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update roadmap progress:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
