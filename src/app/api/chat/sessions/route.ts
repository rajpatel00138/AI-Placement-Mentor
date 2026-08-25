import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { listUserChatSessions } from "@/lib/ai/chat-service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const sessionUser = session?.user as { id?: string; email?: string; role?: string } | undefined;
    const userRole = sessionUser?.role || "student";

    if (userRole === "recruiter" || userRole === "admin") {
      return NextResponse.json(
        { error: "Forbidden: AI Placement Mentor is an exclusive feature for students." },
        { status: 403 }
      );
    }

    const userId = sessionUser?.id || sessionUser?.email || "std_001";
    const sessions = await listUserChatSessions(userId);

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Error in GET /api/chat/sessions:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching chat sessions." },
      { status: 500 }
    );
  }
}
