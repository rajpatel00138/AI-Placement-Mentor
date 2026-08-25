import { prisma } from "@/lib/prisma";
import { ai, GEMINI_MODEL } from "./client";
import { buildMentorSystemPrompt, StudentMentorContext } from "./mentor-prompt";
import { getStudentAnalytics } from "@/lib/analytics/service";

export interface ChatMessageRecord {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatSessionRecord {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessageRecord[];
}

// In-memory fallback store for development or offline DB
type GlobalWithChat = typeof globalThis & {
  __mentorChatSessions?: Map<string, ChatSessionRecord>;
  __mentorChatMessages?: Map<string, ChatMessageRecord[]>;
};

const globalWithChat = globalThis as GlobalWithChat;
if (!globalWithChat.__mentorChatSessions) {
  globalWithChat.__mentorChatSessions = new Map<string, ChatSessionRecord>();
}
if (!globalWithChat.__mentorChatMessages) {
  globalWithChat.__mentorChatMessages = new Map<string, ChatMessageRecord[]>();
}

/**
 * Get or create a chat session for a student.
 */
export async function getOrCreateChatSession(
  userId: string,
  sessionId?: string,
  initialTitle: string = "New Mentoring Session"
): Promise<ChatSessionRecord> {
  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";

  if (shouldUsePrisma && sessionId) {
    try {
      const session = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId },
      });
      if (session) {
        return {
          id: session.id,
          userId: session.userId,
          title: session.title,
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString(),
        };
      }
    } catch (e) {
      console.warn("Prisma error in getOrCreateChatSession:", e);
    }
  }

  if (shouldUsePrisma && !sessionId) {
    try {
      const session = await prisma.chatSession.create({
        data: {
          userId,
          title: initialTitle,
        },
      });
      return {
        id: session.id,
        userId: session.userId,
        title: session.title,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      };
    } catch (e) {
      console.warn("Prisma error creating ChatSession:", e);
    }
  }

  // Fallback in-memory
  if (sessionId && globalWithChat.__mentorChatSessions?.has(sessionId)) {
    const session = globalWithChat.__mentorChatSessions.get(sessionId)!;
    if (session.userId === userId) {
      return session;
    }
  }

  const newId = sessionId || `session_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const newSession: ChatSessionRecord = {
    id: newId,
    userId,
    title: initialTitle,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  globalWithChat.__mentorChatSessions?.set(newId, newSession);
  globalWithChat.__mentorChatMessages?.set(newId, []);
  return newSession;
}

/**
 * List all sessions for a user.
 */
export async function listUserChatSessions(userId: string): Promise<ChatSessionRecord[]> {
  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";

  if (shouldUsePrisma) {
    try {
      const sessions = await prisma.chatSession.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
      if (sessions.length > 0) {
        return sessions.map((s) => ({
          id: s.id,
          userId: s.userId,
          title: s.title,
          createdAt: s.createdAt.toISOString(),
          updatedAt: s.updatedAt.toISOString(),
        }));
      }
    } catch (e) {
      console.warn("Prisma error in listUserChatSessions:", e);
    }
  }

  const fallbackSessions: ChatSessionRecord[] = [];
  globalWithChat.__mentorChatSessions?.forEach((s) => {
    if (s.userId === userId) {
      fallbackSessions.push(s);
    }
  });

  return fallbackSessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * Get messages for a session.
 */
export async function getSessionMessages(sessionId: string, userId: string): Promise<ChatMessageRecord[] | null> {
  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";

  if (shouldUsePrisma) {
    try {
      const session = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });
      if (session) {
        return session.messages.map((m) => ({
          id: m.id,
          sessionId: m.sessionId,
          role: m.role as "user" | "assistant",
          content: m.content,
          createdAt: m.createdAt.toISOString(),
        }));
      }
    } catch (e) {
      console.warn("Prisma error in getSessionMessages:", e);
    }
  }

  const session = globalWithChat.__mentorChatSessions?.get(sessionId);
  if (!session || session.userId !== userId) {
    return null;
  }

  return globalWithChat.__mentorChatMessages?.get(sessionId) || [];
}

/**
 * Delete a session.
 */
export async function deleteChatSession(sessionId: string, userId: string): Promise<boolean> {
  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";

  if (shouldUsePrisma) {
    try {
      const session = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId },
      });
      if (session) {
        await prisma.chatSession.delete({
          where: { id: sessionId },
        });
        return true;
      }
    } catch (e) {
      console.warn("Prisma error in deleteChatSession:", e);
    }
  }

  const session = globalWithChat.__mentorChatSessions?.get(sessionId);
  if (session && session.userId === userId) {
    globalWithChat.__mentorChatSessions?.delete(sessionId);
    globalWithChat.__mentorChatMessages?.delete(sessionId);
    return true;
  }

  return false;
}

/**
 * Core function to send a message to AI mentor and persist history.
 */
export async function sendMentorMessage(
  userId: string,
  userMessage: string,
  sessionId?: string
): Promise<{
  session: ChatSessionRecord;
  reply: string;
  userMessage: ChatMessageRecord;
  assistantMessage: ChatMessageRecord;
}> {
  // 1. Get or create session
  const cleanMessage = userMessage.trim();
  const session = await getOrCreateChatSession(
    userId,
    sessionId,
    cleanMessage.slice(0, 32) + (cleanMessage.length > 32 ? "..." : "")
  );

  // 2. Fetch student diagnostic context
  const studentData = await getStudentAnalytics(userId);
  const mentorContext: StudentMentorContext | null = studentData
    ? {
        name: studentData.name,
        college: studentData.college || undefined,
        branch: studentData.branch || undefined,
        batch: studentData.batch || undefined,
        targetRole: studentData.targetRole || undefined,
        targetCompany: studentData.targetCompany || undefined,
        readinessScore: studentData.readinessScore,
        placementProbability: studentData.placementProbability,
        scores: {
          dsa: studentData.dsaScore,
          coding: studentData.codingScore,
          interview: studentData.interviewScore,
          resume: studentData.resumeScore,
          aptitude: studentData.aptitudeScore,
        },
        strengths: studentData.strengths,
        weaknesses: studentData.weaknesses,
      }
    : null;

  const systemPrompt = buildMentorSystemPrompt(mentorContext);

  // 3. Get existing history for context
  const history = (await getSessionMessages(session.id, userId)) || [];

  // 4. Query Gemini
  let aiReplyText = "";
  try {
    const formattedHistory = history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `${systemPrompt}\n\nPrevious conversation:\n${history
              .slice(-6)
              .map((h) => `${h.role === "user" ? "Student" : "Mentor"}: ${h.content}`)
              .join("\n")}\n\nStudent: ${cleanMessage}\n\nMentor:`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    aiReplyText = response.text?.trim() || "";
  } catch (error) {
    console.warn("Gemini API call failed, generating contextual fallback mentor response:", error);
    aiReplyText = generateFallbackMentorResponse(cleanMessage, mentorContext);
  }

  if (!aiReplyText) {
    aiReplyText = generateFallbackMentorResponse(cleanMessage, mentorContext);
  }

  // 5. Persist user & assistant messages
  const userMsgRecord: ChatMessageRecord = {
    id: `msg_${Date.now().toString(36)}_u`,
    sessionId: session.id,
    role: "user",
    content: cleanMessage,
    createdAt: new Date().toISOString(),
  };

  const assistantMsgRecord: ChatMessageRecord = {
    id: `msg_${Date.now().toString(36)}_a`,
    sessionId: session.id,
    role: "assistant",
    content: aiReplyText,
    createdAt: new Date(Date.now() + 100).toISOString(),
  };

  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";
  if (shouldUsePrisma) {
    try {
      await prisma.chatMessage.createMany({
        data: [
          {
            sessionId: session.id,
            role: "user",
            content: cleanMessage,
          },
          {
            sessionId: session.id,
            role: "assistant",
            content: aiReplyText,
          },
        ],
      });

      await prisma.chatSession.update({
        where: { id: session.id },
        data: {
          updatedAt: new Date(),
          title: session.title === "New Mentoring Session" ? cleanMessage.slice(0, 30) + "..." : session.title,
        },
      });
    } catch (e) {
      console.warn("Prisma error saving ChatMessage:", e);
    }
  }

  // In-memory update
  const sessionMessages = globalWithChat.__mentorChatMessages?.get(session.id) || [];
  sessionMessages.push(userMsgRecord, assistantMsgRecord);
  globalWithChat.__mentorChatMessages?.set(session.id, sessionMessages);

  session.updatedAt = new Date().toISOString();
  if (session.title === "New Mentoring Session") {
    session.title = cleanMessage.slice(0, 30) + (cleanMessage.length > 30 ? "..." : "");
  }
  globalWithChat.__mentorChatSessions?.set(session.id, session);

  return {
    session,
    reply: aiReplyText,
    userMessage: userMsgRecord,
    assistantMessage: assistantMsgRecord,
  };
}

function generateFallbackMentorResponse(message: string, profile: StudentMentorContext | null): string {
  const lower = message.toLowerCase();
  const dsa = profile?.scores?.dsa ?? 75;
  const resume = profile?.scores?.resume ?? 80;
  const interview = profile?.scores?.interview ?? 70;

  if (lower.includes("resume") || lower.includes("ats")) {
    return `### 📄 Resume & ATS Optimization Plan\n\nBased on your current ATS evaluation (**${resume}/100**), here is how to push your resume into top recruiter shortlists:\n\n1. **Quantify Every Project Bullet**: Instead of *"Built a full stack app"*, write *"Engineered a Next.js app with Redis caching, reducing API response times by 34%"*.\n2. **Align Keywords for ${profile?.targetRole || "Software Engineering"}**: Include core terms like System Design, RESTful APIs, PostgreSQL, CI/CD pipelines.\n3. **Single-Page Clean Formatting**: Remove multiple columns or heavy tables which can trip legacy ATS scanners.\n\nWould you like me to review a specific project description or summary statement?`;
  }

  if (lower.includes("dsa") || lower.includes("leetcode") || lower.includes("coding")) {
    return `### ⚡ Focused DSA Strategy\n\nLooking at your DSA readiness profile (**${dsa}/100**), here is a high-leverage 7-day pattern roadmap:\n\n- **Days 1–2: Two Pointers & Sliding Window** (Target 6 medium problems on subarray sums and target pairs).\n- **Days 3–4: Trees & Tree Traversals** (Master level-order traversal, LCA, and DFS recursion).\n- **Days 5–6: Dynamic Programming Fundamentals** (Focus on 1D DP: 0/1 Knapsack, Coin Change, House Robber).\n- **Day 7: Timed Mock Assessment** (Solve 2 medium problems within 45 minutes).\n\nFocus on explaining your thought process out loud as if you are in a live technical interview!`;
  }

  if (lower.includes("interview") || lower.includes("mock") || lower.includes("behavioral")) {
    return `### 🎯 Mock Interview & Communication Prep\n\nWith your interview baseline at **${interview}/100**, the key differentiator in final rounds is structured communication:\n\n1. **Use the STAR Method**: For behavioral questions (*Tell me about a challenging bug*), break down **S**ituation, **T**ask, **A**ction, and quantifiable **R**esult.\n2. **Clarify Constraints First**: Always ask clarifying questions before writing code (input bounds, memory constraints, edge cases like null/empty inputs).\n3. **Dry-run with Test Cases**: Walk the interviewer through your code with an example dry-run before announcing you are done.\n\nWould you like to practice a live technical or HR question right now?`;
  }

  return `### 🚀 Placement Strategy Guidance\n\nHello ${profile?.name || "there"}! Your current placement readiness index is **${profile?.readinessScore ?? 87}/100** with an estimated **${Math.round((profile?.placementProbability ?? 0.9) * 100)}% placement probability** for ${profile?.targetCompany || "top tech companies"}.\n\nHere are the 3 highest-priority actions for your week:\n\n1. **DSA Reinforcement**: Practice 2 Medium problems daily focusing on Graph and DP patterns.\n2. **ATS Resume Review**: Ensure your GitHub links and measurable metrics are up to date.\n3. **Live Mock Simulation**: Complete a 30-minute timed behavioral + technical mock.\n\nWhat specific topic or interview question would you like to dive into today?`;
}
