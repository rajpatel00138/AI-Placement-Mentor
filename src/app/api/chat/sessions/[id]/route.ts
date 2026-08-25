import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteChatSession, getSessionMessages } from "@/lib/ai/chat-service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Session ID is required." },
        { status: 400 }
      );
    }

    const userId = sessionUser?.id || sessionUser?.email || "std_001";
    const messages = await getSessionMessages(id, userId);

    if (messages === null) {
      return NextResponse.json(
        { error: `Chat session '${id}' not found or access denied.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error in GET /api/chat/sessions/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching session messages." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Session ID is required." },
        { status: 400 }
      );
    }

    const userId = sessionUser?.id || sessionUser?.email || "std_001";
    const deleted = await deleteChatSession(id, userId);

    if (!deleted) {
      return NextResponse.json(
        { error: `Chat session '${id}' not found or cannot be deleted.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Chat session deleted successfully.",
    });
  } catch (error) {
    console.error("Error in DELETE /api/chat/sessions/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error while deleting chat session." },
      { status: 500 }
    );
  }
}
