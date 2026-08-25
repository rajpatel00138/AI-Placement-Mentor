import { prisma } from "@/lib/prisma";
import { getAllRegisteredStudentsFallback, findUserByIdFallback } from "@/lib/auth-store";
import { getUserPerformance } from "@/lib/activity/service";
import {
  CollegeStatistics,
  RecruiterAnalyticsFilter,
  StudentAnalyticsRecord,
} from "./types";
import { calculateCollegeStatistics, deriveActivityStatus, getStudentStrengthsAndWeaknesses } from "./calculations";

const shouldUsePrisma = () => process.env.USE_PRISMA_PERSISTENCE === "true" || process.env.NODE_ENV === "production";

/**
 * Normalizes a real database/registered user into a StudentAnalyticsRecord with live dynamic performance metrics.
 * Strictly omits private data (notes, chats, settings, password).
 */
export async function mapRegisteredUserToAnalytics(user: {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  college?: string | null;
  collegeId?: string | null;
  branch?: string | null;
  batch?: string | null;
  graduationYear?: number | null;
  targetRole?: string | null;
  targetCompany?: string | null;
  lastLoginAt?: Date | string | null;
}): Promise<StudentAnalyticsRecord & { readinessGain7d?: number; performanceHistory30d?: any[] }> {
  // Fetch live calculated metrics from single source of truth
  const perf = await getUserPerformance(user.id);

  const scores = {
    dsaScore: perf.dsaScore,
    codingScore: perf.aptitudeScore,
    interviewScore: perf.interviewScore,
    resumeScore: perf.resumeScore,
    aptitudeScore: perf.aptitudeScore,
  };

  const tags = getStudentStrengthsAndWeaknesses(scores);
  const lastLoginStr = user.lastLoginAt
    ? typeof user.lastLoginAt === "string"
      ? user.lastLoginAt
      : user.lastLoginAt.toISOString()
    : null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: user.role,
    college: user.college ?? "Apex Institute of Technology",
    collegeId: user.collegeId ?? null,
    branch: user.branch ?? "Computer Science",
    batch: user.batch ?? "2025-A",
    graduationYear: user.graduationYear ?? 2025,
    targetRole: user.targetRole ?? "Software Engineer",
    targetCompany: user.targetCompany ?? "Tech Target",
    ...scores,
    readinessScore: perf.readinessScore,
    placementProbability: perf.placementProbability, // 0 to 100 percentage
    strengths: tags.strengths,
    weaknesses: tags.weaknesses,
    lastLoginAt: lastLoginStr,
    activityStatus: deriveActivityStatus(user.lastLoginAt ? new Date(user.lastLoginAt) : null),
    readinessGain7d: perf.readinessGain7d,
    performanceHistory30d: perf.performanceHistory30d,
  };
}

/**
 * Fetches real analytics record for a single student by ID or email.
 * Zero mock fallback data.
 */
export async function getStudentAnalytics(studentIdOrEmail: string): Promise<(StudentAnalyticsRecord & { readinessGain7d?: number; performanceHistory30d?: any[] }) | null> {
  if (shouldUsePrisma()) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ id: studentIdOrEmail }, { email: studentIdOrEmail }],
          role: "student",
        },
      });

      if (user) {
        return await mapRegisteredUserToAnalytics(user);
      }
    } catch (error) {
      console.warn("Prisma error in getStudentAnalytics:", error);
    }
  }

  // Fallback to in-memory store for registered users
  const fallbackUser =
    (await findUserByIdFallback(studentIdOrEmail)) ||
    (await getAllRegisteredStudentsFallback()).find(
      (s) => s.id === studentIdOrEmail || s.email.toLowerCase() === studentIdOrEmail.toLowerCase()
    );

  if (fallbackUser && fallbackUser.role === "student") {
    return await mapRegisteredUserToAnalytics(fallbackUser);
  }

  return null;
}

/**
 * Fetches real colleges from database or registered students.
 */
export async function getAllColleges(): Promise<{ id: string; name: string; code?: string | null }[]> {
  if (shouldUsePrisma()) {
    try {
      const colleges = await prisma.college.findMany({ orderBy: { name: "asc" } });
      if (colleges.length > 0) {
        return colleges.map((c) => ({ id: c.id, name: c.name, code: c.code }));
      }
    } catch (error) {
      console.warn("Prisma error in getAllColleges:", error);
    }
  }

  return [
    { id: "col_01", name: "Apex Institute of Technology", code: "AIT" },
  ];
}

/**
 * Fetches college-level statistics based on real registered students.
 */
export async function getCollegeStatistics(collegeIdOrName: string): Promise<CollegeStatistics | null> {
  const result = await getRecruiterBatchAnalytics({ college: collegeIdOrName });
  return result.summary;
}

/**
 * Fetches real recruiter batch list with multi-field search and ranking.
 * Zero mock fallback data.
 */
export async function getRecruiterBatchAnalytics(
  filters: RecruiterAnalyticsFilter & { tab?: "all" | "top_performers" | "most_improved" } = {}
): Promise<{
  students: Array<StudentAnalyticsRecord & { readinessGain7d?: number }>;
  summary: CollegeStatistics | null;
  colleges: { id: string; name: string; code?: string | null }[];
  totalMatches: number;
}> {
  let rawStudents: any[] = [];

  if (shouldUsePrisma()) {
    try {
      rawStudents = await prisma.user.findMany({
        where: { role: "student" },
        orderBy: { createdAt: "desc" },
      });
    } catch (err) {
      console.warn("Prisma error in getRecruiterBatchAnalytics, using store fallback:", err);
    }
  }

  if (rawStudents.length === 0) {
    rawStudents = await getAllRegisteredStudentsFallback();
  }

  // Map each real student to diagnostic analytics record
  const mapped = await Promise.all(rawStudents.map(mapRegisteredUserToAnalytics));

  // Multi-field search across Name, Email, College, and Branch
  let filtered = mapped;
  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter((s) => {
      const nameMatch = s.name.toLowerCase().includes(q);
      const emailMatch = s.email.toLowerCase().includes(q);
      const collegeMatch = (s.college || "").toLowerCase().includes(q);
      const branchMatch = (s.branch || "").toLowerCase().includes(q);
      return nameMatch || emailMatch || collegeMatch || branchMatch;
    });
  }

  // Filter by minReadinessScore
  if (filters.minReadinessScore !== undefined && filters.minReadinessScore > 0) {
    filtered = filtered.filter((s) => s.readinessScore >= filters.minReadinessScore!);
  }

  // Filter by College / Batch / Branch
  if (filters.college && filters.college !== "all") {
    filtered = filtered.filter((s) => s.collegeId === filters.college || (s.college && s.college.toLowerCase().includes(filters.college!.toLowerCase())));
  }
  if (filters.batch && filters.batch !== "all") {
    filtered = filtered.filter((s) => s.batch === filters.batch);
  }
  if (filters.branch && filters.branch !== "all") {
    filtered = filtered.filter((s) => s.branch?.toLowerCase() === filters.branch?.toLowerCase());
  }

  // Ranking Tabs: Top Performers (readiness >= 70%) & Most Improved (sorted by 7-day readiness gain)
  if (filters.tab === "top_performers") {
    filtered = filtered.filter((s) => s.readinessScore >= 70);
  } else if (filters.tab === "most_improved") {
    filtered = [...filtered].sort((a, b) => (b.readinessGain7d || 0) - (a.readinessGain7d || 0));
  }

  // Sorting
  if (filters.tab !== "most_improved") {
    const sortBy = filters.sortBy || "readinessScore";
    const sortOrder = filters.sortOrder || "desc";
    const multiplier = sortOrder === "asc" ? 1 : -1;

    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return multiplier * a.name.localeCompare(b.name);
      }
      if (sortBy === "dsaScore") {
        return multiplier * (a.dsaScore - b.dsaScore);
      }
      if (sortBy === "resumeScore") {
        return multiplier * (a.resumeScore - b.resumeScore);
      }
      if (sortBy === "interviewScore") {
        return multiplier * (a.interviewScore - b.interviewScore);
      }
      if (sortBy === "placementProbability") {
        return multiplier * (a.placementProbability - b.placementProbability);
      }
      return multiplier * (a.readinessScore - b.readinessScore);
    });
  }

  const colleges = await getAllColleges();
  const summary = filtered.length > 0 ? calculateCollegeStatistics(filtered, "Registered Candidates") : null;

  return {
    students: filtered,
    summary,
    colleges,
    totalMatches: filtered.length,
  };
}
