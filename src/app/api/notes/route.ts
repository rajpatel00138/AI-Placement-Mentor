import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserNotes, createNote } from "@/lib/notes/service";
import { NoteFilterOptions } from "@/lib/notes/types";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const sessionUser = session?.user as { id?: string; email?: string; role?: string } | undefined;
    const userId = sessionUser?.id || sessionUser?.email || "std_001";

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag") || undefined;
    const search = searchParams.get("search") || undefined;
    const pinnedParam = searchParams.get("pinned");
    const pinned = pinnedParam !== null ? pinnedParam === "true" : undefined;

    const filters: NoteFilterOptions = {
      tag,
      search,
      pinned,
    };

    const notes = await getUserNotes(userId, filters);

    return NextResponse.json({
      success: true,
      notes,
    });
  } catch (error: any) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error fetching notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const sessionUser = session?.user as { id?: string; email?: string; role?: string } | undefined;
    const userId = sessionUser?.id || sessionUser?.email || "std_001";

    const body = await request.json().catch(() => ({}));
    const { title, content, tags, isPinned } = body;

    const created = await createNote(userId, {
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      isPinned: Boolean(isPinned),
    });

    return NextResponse.json(
      {
        success: true,
        note: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error creating note" },
      { status: 500 }
    );
  }
}
