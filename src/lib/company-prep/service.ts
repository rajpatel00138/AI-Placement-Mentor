import fs from "fs";
import path from "path";
import { prisma, shouldUsePrisma } from "@/lib/prisma";

export interface CompanyQuestionItem {
  id: string;
  companyName: string;
  timeframe: string;
  leetcodeId: number | null;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  acceptanceRate: number | null;
  frequency: number | null;
  problemUrl: string;
  isSolved?: boolean;
  isBookmarked?: boolean;
  status?: "SOLVED" | "BOOKMARKED" | "UNSOLVED";
}

export interface CompanyMeta {
  companyName: string;
  slug: string;
  totalQuestions: number;
  availableTimeframes: string[];
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

export interface CompanyStats {
  totalQuestions: number;
  solvedCount: number;
  bookmarkedCount: number;
  easyCount: number;
  easySolved: number;
  mediumCount: number;
  mediumSolved: number;
  hardCount: number;
  hardSolved: number;
  readinessScore: number;
  readinessLevel: "High" | "Moderate" | "Needs Prep";
}

// In-memory / JSON store cache
let cachedQuestions: CompanyQuestionItem[] | null = null;
let cachedCompaniesMap: Map<string, CompanyMeta> | null = null;

const fallbackProgressStore = new Map<string, "SOLVED" | "BOOKMARKED" | "UNSOLVED">();
const QUESTIONS_STORE_PATH = path.join(process.cwd(), "data", "company_prep_store.json");

function loadQuestionsFromDisk(): CompanyQuestionItem[] {
  if (cachedQuestions && cachedQuestions.length > 0) {
    return cachedQuestions;
  }

  if (fs.existsSync(QUESTIONS_STORE_PATH)) {
    try {
      const raw = fs.readFileSync(QUESTIONS_STORE_PATH, "utf-8");
      const parsed: any[] = JSON.parse(raw);
      cachedQuestions = parsed.map((q, idx) => {
        const slug = q.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const compSlug = q.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const id = q.id || `cq_${compSlug}_${q.timeframe || "all_time"}_${slug}_${idx}`;
        return {
          id,
          companyName: q.companyName,
          timeframe: q.timeframe || "all_time",
          leetcodeId: q.leetcodeId ?? null,
          title: q.title,
          difficulty: q.difficulty || "MEDIUM",
          acceptanceRate: q.acceptanceRate ?? null,
          frequency: q.frequency ?? null,
          problemUrl: q.problemUrl || `https://leetcode.com/problems/${slug}/`,
        };
      });
      return cachedQuestions;
    } catch (err) {
      console.warn("Error loading cached questions JSON:", err);
    }
  }

  return [];
}

export async function getCompaniesList(): Promise<CompanyMeta[]> {
  if (shouldUsePrisma()) {
    try {
      if ((prisma as any).companyQuestion) {
        const [timeframeGroups, diffGroups] = await Promise.all([
          (prisma as any).companyQuestion.groupBy({
            by: ["companyName", "timeframe"],
            _count: { id: true },
          }),
          (prisma as any).companyQuestion.groupBy({
            by: ["companyName", "difficulty"],
            _count: { id: true },
          }),
        ]);

        if (diffGroups && diffGroups.length > 0) {
          const map = new Map<string, CompanyMeta>();

          for (const item of diffGroups) {
            let meta = map.get(item.companyName);
            if (!meta) {
              meta = {
                companyName: item.companyName,
                slug: item.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                totalQuestions: 0,
                availableTimeframes: [],
                easyCount: 0,
                mediumCount: 0,
                hardCount: 0,
              };
              map.set(item.companyName, meta);
            }
            const count = item._count.id;
            meta.totalQuestions += count;
            if (item.difficulty === "EASY") meta.easyCount += count;
            else if (item.difficulty === "HARD") meta.hardCount += count;
            else meta.mediumCount += count;
          }

          for (const item of timeframeGroups) {
            const meta = map.get(item.companyName);
            if (meta && !meta.availableTimeframes.includes(item.timeframe)) {
              meta.availableTimeframes.push(item.timeframe);
            }
          }

          return Array.from(map.values()).sort((a, b) => b.totalQuestions - a.totalQuestions);
        }
      }
    } catch (err) {
      console.warn("Prisma companies list query failed, falling back to cached store:", err);
    }
  }

  // Fallback / fast memory lookup
  if (cachedCompaniesMap && cachedCompaniesMap.size > 0) {
    return Array.from(cachedCompaniesMap.values()).sort((a, b) => b.totalQuestions - a.totalQuestions);
  }

  const questions = loadQuestionsFromDisk();
  const map = new Map<string, CompanyMeta>();

  for (const q of questions) {
    let existing = map.get(q.companyName);
    if (!existing) {
      existing = {
        companyName: q.companyName,
        slug: q.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        totalQuestions: 0,
        availableTimeframes: [],
        easyCount: 0,
        mediumCount: 0,
        hardCount: 0,
      };
      map.set(q.companyName, existing);
    }

    existing.totalQuestions++;
    if (!existing.availableTimeframes.includes(q.timeframe)) {
      existing.availableTimeframes.push(q.timeframe);
    }
    if (q.difficulty === "EASY") existing.easyCount++;
    else if (q.difficulty === "HARD") existing.hardCount++;
    else existing.mediumCount++;
  }

  cachedCompaniesMap = map;
  return Array.from(map.values()).sort((a, b) => b.totalQuestions - a.totalQuestions);
}

export interface GetQuestionsParams {
  company: string;
  timeframe?: string;
  difficulty?: string;
  search?: string;
  status?: string; // "ALL" | "SOLVED" | "BOOKMARKED" | "UNSOLVED"
  page?: number;
  limit?: number;
  studentId?: string;
}

export async function getCompanyQuestions(params: GetQuestionsParams) {
  const {
    company,
    timeframe = "thirty_days",
    difficulty,
    search = "",
    status,
    page = 1,
    limit = 50,
    studentId = "guest",
  } = params;

  // Load student progress store from Prisma
  const progressMap: Record<string, "SOLVED" | "BOOKMARKED" | "UNSOLVED"> = {};

  if (shouldUsePrisma() && studentId && studentId !== "guest") {
    try {
      const records = await prisma.studentCompanyQuestionProgress.findMany({
        where: { studentId },
      });
      for (const r of records) {
        progressMap[`${studentId}:${r.questionId}`] = r.status as any;
      }
    } catch (err) {
      console.warn("Failed to load studentCompanyQuestionProgress from Prisma:", err);
    }
  }

  // Merge in-memory fallback
  for (const [key, val] of fallbackProgressStore.entries()) {
    if (key.startsWith(`${studentId}:`) && !progressMap[key]) {
      progressMap[key] = val;
    }
  }

  // Find all questions for this company (via Prisma with disk fallback)
  let companyQuestions: CompanyQuestionItem[] = [];

  if (shouldUsePrisma()) {
    try {
      const dbQuestions = await (prisma as any).companyQuestion.findMany({
        where: {
          companyName: {
            equals: company,
            mode: "insensitive",
          },
        },
      });

      if (dbQuestions && dbQuestions.length > 0) {
        companyQuestions = dbQuestions.map((q: any) => ({
          id: q.id,
          companyName: q.companyName,
          timeframe: q.timeframe,
          leetcodeId: q.leetcodeId ?? null,
          title: q.title,
          difficulty: q.difficulty,
          acceptanceRate: q.acceptanceRate ?? null,
          frequency: q.frequency ?? null,
          problemUrl: q.problemUrl,
        }));
      }
    } catch (err) {
      console.warn("Prisma query failed for company questions:", err);
    }
  }

  if (companyQuestions.length === 0) {
    const allQuestions = loadQuestionsFromDisk();
    const normalizedCompany = company.toLowerCase().trim().replace(/[-_]+/g, " ");

    companyQuestions = allQuestions.filter((q) => {
      const cNorm = q.companyName.toLowerCase().replace(/[-_]+/g, " ");
      return cNorm === normalizedCompany || q.companyName.toLowerCase() === company.toLowerCase();
    });

    if (companyQuestions.length === 0) {
      const slugMatch = company.toLowerCase().replace(/[^a-z0-9]/g, "");
      companyQuestions = allQuestions.filter((q) => {
        return q.companyName.toLowerCase().replace(/[^a-z0-9]/g, "") === slugMatch;
      });
    }
  }

  const activeCompanyName = companyQuestions.length > 0 ? companyQuestions[0].companyName : company;

  // Available timeframes for this company
  const availableTimeframes = Array.from(new Set(companyQuestions.map((q) => q.timeframe)));

  // Filter by timeframe
  let filtered = companyQuestions;
  if (timeframe && timeframe !== "all" && timeframe !== "all_time" && timeframe !== "alltime") {
    const tfClean = timeframe.toLowerCase().replace(/[-_\s]+/g, "");
    const tfMatch = filtered.filter((q) => {
      const qClean = q.timeframe.toLowerCase().replace(/[-_\s]+/g, "");
      return qClean === tfClean || q.timeframe.toLowerCase() === timeframe.toLowerCase();
    });
    if (tfMatch.length > 0) {
      filtered = tfMatch;
    }
  }

  // Calculate stats for this company & timeframe before search/difficulty filtering
  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;
  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;
  let solvedCount = 0;
  let bookmarkedCount = 0;

  for (const q of filtered) {
    const key = `${studentId}:${q.id}`;
    const pStatus = progressMap[key] || "UNSOLVED";
    const isSolved = pStatus === "SOLVED";
    const isBookmarked = pStatus === "BOOKMARKED";

    if (q.difficulty === "EASY") {
      easyCount++;
      if (isSolved) easySolved++;
    } else if (q.difficulty === "HARD") {
      hardCount++;
      if (isSolved) hardSolved++;
    } else {
      mediumCount++;
      if (isSolved) mediumSolved++;
    }

    if (isSolved) solvedCount++;
    if (isBookmarked) bookmarkedCount++;
  }

  const totalQuestions = filtered.length;
  const readinessScore = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
  let readinessLevel: "High" | "Moderate" | "Needs Prep" = "Needs Prep";
  if (readinessScore >= 70) readinessLevel = "High";
  else if (readinessScore >= 40) readinessLevel = "Moderate";

  const stats: CompanyStats = {
    totalQuestions,
    solvedCount,
    bookmarkedCount,
    easyCount,
    easySolved,
    mediumCount,
    mediumSolved,
    hardCount,
    hardSolved,
    readinessScore,
    readinessLevel,
  };

  // Apply difficulty filter
  if (difficulty && difficulty !== "ALL") {
    filtered = filtered.filter((q) => q.difficulty.toUpperCase() === difficulty.toUpperCase());
  }

  // Apply search query
  if (search.trim()) {
    const term = search.trim().toLowerCase();
    filtered = filtered.filter((q) => {
      const matchTitle = q.title.toLowerCase().includes(term);
      const matchId = q.leetcodeId ? String(q.leetcodeId).includes(term) : false;
      return matchTitle || matchId;
    });
  }

  // Attach progress status
  const enrichedQuestions: CompanyQuestionItem[] = filtered.map((q) => {
    const key = `${studentId}:${q.id}`;
    const pStatus = progressMap[key] || "UNSOLVED";
    return {
      ...q,
      status: pStatus,
      isSolved: pStatus === "SOLVED",
      isBookmarked: pStatus === "BOOKMARKED",
    };
  });

  // Apply status filter
  let finalQuestions = enrichedQuestions;
  if (status && status !== "ALL") {
    if (status === "SOLVED") {
      finalQuestions = finalQuestions.filter((q) => q.isSolved);
    } else if (status === "BOOKMARKED") {
      finalQuestions = finalQuestions.filter((q) => q.isBookmarked);
    } else if (status === "UNSOLVED") {
      finalQuestions = finalQuestions.filter((q) => !q.isSolved);
    }
  }

  // Sort by frequency desc (nulls last), then leetcodeId asc
  finalQuestions.sort((a, b) => {
    const freqA = a.frequency ?? -1;
    const freqB = b.frequency ?? -1;
    if (freqB !== freqA) {
      return freqB - freqA;
    }
    const idA = a.leetcodeId ?? 99999;
    const idB = b.leetcodeId ?? 99999;
    return idA - idB;
  });

  // Pagination
  const totalFiltered = finalQuestions.length;
  const totalPages = Math.ceil(totalFiltered / limit) || 1;
  const safePage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (safePage - 1) * limit;
  const paginatedQuestions = finalQuestions.slice(startIndex, startIndex + limit);

  return {
    companyName: activeCompanyName,
    timeframe,
    availableTimeframes,
    stats,
    pagination: {
      total: totalFiltered,
      page: safePage,
      limit,
      totalPages,
    },
    questions: paginatedQuestions,
  };
}

export async function setQuestionStatus(
  studentId: string,
  questionId: string,
  status: "SOLVED" | "BOOKMARKED" | "UNSOLVED"
) {
  const key = `${studentId}:${questionId}`;
  fallbackProgressStore.set(key, status);

  if (shouldUsePrisma() && studentId && studentId !== "guest") {
    try {
      // Ensure companyQuestion exists to satisfy foreign key relation
      const allQuestions = loadQuestionsFromDisk();
      const qMeta = allQuestions.find((q) => q.id === questionId);

      if (qMeta) {
        await (prisma as any).companyQuestion.upsert({
          where: { id: questionId },
          update: {},
          create: {
            id: questionId,
            companyName: qMeta.companyName,
            timeframe: qMeta.timeframe,
            leetcodeId: qMeta.leetcodeId,
            title: qMeta.title,
            difficulty: qMeta.difficulty || "MEDIUM",
            acceptanceRate: qMeta.acceptanceRate,
            frequency: qMeta.frequency,
            problemUrl: qMeta.problemUrl,
          },
        });
      }

      await (prisma as any).studentCompanyQuestionProgress.upsert({
        where: {
          studentId_questionId: {
            studentId,
            questionId,
          },
        },
        update: { status },
        create: {
          studentId,
          questionId,
          status,
        },
      });
    } catch (err) {
      console.warn("Prisma studentCompanyQuestionProgress upsert failed:", err);
    }
  }

  return { success: true, studentId, questionId, status };
}
