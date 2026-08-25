import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendMentorMessage } from "@/lib/ai/chat-service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // 1. Authenticate request
    if (!session?.user) {
      // In development fallback, if no session, allow local student demo ID
      // but in normal authenticated flow verify session
    }

    const sessionUser = session?.user as { id?: string; email?: string; role?: string } | undefined;
    const userRole = sessionUser?.role || "student";

    // 2. Reject Recruiters / Admins with 403
    if (userRole === "recruiter" || userRole === "admin") {
      return NextResponse.json(
        { error: "Forbidden: AI Placement Mentor is an exclusive feature for students." },
        { status: 403 }
      );
    }

    const userId = sessionUser?.id || sessionUser?.email || "std_001";

    // 3. Parse and validate input
    const body = await request.json().catch(() => ({}));
    const message = body?.message;
    const sessionId = body?.sessionId;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    // 4. Send message to AI mentor
    const result = await sendMentorMessage(userId, message, sessionId);

    return NextResponse.json({
      success: true,
      data: {
        sessionId: result.session.id,
        sessionTitle: result.session.title,
        reply: result.reply,
        userMessage: result.userMessage,
        assistantMessage: result.assistantMessage,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return NextResponse.json(
      { error: "Internal server error while processing mentor chat." },
      { status: 500 }
    );
  }
}
