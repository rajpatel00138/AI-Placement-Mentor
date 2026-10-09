import { prisma, shouldUsePrisma } from "@/lib/prisma";
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
  const usePrisma = shouldUsePrisma();

  if (usePrisma && sessionId) {
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

  if (usePrisma && !sessionId) {
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
  const usePrisma = shouldUsePrisma();
  if (usePrisma) {
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
  const usePrisma = shouldUsePrisma();
  if (usePrisma) {
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
  const usePrisma = shouldUsePrisma();
  if (usePrisma) {
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
    const contents = [
      ...history.slice(-8).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      {
        role: "user",
        parts: [{ text: cleanMessage }],
      },
    ];

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: systemPrompt,
      },
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

  const usePrisma = shouldUsePrisma();
  if (usePrisma) {
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

/**
 * Prepare context and contents for streaming mentor responses.
 */
export async function prepareMentorStream(
  userId: string,
  userMessage: string,
  sessionId?: string
) {
  const cleanMessage = userMessage.trim();
  const session = await getOrCreateChatSession(
    userId,
    sessionId,
    cleanMessage.slice(0, 32) + (cleanMessage.length > 32 ? "..." : "")
  );

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
  const history = (await getSessionMessages(session.id, userId)) || [];

  const contents = [
    ...history.slice(-8).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    {
      role: "user",
      parts: [{ text: cleanMessage }],
    },
  ];

  return {
    session,
    cleanMessage,
    mentorContext,
    systemPrompt,
    contents,
    history,
  };
}

/**
 * Persist user and assistant messages after streaming or batch generation completes.
 */
export async function persistMentorTurn(
  session: ChatSessionRecord,
  userMessageText: string,
  aiReplyText: string
): Promise<{
  session: ChatSessionRecord;
  userMessage: ChatMessageRecord;
  assistantMessage: ChatMessageRecord;
}> {
  const userMsgRecord: ChatMessageRecord = {
    id: `msg_${Date.now().toString(36)}_u`,
    sessionId: session.id,
    role: "user",
    content: userMessageText,
    createdAt: new Date().toISOString(),
  };

  const assistantMsgRecord: ChatMessageRecord = {
    id: `msg_${Date.now().toString(36)}_a`,
    sessionId: session.id,
    role: "assistant",
    content: aiReplyText,
    createdAt: new Date(Date.now() + 100).toISOString(),
  };

  const usePrisma = shouldUsePrisma();
  if (usePrisma) {
    try {
      await prisma.chatMessage.createMany({
        data: [
          {
            sessionId: session.id,
            role: "user",
            content: userMessageText,
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
          title: session.title === "New Mentoring Session" ? userMessageText.slice(0, 30) + "..." : session.title,
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
    session.title = userMessageText.slice(0, 30) + (userMessageText.length > 30 ? "..." : "");
  }
  globalWithChat.__mentorChatSessions?.set(session.id, session);

  return {
    session,
    userMessage: userMsgRecord,
    assistantMessage: assistantMsgRecord,
  };
}

export function generateFallbackMentorResponse(message: string, profile: StudentMentorContext | null): string {
  const lower = message.toLowerCase();
  const dsa = profile?.scores?.dsa ?? 75;
  const resume = profile?.scores?.resume ?? 80;
  const interview = profile?.scores?.interview ?? 70;

  if (lower.includes("binary search")) {
    return `### ⚡ Binary Search Implementation (C++)\n\nBinary search is an $O(\\log n)$ search algorithm operating on sorted arrays:\n\n\`\`\`cpp\n#include <iostream>\n#include <vector>\n\nint binarySearch(const std::vector<int>& arr, int target) {\n    int left = 0, right = arr.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\`\`\`\n\n- **Time Complexity:** $O(\\log n)$\n- **Space Complexity:** $O(1)$ (iterative)\n- **Key Interview Note:** Always calculate \`mid = left + (right - left) / 2\` to avoid integer overflow.`;
  }

  if (lower.includes("quicksort") || lower.includes("quick sort")) {
    return `### ⚡ Quicksort Time Complexity Breakdown\n\nQuicksort is a divide-and-conquer sorting algorithm based on partitioning:\n\n1. **Best Case: $O(n \\log n)$** - Occurs when the pivot cleanly divides the array into two equal halves.\n2. **Average Case: $O(n \\log n)$** - Expected runtime across random permutations.\n3. **Worst Case: $O(n^2)$** - Occurs when the array is already sorted and the smallest or largest element is consistently picked as the pivot.\n\n- **Space Complexity:** $O(\\log n)$ recursion stack space.`;
  }

  if (lower.includes("star method") || lower.includes("star framework") || lower.includes("behavioral")) {
    return `### 🎯 The STAR Method for Behavioral Interviews\n\nThe STAR framework structures clear, memorable answers to behavioral interview questions (*"Tell me about a time when..."*):\n\n- **Situation (20%):** Set the scene, context, and challenge you were facing.\n- **Task (10%):** What was your specific responsibility or goal?\n- **Action (50%):** Detail the exact steps YOU took, tools used, and problem-solving reasoning.\n- **Result (20%):** Quantify the positive outcome (*e.g., improved latency by 35%, shipped on time*).\n\nWould you like to practice framing an answer together?`;
  }

  if (lower.includes("resume") || lower.includes("ats")) {
    return `### 📄 Resume & ATS Optimization Plan\n\nBased on your current ATS evaluation (**${resume}/100**), here is how to push your resume into top recruiter shortlists:\n\n1. **Quantify Every Project Bullet**: Instead of *"Built a full stack app"*, write *"Engineered a Next.js app with Redis caching, reducing API response times by 34%"*.\n2. **Align Keywords for ${profile?.targetRole || "Software Engineering"}**: Include core terms like System Design, RESTful APIs, PostgreSQL, CI/CD pipelines.\n3. **Single-Page Clean Formatting**: Remove multiple columns or heavy tables which can trip legacy ATS scanners.\n\nWould you like me to review a specific project description or summary statement?`;
  }

  if (lower.includes("dsa") || lower.includes("leetcode") || lower.includes("roadmap") || lower.includes("coding")) {
    return `### ⚡ Focused DSA Strategy\n\nLooking at your DSA readiness profile (**${dsa}/100**), here is a high-leverage 7-day pattern roadmap:\n\n- **Days 1–2: Two Pointers & Sliding Window** (Target 6 medium problems on subarray sums and target pairs).\n- **Days 3–4: Trees & Tree Traversals** (Master level-order traversal, LCA, and DFS recursion).\n- **Days 5–6: Dynamic Programming Fundamentals** (Focus on 1D DP: 0/1 Knapsack, Coin Change, House Robber).\n- **Day 7: Timed Mock Assessment** (Solve 2 medium problems within 45 minutes).\n\nFocus on explaining your thought process out loud as if you are in a live technical interview!`;
  }

  return `### 🚀 Placement Mentor Guidance\n\nHello ${profile?.name || "there"}! I'm here to help with your technical prep, DSA problems, resume bullet points, or mock interviews.\n\nFeel free to ask for specific code examples, time complexity breakdowns, or behavioral STAR frameworks!`;
}
