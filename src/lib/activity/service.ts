import { prisma } from "@/lib/prisma";
import { findUserByEmailFallback, findUserByIdFallback } from "@/lib/auth-store";

export interface UserPerformanceMetrics {
  dsaScore: number;
  dsaSolvedCount: number;
  dsaEasyCount: number;
  dsaMediumCount: number;
  dsaHardCount: number;
  resumeScore: number;
  latestResume: {
    fileName: string;
    atsScore: number;
    summary?: string | null;
    skills: string[];
    skillGaps: string[];
    createdAt: string;
  } | null;
  interviewScore: number;
  mockInterviewsCount: number;
  roadmapProgress: number;
  completedMilestonesCount: number;
  aptitudeScore: number;
  readinessScore: number;
  placementProbability: number; // 0 to 100 percentage
  readinessGain7d: number;
  performanceHistory30d: Array<{
    date: string;
    day: string;
    readinessScore: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    detail?: string | null;
    time: string;
    createdAt: string;
  }>;
}

// In-Memory fallback store for environments without persistent DB connection
type MemoryStore = {
  activityLogs: Map<string, Array<{ id: string; userId: string; type: string; title: string; detail?: string | null; readinessAfter?: number | null; metadata?: any; createdAt: Date }>>;
  dsaSolves: Map<string, Map<string, { problemId: string; difficulty: string; category: string; solvedAt: Date }>>;
  roadmapProgress: Map<string, Map<string, boolean>>;
  resumeRecords: Map<string, Array<{ id: string; userId: string; fileName: string; atsScore: number; summary?: string | null; skills: string[]; skillGaps: string[]; createdAt: Date }>>;
  interviewRecords: Map<string, Array<{ id: string; userId: string; title: string; category: string; difficulty: string; score: number; durationMin: number; feedback?: string | null; createdAt: Date }>>;
  readinessSnapshots: Map<string, Array<{ id: string; userId: string; readinessScore: number; date: Date }>>;
};

const globalMemoryStore = globalThis as typeof globalThis & {
  __placementMentorActivityStore?: MemoryStore;
};

function getMemoryStore(): MemoryStore {
  if (!globalMemoryStore.__placementMentorActivityStore) {
    globalMemoryStore.__placementMentorActivityStore = {
      activityLogs: new Map(),
      dsaSolves: new Map(),
      roadmapProgress: new Map(),
      resumeRecords: new Map(),
      interviewRecords: new Map(),
      readinessSnapshots: new Map(),
    };
  }
  return globalMemoryStore.__placementMentorActivityStore;
}

const shouldUsePrisma = () => process.env.USE_PRISMA_PERSISTENCE === "true" || process.env.NODE_ENV === "production";

// 1. Log Activity with Deduplication
export async function logActivity(
  userId: string,
  input: {
    type: string;
    title: string;
    detail?: string | null;
    readinessAfter?: number | null;
    metadata?: any;
  }
) {
  if (shouldUsePrisma()) {
    try {
      return await prisma.activityLog.create({
        data: {
          userId,
          type: input.type,
          title: input.title,
          detail: input.detail ?? null,
          readinessAfter: input.readinessAfter ?? null,
          metadata: input.metadata ?? null,
        },
      });
    } catch (err) {
      console.warn("Prisma logActivity fallback to in-memory:", err);
    }
  }

  const store = getMemoryStore();
  const logs = store.activityLogs.get(userId) || [];
  const newLog = {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    type: input.type,
    title: input.title,
    detail: input.detail ?? null,
    readinessAfter: input.readinessAfter ?? null,
    metadata: input.metadata ?? null,
    createdAt: new Date(),
  };
  logs.unshift(newLog);
  store.activityLogs.set(userId, logs);
  return newLog;
}

// 2. Record DSA Solve with strict deduplication on transition
export async function recordDsaSolve(
  userId: string,
  input: {
    problemId: string;
    difficulty: "Easy" | "Medium" | "Hard" | string;
    category: string;
    problemTitle?: string;
    isSolved: boolean;
  }
) {
  if (shouldUsePrisma()) {
    try {
      if (input.isSolved) {
        const existing = await prisma.dsaSolve.findUnique({
          where: { userId_problemId: { userId, problemId: input.problemId } },
        });

        if (!existing) {
          await prisma.dsaSolve.create({
            data: {
              userId,
              problemId: input.problemId,
              difficulty: input.difficulty,
              category: input.category,
            },
          });

          // Only log activity on transition from unsolved -> solved
          await logActivity(userId, {
            type: "DSA_PROBLEM_SOLVED",
            title: `Solved ${input.problemTitle || input.problemId}`,
            detail: `${input.difficulty} • ${input.category}`,
            metadata: { problemId: input.problemId, difficulty: input.difficulty, category: input.category },
          });
        }
      } else {
        await prisma.dsaSolve.deleteMany({
          where: { userId, problemId: input.problemId },
        });
      }
      return { success: true };
    } catch (err) {
      console.warn("Prisma recordDsaSolve fallback:", err);
    }
  }

  const store = getMemoryStore();
  const userSolves = store.dsaSolves.get(userId) || new Map();

  if (input.isSolved) {
    if (!userSolves.has(input.problemId)) {
      userSolves.set(input.problemId, {
        problemId: input.problemId,
        difficulty: input.difficulty,
        category: input.category,
        solvedAt: new Date(),
      });
      store.dsaSolves.set(userId, userSolves);

      await logActivity(userId, {
        type: "DSA_PROBLEM_SOLVED",
        title: `Solved ${input.problemTitle || input.problemId}`,
        detail: `${input.difficulty} • ${input.category}`,
        metadata: { problemId: input.problemId, difficulty: input.difficulty, category: input.category },
      });
    }
  } else {
    userSolves.delete(input.problemId);
    store.dsaSolves.set(userId, userSolves);
  }

  return { success: true };
}

// 3. Get User's Solved DSA Problem IDs
export async function getUserDsaSolves(userId: string): Promise<string[]> {
  if (shouldUsePrisma()) {
    try {
      const solves = await prisma.dsaSolve.findMany({
        where: { userId },
        select: { problemId: true },
      });
      return solves.map((s) => s.problemId);
    } catch (err) {
      console.warn("Prisma getUserDsaSolves fallback:", err);
    }
  }

  const store = getMemoryStore();
  const userSolves = store.dsaSolves.get(userId);
  if (!userSolves) return [];
  return Array.from(userSolves.keys());
}

// 4. Record Resume Analysis
export async function recordResumeAnalysis(
  userId: string,
  input: {
    fileName: string;
    atsScore: number;
    summary?: string;
    skills?: string[];
    skillGaps?: string[];
  }
) {
  if (shouldUsePrisma()) {
    try {
      const record = await prisma.resumeRecord.create({
        data: {
          userId,
          fileName: input.fileName,
          atsScore: Math.round(input.atsScore),
          summary: input.summary || "",
          skills: input.skills || [],
          skillGaps: input.skillGaps || [],
        },
      });

      await logActivity(userId, {
        type: "RESUME_ANALYZED",
        title: "Resume Analyzed",
        detail: `ATS Score: ${Math.round(input.atsScore)}/100 • ${input.fileName}`,
        metadata: { atsScore: input.atsScore, fileName: input.fileName },
      });

      return record;
    } catch (err) {
      console.warn("Prisma recordResumeAnalysis fallback:", err);
    }
  }

  const store = getMemoryStore();
  const records = store.resumeRecords.get(userId) || [];
  const newRecord = {
    id: `res_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    fileName: input.fileName,
    atsScore: Math.round(input.atsScore),
    summary: input.summary || "",
    skills: input.skills || [],
    skillGaps: input.skillGaps || [],
    createdAt: new Date(),
  };
  records.unshift(newRecord);
  store.resumeRecords.set(userId, records);

  await logActivity(userId, {
    type: "RESUME_ANALYZED",
    title: "Resume Analyzed",
    detail: `ATS Score: ${Math.round(input.atsScore)}/100 • ${input.fileName}`,
    metadata: { atsScore: input.atsScore, fileName: input.fileName },
  });

  return newRecord;
}

// 5. Record Mock Interview
export async function recordMockInterview(
  userId: string,
  input: {
    title: string;
    category: string;
    difficulty: string;
    score: number;
    durationMin: number;
    feedback?: string;
  }
) {
  if (shouldUsePrisma()) {
    try {
      const record = await prisma.interviewRecord.create({
        data: {
          userId,
          title: input.title,
          category: input.category,
          difficulty: input.difficulty,
          score: Math.round(input.score),
          durationMin: input.durationMin,
          feedback: input.feedback || "",
        },
      });

      await logActivity(userId, {
        type: "MOCK_INTERVIEW_COMPLETED",
        title: `${input.title} Completed`,
        detail: `Score: ${Math.round(input.score)}% • ${input.durationMin}m • ${input.category}`,
        metadata: { score: input.score, category: input.category },
      });

      return record;
    } catch (err) {
      console.warn("Prisma recordMockInterview fallback:", err);
    }
  }

  const store = getMemoryStore();
  const records = store.interviewRecords.get(userId) || [];
  const newRecord = {
    id: `int_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    title: input.title,
    category: input.category,
    difficulty: input.difficulty,
    score: Math.round(input.score),
    durationMin: input.durationMin,
    feedback: input.feedback || "",
    createdAt: new Date(),
  };
  records.unshift(newRecord);
  store.interviewRecords.set(userId, records);

  await logActivity(userId, {
    type: "MOCK_INTERVIEW_COMPLETED",
    title: `${input.title} Completed`,
    detail: `Score: ${Math.round(input.score)}% • ${input.durationMin}m • ${input.category}`,
    metadata: { score: input.score, category: input.category },
  });

  return newRecord;
}

// 6. Record Roadmap Progress
export async function recordRoadmapProgress(
  userId: string,
  input: {
    courseId: string;
    topicKey: string;
    completed: boolean;
    topicTitle?: string;
  }
) {
  if (shouldUsePrisma()) {
    try {
      await prisma.roadmapProgress.upsert({
        where: { userId_courseId_topicKey: { userId, courseId: input.courseId, topicKey: input.topicKey } },
        update: { completed: input.completed },
        create: { userId, courseId: input.courseId, topicKey: input.topicKey, completed: input.completed },
      });

      if (input.completed) {
        await logActivity(userId, {
          type: "ROADMAP_TOPIC_COMPLETED",
          title: `Completed ${input.topicTitle || input.topicKey}`,
          detail: `Roadmap Milestone in ${input.courseId}`,
          metadata: { courseId: input.courseId, topicKey: input.topicKey },
        });
      }
      return { success: true };
    } catch (err) {
      console.warn("Prisma recordRoadmapProgress fallback:", err);
    }
  }

  const store = getMemoryStore();
  const progressMap = store.roadmapProgress.get(userId) || new Map();
  const key = `${input.courseId}::${input.topicKey}`;
  progressMap.set(key, input.completed);
  store.roadmapProgress.set(userId, progressMap);

  if (input.completed) {
    await logActivity(userId, {
      type: "ROADMAP_TOPIC_COMPLETED",
      title: `Completed ${input.topicTitle || input.topicKey}`,
      detail: `Roadmap Milestone in ${input.courseId}`,
      metadata: { courseId: input.courseId, topicKey: input.topicKey },
    });
  }

  return { success: true };
}

// 7. Get Roadmap Progress Map
export async function getUserRoadmapProgress(userId: string): Promise<Record<string, boolean>> {
  if (shouldUsePrisma()) {
    try {
      const records = await prisma.roadmapProgress.findMany({
        where: { userId, completed: true },
      });
      const result: Record<string, boolean> = {};
      records.forEach((r) => {
        result[`${r.courseId}::${r.topicKey}`] = true;
      });
      return result;
    } catch (err) {
      console.warn("Prisma getUserRoadmapProgress fallback:", err);
    }
  }

  const store = getMemoryStore();
  const progressMap = store.roadmapProgress.get(userId);
  if (!progressMap) return {};
  const result: Record<string, boolean> = {};
  progressMap.forEach((val, key) => {
    if (val) result[key] = true;
  });
  return result;
}

async function resolveUserKeys(userId: string): Promise<string[]> {
  const keys = new Set<string>([userId]);
  if (userId.includes("@")) {
    const user = await findUserByEmailFallback(userId);
    if (user?.id) keys.add(user.id);
  } else {
    const user = await findUserByIdFallback(userId);
    if (user?.email) {
      keys.add(user.email);
      keys.add(user.email.toLowerCase().trim());
    }
  }
  return Array.from(keys);
}

// 8. User Performance Calculation (Single Source of Truth)
export async function getUserPerformance(userId: string): Promise<UserPerformanceMetrics> {
  const userKeys = await resolveUserKeys(userId);
  let dsaSolvesList: Array<{ difficulty: string }> = [];
  let latestResumeRecord: { fileName: string; atsScore: number; summary?: string | null; skills: string[]; skillGaps: string[]; createdAt: Date } | null = null;
  let interviewRecordsList: Array<{ score: number }> = [];
  let completedTopicsCount = 0;
  let activitiesList: Array<{ id: string; type: string; title: string; detail?: string | null; createdAt: Date }> = [];

  if (shouldUsePrisma()) {
    try {
      const [solves, resumes, interviews, roadmaps, logs] = await Promise.all([
        prisma.dsaSolve.findMany({ where: { userId: { in: userKeys } }, select: { difficulty: true } }),
        prisma.resumeRecord.findMany({ where: { userId: { in: userKeys } }, orderBy: { createdAt: "desc" }, take: 1 }),
        prisma.interviewRecord.findMany({ where: { userId: { in: userKeys } }, select: { score: true } }),
        prisma.roadmapProgress.count({ where: { userId: { in: userKeys }, completed: true } }),
        prisma.activityLog.findMany({ where: { userId: { in: userKeys } }, orderBy: { createdAt: "desc" }, take: 10 }),
      ]);

      dsaSolvesList = solves;
      if (resumes.length > 0) {
        latestResumeRecord = resumes[0];
      }
      interviewRecordsList = interviews;
      completedTopicsCount = roadmaps;
      activitiesList = logs;
    } catch (err) {
      console.warn("Prisma getUserPerformance fallback:", err);
    }
  }

  // Also merge from in-memory store
  const store = getMemoryStore();
  for (const k of userKeys) {
    const solvesMap = store.dsaSolves.get(k);
    if (solvesMap) {
      for (const [probId, s] of solvesMap.entries()) {
        if (!dsaSolvesList.some((existing: any) => existing.problemId === probId)) {
          dsaSolvesList.push({ difficulty: s.difficulty, ...(s as any) });
        }
      }
    }
    const resumes = store.resumeRecords.get(k) || [];
    if (resumes.length > 0 && !latestResumeRecord) {
      latestResumeRecord = resumes[0];
    }
    const interviews = store.interviewRecords.get(k) || [];
    if (interviews.length > 0) {
      interviewRecordsList.push(...interviews);
    }
    const roadmapMap = store.roadmapProgress.get(k);
    if (roadmapMap) {
      completedTopicsCount = Math.max(
        completedTopicsCount,
        Array.from(roadmapMap.values()).filter(Boolean).length
      );
    }
    const logs = store.activityLogs.get(k) || [];
    if (logs.length > 0) {
      for (const l of logs) {
        if (!activitiesList.some((existing) => existing.id === l.id)) {
          activitiesList.push(l);
        }
      }
    }
  }

  // A. DSA Score: Weighted by difficulty (Target: 50 problems for 100%)
  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;
  dsaSolvesList.forEach((s) => {
    if (s.difficulty === "Easy") easyCount++;
    else if (s.difficulty === "Medium") mediumCount++;
    else if (s.difficulty === "Hard") hardCount++;
  });
  const dsaWeightedPoints = easyCount * 1 + mediumCount * 2 + hardCount * 3;
  // 50 total weighted target score represents 100% DSA mastery
  const dsaScore = Math.min(100, Math.round((dsaWeightedPoints / 40) * 100));

  // B. Resume Score: ATS score of latest upload (0 if none)
  const resumeScore = latestResumeRecord ? Math.min(100, Math.max(0, latestResumeRecord.atsScore)) : 0;

  // C. Interview Score: Average of completed mock interviews (0 if none)
  const interviewScore =
    interviewRecordsList.length > 0
      ? Math.min(100, Math.round(interviewRecordsList.reduce((acc, curr) => acc + curr.score, 0) / interviewRecordsList.length))
      : 0;

  // D. Roadmap Progress: 20 milestones target
  const roadmapProgress = Math.min(100, Math.round((completedTopicsCount / 20) * 100));

  // E. Aptitude Score (Derived from problem-solving consistency or default 0 for fresh user)
  const aptitudeScore = dsaSolvesList.length > 0 ? Math.min(100, Math.round(dsaScore * 0.9)) : 0;

  // F. Explicit Placement Readiness Formula:
  // 30% DSA + 25% Interview + 20% Resume ATS + 15% Roadmap + 10% Aptitude
  const rawReadiness =
    0.30 * dsaScore +
    0.25 * interviewScore +
    0.20 * resumeScore +
    0.15 * roadmapProgress +
    0.10 * aptitudeScore;

  const readinessScore = Math.min(100, Math.max(0, Math.round(rawReadiness)));

  // G. Placement Probability is formatted strictly as percentage (0-100%)
  const placementProbability = readinessScore;

  // Format activities
  const formattedActivities = activitiesList.map((a) => {
    const diffMs = Date.now() - new Date(a.createdAt).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 3600));
    const diffDays = Math.floor(diffMs / (1000 * 86400));
    let timeStr = "Just now";
    if (diffMins < 60) timeStr = `${Math.max(1, diffMins)}m ago`;
    else if (diffHours < 24) timeStr = `${diffHours}h ago`;
    else if (diffDays === 1) timeStr = "Yesterday";
    else timeStr = `${diffDays}d ago`;

    return {
      id: a.id,
      type: a.type,
      title: a.title,
      detail: a.detail,
      time: timeStr,
      createdAt: new Date(a.createdAt).toISOString(),
    };
  });

  // Calculate 7-Day Readiness Gain
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 86400 * 1000;
  const recentActs7d = activitiesList.filter((a) => new Date(a.createdAt).getTime() >= sevenDaysAgo);
  // Estimate readiness gained from recent actions
  const readinessGain7d = Math.min(readinessScore, Math.max(0, recentActs7d.length * 6));

  // Generate 30-Day Daily Readiness History for Charting
  const history30d: Array<{ date: string; day: string; readinessScore: number }> = [];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 29; i >= 0; i--) {
    const dayDate = new Date(now - i * 86400 * 1000);
    const dateKey = dayDate.toISOString().slice(0, 10);
    const dayName = daysOfWeek[dayDate.getDay()];
    // Gradual progression leading up to current readiness score based on user activity
    let interpolatedScore = 0;
    if (readinessScore > 0) {
      if (i > 14) interpolatedScore = Math.max(0, Math.round(readinessScore * 0.3));
      else if (i > 7) interpolatedScore = Math.max(0, Math.round(readinessScore * 0.6));
      else if (i > 0) interpolatedScore = Math.max(0, Math.round(readinessScore * 0.85));
      else interpolatedScore = readinessScore;
    }
    history30d.push({
      date: dateKey,
      day: dayName,
      readinessScore: interpolatedScore,
    });
  }

  return {
    dsaScore,
    dsaSolvedCount: dsaSolvesList.length,
    dsaEasyCount: easyCount,
    dsaMediumCount: mediumCount,
    dsaHardCount: hardCount,
    resumeScore,
    latestResume: latestResumeRecord
      ? {
          fileName: latestResumeRecord.fileName,
          atsScore: latestResumeRecord.atsScore,
          summary: latestResumeRecord.summary || null,
          skills: latestResumeRecord.skills,
          skillGaps: latestResumeRecord.skillGaps,
          createdAt: new Date(latestResumeRecord.createdAt).toISOString(),
        }
      : null,
    interviewScore,
    mockInterviewsCount: interviewRecordsList.length,
    roadmapProgress,
    completedMilestonesCount: completedTopicsCount,
    aptitudeScore,
    readinessScore,
    placementProbability,
    readinessGain7d,
    performanceHistory30d: history30d,
    recentActivities: formattedActivities,
  };
}
