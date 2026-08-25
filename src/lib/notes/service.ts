import { prisma } from "@/lib/prisma";
import { NoteRecord, CreateNoteInput, UpdateNoteInput, NoteFilterOptions } from "./types";

// In-memory fallback store for offline/development mode
type GlobalWithNotes = typeof globalThis & {
  __userNotesStore?: Map<string, NoteRecord[]>;
};

const globalWithNotes = globalThis as GlobalWithNotes;
if (!globalWithNotes.__userNotesStore) {
  globalWithNotes.__userNotesStore = new Map<string, NoteRecord[]>();
}

// Initial sample note for new accounts
function getInitialSampleNotes(userId: string): NoteRecord[] {
  const now = new Date().toISOString();
  return [
    {
      id: `sample_note_1_${userId.slice(0, 8)}`,
      userId,
      title: "Placement Preparation Master Strategy",
      content: `# Placement Preparation Checklist 🎯

### 1. Data Structures & Algorithms
- [x] Arrays, Sliding Window & Two Pointers
- [x] Binary Search & Trees
- [ ] Dynamic Programming (1D & 2D memoization)
- [ ] Graph BFS/DFS, Dijkstra & Topological Sort

### 2. Core CS Fundamentals
- **Operating Systems:** Process vs Thread, Deadlock conditions, Virtual Memory paging.
- **DBMS:** ACID properties, Normalization (1NF to BCNF), Indexing trade-offs.
- **Networks:** TCP 3-way handshake, OSI model layers, DNS lookup flow.

### 3. Interview Questions to Polish (STAR Method)
- *Situation:* Scaling candidate queries in college placement portal.
- *Task:* Reduce database latency by 40%.
- *Action:* Added compound indexes and redis caching layer.
- *Result:* P99 query latency reduced from 650ms to 45ms.
`,
      tags: ["Strategy", "DSA", "Interview"],
      isPinned: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: now,
    },
    {
      id: `sample_note_2_${userId.slice(0, 8)}`,
      userId,
      title: "Google & Tier-1 Company Behavioral Notes",
      content: `## Behavioral Key Points 💡

- **Googliness:** Intellectual humility, collaborative problem solving, handling ambiguity with calm data-driven choices.
- **Leadership without Authority:** Leading peer code reviews, standardizing git branching conventions across cohort projects.
- **Failure Story:** Missed initial edge case in distributed queue consumer, added comprehensive unit tests and automated regression checks.
`,
      tags: ["Behavioral", "HR", "Google"],
      isPinned: false,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

/**
 * List notes for a specific user with optional search, tag, and pinned filters.
 * Sorted pinned-first, then most-recently-updated.
 */
export async function getUserNotes(
  userId: string,
  filters?: NoteFilterOptions
): Promise<NoteRecord[]> {
  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";

  if (shouldUsePrisma) {
    try {
      const whereClause: any = { userId };

      if (filters?.pinned !== undefined) {
        whereClause.isPinned = filters.pinned;
      }

      if (filters?.tag && filters.tag !== "all") {
        whereClause.tags = { has: filters.tag };
      }

      if (filters?.search && filters.search.trim()) {
        const query = filters.search.trim();
        whereClause.OR = [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ];
      }

      const notes = await (prisma as any).note.findMany({
        where: whereClause,
        orderBy: [
          { isPinned: "desc" },
          { updatedAt: "desc" },
        ],
      });

      if (notes.length > 0) {
        return notes.map((n: any) => ({
          id: n.id,
          userId: n.userId,
          title: n.title,
          content: n.content,
          tags: n.tags || [],
          isPinned: n.isPinned,
          createdAt: n.createdAt.toISOString(),
          updatedAt: n.updatedAt.toISOString(),
        }));
      }
    } catch (error) {
      console.warn("Prisma error in getUserNotes, falling back to memory store:", error);
    }
  }

  // Memory store fallback
  let userNotes = globalWithNotes.__userNotesStore!.get(userId);
  if (!userNotes) {
    userNotes = getInitialSampleNotes(userId);
    globalWithNotes.__userNotesStore!.set(userId, userNotes);
  }

  let filtered = [...userNotes];

  if (filters?.pinned !== undefined) {
    filtered = filtered.filter((n) => n.isPinned === filters.pinned);
  }

  if (filters?.tag && filters.tag !== "all") {
    const targetTag = filters.tag.toLowerCase();
    filtered = filtered.filter((n) =>
      n.tags.some((t) => t.toLowerCase() === targetTag)
    );
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort pinned first, then updatedAt desc
  filtered.sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return filtered;
}

/**
 * Get a single note by ID for a user.
 */
export async function getNoteById(
  userId: string,
  noteId: string
): Promise<NoteRecord | null> {
  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";

  if (shouldUsePrisma) {
    try {
      const note = await (prisma as any).note.findFirst({
        where: { id: noteId, userId },
      });

      if (note) {
        return {
          id: note.id,
          userId: note.userId,
          title: note.title,
          content: note.content,
          tags: note.tags || [],
          isPinned: note.isPinned,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString(),
        };
      }
      return null;
    } catch (error) {
      console.warn("Prisma error in getNoteById:", error);
    }
  }

  const userNotes = globalWithNotes.__userNotesStore!.get(userId) || [];
  return userNotes.find((n) => n.id === noteId && n.userId === userId) || null;
}

/**
 * Create a new note for a user.
 */
export async function createNote(
  userId: string,
  input: CreateNoteInput
): Promise<NoteRecord> {
  const now = new Date().toISOString();
  const title = input.title?.trim() || "Untitled Note";
  const content = input.content ?? "";
  const tags = input.tags || [];
  const isPinned = !!input.isPinned;

  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";

  if (shouldUsePrisma) {
    try {
      const created = await (prisma as any).note.create({
        data: {
          userId,
          title,
          content,
          tags,
          isPinned,
        },
      });

      return {
        id: created.id,
        userId: created.userId,
        title: created.title,
        content: created.content,
        tags: created.tags || [],
        isPinned: created.isPinned,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
    } catch (error) {
      console.warn("Prisma error in createNote, saving to memory store:", error);
    }
  }

  const newNote: NoteRecord = {
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    title,
    content,
    tags,
    isPinned,
    createdAt: now,
    updatedAt: now,
  };

  let userNotes = globalWithNotes.__userNotesStore!.get(userId) || [];
  userNotes = [newNote, ...userNotes];
  globalWithNotes.__userNotesStore!.set(userId, userNotes);

  return newNote;
}

/**
 * Update an existing note owned by the user.
 */
export async function updateNote(
  userId: string,
  noteId: string,
  input: UpdateNoteInput
): Promise<NoteRecord | null> {
  const now = new Date().toISOString();
  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";

  if (shouldUsePrisma) {
    try {
      const existing = await (prisma as any).note.findFirst({
        where: { id: noteId, userId },
      });

      if (!existing) {
        return null;
      }

      const updated = await (prisma as any).note.update({
        where: { id: noteId },
        data: {
          ...(input.title !== undefined ? { title: input.title } : {}),
          ...(input.content !== undefined ? { content: input.content } : {}),
          ...(input.tags !== undefined ? { tags: input.tags } : {}),
          ...(input.isPinned !== undefined ? { isPinned: input.isPinned } : {}),
        },
      });

      return {
        id: updated.id,
        userId: updated.userId,
        title: updated.title,
        content: updated.content,
        tags: updated.tags || [],
        isPinned: updated.isPinned,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch (error) {
      console.warn("Prisma error in updateNote, falling back to memory store:", error);
    }
  }

  let userNotes = globalWithNotes.__userNotesStore!.get(userId) || [];
  const index = userNotes.findIndex((n) => n.id === noteId && n.userId === userId);

  if (index === -1) {
    return null;
  }

  const current = userNotes[index];
  const updatedNote: NoteRecord = {
    ...current,
    title: input.title !== undefined ? input.title : current.title,
    content: input.content !== undefined ? input.content : current.content,
    tags: input.tags !== undefined ? input.tags : current.tags,
    isPinned: input.isPinned !== undefined ? input.isPinned : current.isPinned,
    updatedAt: now,
  };

  userNotes[index] = updatedNote;
  globalWithNotes.__userNotesStore!.set(userId, userNotes);

  return updatedNote;
}

/**
 * Delete a note owned by the user.
 */
export async function deleteNote(
  userId: string,
  noteId: string
): Promise<boolean> {
  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";

  if (shouldUsePrisma) {
    try {
      const existing = await (prisma as any).note.findFirst({
        where: { id: noteId, userId },
      });

      if (!existing) {
        return false;
      }

      await (prisma as any).note.delete({
        where: { id: noteId },
      });
      return true;
    } catch (error) {
      console.warn("Prisma error in deleteNote, deleting from memory store:", error);
    }
  }

  let userNotes = globalWithNotes.__userNotesStore!.get(userId) || [];
  const beforeLen = userNotes.length;
  userNotes = userNotes.filter((n) => !(n.id === noteId && n.userId === userId));
  globalWithNotes.__userNotesStore!.set(userId, userNotes);

  return userNotes.length < beforeLen;
}
