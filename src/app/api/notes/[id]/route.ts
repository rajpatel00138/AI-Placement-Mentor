import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getNoteById, updateNote, deleteNote } from "@/lib/notes/service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const session = await auth();
    const sessionUser = session?.user as { id?: string; email?: string; role?: string } | undefined;
    const userId = sessionUser?.id || sessionUser?.email || "std_001";

    const note = await getNoteById(userId, id);

    if (!note) {
      return NextResponse.json(
        { error: "Note not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      note,
    });
  } catch (error: any) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const session = await auth();
    const sessionUser = session?.user as { id?: string; email?: string; role?: string } | undefined;
    const userId = sessionUser?.id || sessionUser?.email || "std_001";

    const body = await request.json().catch(() => ({}));
    const { title, content, tags, isPinned } = body;

    const updated = await updateNote(userId, id, {
      title,
      content,
      tags: tags !== undefined ? (Array.isArray(tags) ? tags : []) : undefined,
      isPinned: isPinned !== undefined ? Boolean(isPinned) : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Note not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      note: updated,
    });
  } catch (error: any) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const session = await auth();
    const sessionUser = session?.user as { id?: string; email?: string; role?: string } | undefined;
    const userId = sessionUser?.id || sessionUser?.email || "std_001";

    const success = await deleteNote(userId, id);

    if (!success) {
      return NextResponse.json(
        { error: "Note not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
