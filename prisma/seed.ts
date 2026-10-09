import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { MOCK_COLLEGES, MOCK_STUDENTS } from "../src/lib/analytics/mock-data";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/placement_mentor?schema=public";

function getPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter } as never);
}

const prisma = getPrismaClient();

const DSA_PROBLEM_POOL = [
  // Easy (1 pt)
  { id: "two-sum", difficulty: "Easy", category: "Arrays", title: "Two Sum" },
  { id: "valid-parentheses", difficulty: "Easy", category: "Stacks", title: "Valid Parentheses" },
  { id: "merge-two-sorted-lists", difficulty: "Easy", category: "Linked Lists", title: "Merge Two Sorted Lists" },
  { id: "best-time-to-buy-and-sell-stock", difficulty: "Easy", category: "Arrays", title: "Best Time to Buy and Sell Stock" },
  { id: "valid-palindrome", difficulty: "Easy", category: "Strings", title: "Valid Palindrome" },
  { id: "invert-binary-tree", difficulty: "Easy", category: "Trees", title: "Invert Binary Tree" },
  { id: "binary-search", difficulty: "Easy", category: "Binary Search", title: "Binary Search" },
  { id: "maximum-depth-of-binary-tree", difficulty: "Easy", category: "Trees", title: "Maximum Depth of Binary Tree" },
  { id: "climbing-stairs", difficulty: "Easy", category: "Dynamic Programming", title: "Climbing Stairs" },
  { id: "reverse-linked-list", difficulty: "Easy", category: "Linked Lists", title: "Reverse Linked List" },
  // Medium (2 pts)
  { id: "3sum", difficulty: "Medium", category: "Arrays", title: "3Sum" },
  { id: "group-anagrams", difficulty: "Medium", category: "Hashing", title: "Group Anagrams" },
  { id: "longest-substring-without-repeating-characters", difficulty: "Medium", category: "Strings", title: "Longest Substring Without Repeating Characters" },
  { id: "container-with-most-water", difficulty: "Medium", category: "Two Pointers", title: "Container With Most Water" },
  { id: "longest-consecutive-sequence", difficulty: "Medium", category: "Arrays", title: "Longest Consecutive Sequence" },
  { id: "number-of-islands", difficulty: "Medium", category: "Graphs", title: "Number of Islands" },
  { id: "kth-largest-element-in-an-array", difficulty: "Medium", category: "Heaps", title: "Kth Largest Element in an Array" },
  { id: "coin-change", difficulty: "Medium", category: "Dynamic Programming", title: "Coin Change" },
  { id: "course-schedule", difficulty: "Medium", category: "Graphs", title: "Course Schedule" },
  { id: "lru-cache", difficulty: "Medium", category: "Design", title: "LRU Cache" },
  { id: "word-break", difficulty: "Medium", category: "Dynamic Programming", title: "Word Break" },
  { id: "search-in-rotated-sorted-array", difficulty: "Medium", category: "Binary Search", title: "Search in Rotated Sorted Array" },
  // Hard (3 pts)
  { id: "trapping-rain-water", difficulty: "Hard", category: "Two Pointers", title: "Trapping Rain Water" },
  { id: "median-of-two-sorted-arrays", difficulty: "Hard", category: "Binary Search", title: "Median of Two Sorted Arrays" },
  { id: "merge-k-sorted-lists", difficulty: "Hard", category: "Heaps", title: "Merge k Sorted Lists" },
  { id: "binary-tree-maximum-path-sum", difficulty: "Hard", category: "Trees", title: "Binary Tree Maximum Path Sum" },
];

const ROADMAP_TOPIC_KEYS = [
  "Programming Fundamentals & Syntax",
  "Time & Space Complexity Basics",
  "Arrays & String Manipulation",
  "Linked Lists & Pointer Logic",
  "Stack & Queue Implementations",
  "Recursion & Backtracking",
  "Binary Trees & Traversals",
  "Binary Search Trees",
  "Heaps & Priority Queues",
  "Graph Traversals (BFS & DFS)",
  "Dynamic Programming (1D)",
  "Dynamic Programming (2D)",
  "Relational Database Design",
  "SQL Indexing & Query Tuning",
  "REST API Architecture",
  "Frontend State Management",
  "Authentication & JWT Security",
  "Docker Containerization",
  "CI/CD Pipeline Automation",
  "System Scalability & Caching",
];

async function seedStudentChildData(
  userId: string,
  student: {
    name: string;
    email: string;
    targetRole?: string | null;
    dsaScore: number;
    resumeScore: number;
    interviewScore: number;
    readinessScore: number;
  }
) {
  // A. DSA Solves: Weighted formula (easy*1 + medium*2 + hard*3) / 40 * 100
  const targetPoints = Math.round((student.dsaScore / 100) * 40);
  let currentPoints = 0;
  const chosenProblems: typeof DSA_PROBLEM_POOL = [];

  for (const prob of DSA_PROBLEM_POOL) {
    const pts = prob.difficulty === "Easy" ? 1 : prob.difficulty === "Medium" ? 2 : 3;
    if (currentPoints + pts <= targetPoints + 1) {
      chosenProblems.push(prob);
      currentPoints += pts;
    }
    if (currentPoints >= targetPoints) break;
  }

  if (chosenProblems.length > 0) {
    await prisma.dsaSolve.createMany({
      data: chosenProblems.map((p) => ({
        userId,
        problemId: p.id,
        difficulty: p.difficulty,
        category: p.category,
        solvedAt: new Date(Date.now() - Math.floor(Math.random() * 12 + 1) * 86400000),
      })),
      skipDuplicates: true,
    });
  }

  // B. Resume Record: ATS Score matches student.resumeScore
  if (student.resumeScore > 0) {
    const existingResume = await prisma.resumeRecord.findFirst({ where: { userId } });
    if (!existingResume) {
      await prisma.resumeRecord.create({
        data: {
          userId,
          fileName: `${student.name.replace(/\s+/g, "_")}_Resume.pdf`,
          atsScore: student.resumeScore,
          summary: `Verified engineering profile for ${student.name} with core depth in ${student.targetRole || "Software Engineering"} and full-stack systems.`,
          skills: ["TypeScript", "React", "Node.js", "Python", "Data Structures", "PostgreSQL", "Git"],
          skillGaps:
            student.resumeScore >= 80
              ? ["Distributed Caching (Redis)", "Microservices Architecture"]
              : ["Docker & CI/CD", "System Architecture", "Automated Testing"],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10 + 2) * 86400000),
        },
      });
    }
  }

  // C. Interview Records: Average score matches student.interviewScore
  if (student.interviewScore > 0) {
    const existingInterviews = await prisma.interviewRecord.count({ where: { userId } });
    if (existingInterviews === 0) {
      const s = student.interviewScore;
      await prisma.interviewRecord.createMany({
        data: [
          {
            userId,
            title: "DSA & Problem Solving Technical Round",
            category: "Technical",
            difficulty: "Medium",
            score: Math.max(50, Math.min(100, s - 2)),
            durationMin: 35,
            feedback: "Solid algorithmic reasoning and clean edge case handling.",
            createdAt: new Date(Date.now() - 5 * 86400000),
          },
          {
            userId,
            title: "Full Stack & System Architecture Interview",
            category: "System Design",
            difficulty: "Hard",
            score: Math.max(50, Math.min(100, s + 2)),
            durationMin: 45,
            feedback: "Demonstrated clear understanding of REST APIs, relational caching, and database schemas.",
            createdAt: new Date(Date.now() - 2 * 86400000),
          },
        ],
      });
    }
  }

  // D. Roadmap Progress: 20 milestones target (readiness / 5)
  const targetTopics = Math.min(20, Math.max(2, Math.round((student.readinessScore / 100) * 20)));
  const courseId = student.targetRole || "Full Stack Engineer";

  const roadmapData = [];
  for (let i = 0; i < targetTopics; i++) {
    roadmapData.push({
      userId,
      courseId,
      topicKey: ROADMAP_TOPIC_KEYS[i],
      completed: true,
    });
  }

  if (roadmapData.length > 0) {
    await prisma.roadmapProgress.createMany({
      data: roadmapData,
      skipDuplicates: true,
    });
  }

  // E. Activity Log
  const existingLogs = await prisma.activityLog.count({ where: { userId } });
  if (existingLogs === 0) {
    await prisma.activityLog.createMany({
      data: [
        {
          userId,
          type: "DSA_PROBLEM_SOLVED",
          title: "Solved Two Sum",
          detail: "Easy • Arrays",
          createdAt: new Date(Date.now() - 1 * 86400000),
        },
        {
          userId,
          type: "MOCK_INTERVIEW_COMPLETED",
          title: "Full Stack & System Architecture Interview Completed",
          detail: `Score: ${student.interviewScore}% • 45m`,
          createdAt: new Date(Date.now() - 2 * 86400000),
        },
        {
          userId,
          type: "RESUME_ANALYZED",
          title: "Resume Analyzed",
          detail: `ATS Score: ${student.resumeScore}/100`,
          createdAt: new Date(Date.now() - 3 * 86400000),
        },
        {
          userId,
          type: "ROADMAP_TOPIC_COMPLETED",
          title: "Completed Relational Database Design",
          detail: "Roadmap Milestone in Full Stack Engineer",
          createdAt: new Date(Date.now() - 4 * 86400000),
        },
      ],
    });
  }
}

async function main() {
  console.log("🌱 Starting database seeding...");

  // Match the exact bcryptjs 10-round hash used by Auth.js credential verification
  const defaultPassword = await bcrypt.hash("Password@123", 10);

  // 1. Seed Colleges
  console.log(`🏫 Seeding ${MOCK_COLLEGES.length} colleges...`);
  for (const col of MOCK_COLLEGES) {
    await prisma.college.upsert({
      where: { name: col.name },
      update: {
        code: col.code,
        location: col.location,
      },
      create: {
        id: col.id,
        name: col.name,
        code: col.code,
        location: col.location,
      },
    });
  }

  // 2. Seed Recruiter & Admin accounts
  console.log("👔 Seeding recruiter & admin accounts...");
  const adminUsers = [
    {
      name: "Talent Partner",
      email: "recruiter@placementmentor.com",
      role: "recruiter",
      targetRole: "Talent Acquisition",
      targetCompany: "Top Tech",
      college: "Apex Institute of Technology",
      collegeId: "col_apex_01",
    },
    {
      name: "Global Recruiter",
      email: "recruiter@mentor.com",
      role: "recruiter",
      targetRole: "Talent Acquisition",
      targetCompany: "Top Tech",
      college: null,
      collegeId: null,
    },
    {
      name: "Placement Officer",
      email: "tpo@ait.edu",
      role: "admin",
      targetRole: "Placement Director",
      targetCompany: "Academic Partner",
      college: "Apex Institute of Technology",
      collegeId: "col_apex_01",
    },
  ];

  for (const admin of adminUsers) {
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {
        name: admin.name,
        password: defaultPassword,
        role: admin.role,
        targetRole: admin.targetRole,
        targetCompany: admin.targetCompany,
        college: admin.college,
        collegeId: admin.collegeId,
      },
      create: {
        name: admin.name,
        email: admin.email,
        password: defaultPassword,
        role: admin.role,
        targetRole: admin.targetRole,
        targetCompany: admin.targetCompany,
        college: admin.college,
        collegeId: admin.collegeId,
      },
    });
  }

  // 3. Seed Dedicated Demo Student accounts
  console.log("🎓 Seeding dedicated demo student accounts...");
  const demoStudents = [
    {
      name: "Demo Student",
      email: "demo@placementmentor.com",
      role: "student",
      college: "Apex Institute of Technology",
      collegeId: "col_apex_01",
      branch: "CSE",
      batch: "2025-A",
      graduationYear: 2025,
      targetRole: "Full Stack Engineer",
      targetCompany: "Google",
      dsaScore: 82,
      codingScore: 85,
      interviewScore: 80,
      resumeScore: 88,
      aptitudeScore: 84,
      readinessScore: 84,
      placementProbability: 0.88,
    },
    {
      name: "Student Candidate",
      email: "student@placementmentor.com",
      role: "student",
      college: "Apex Institute of Technology",
      collegeId: "col_apex_01",
      branch: "CSE",
      batch: "2025-A",
      graduationYear: 2025,
      targetRole: "Software Engineer",
      targetCompany: "Microsoft",
      dsaScore: 78,
      codingScore: 82,
      interviewScore: 76,
      resumeScore: 85,
      aptitudeScore: 80,
      readinessScore: 80,
      placementProbability: 0.82,
    },
    {
      name: "Monster",
      email: "rp286895@gmail.com",
      role: "student",
      college: "Apex Institute of Technology",
      collegeId: "col_apex_01",
      branch: "CSE",
      batch: "2025-A",
      graduationYear: 2025,
      targetRole: "Full Stack Engineer",
      targetCompany: "Google",
      dsaScore: 85,
      codingScore: 88,
      interviewScore: 82,
      resumeScore: 90,
      aptitudeScore: 86,
      readinessScore: 86,
      placementProbability: 0.90,
    },
  ];

  for (const demo of demoStudents) {
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: {
        name: demo.name,
        password: defaultPassword,
        role: demo.role,
        college: demo.college,
        collegeId: demo.collegeId,
        branch: demo.branch,
        batch: demo.batch,
        graduationYear: demo.graduationYear,
        targetRole: demo.targetRole,
        targetCompany: demo.targetCompany,
        dsaScore: demo.dsaScore,
        codingScore: demo.codingScore,
        interviewScore: demo.interviewScore,
        resumeScore: demo.resumeScore,
        aptitudeScore: demo.aptitudeScore,
        readinessScore: demo.readinessScore,
        placementProbability: demo.placementProbability,
      },
      create: {
        name: demo.name,
        email: demo.email,
        password: defaultPassword,
        role: demo.role,
        college: demo.college,
        collegeId: demo.collegeId,
        branch: demo.branch,
        batch: demo.batch,
        graduationYear: demo.graduationYear,
        targetRole: demo.targetRole,
        targetCompany: demo.targetCompany,
        dsaScore: demo.dsaScore,
        codingScore: demo.codingScore,
        interviewScore: demo.interviewScore,
        resumeScore: demo.resumeScore,
        aptitudeScore: demo.aptitudeScore,
        readinessScore: demo.readinessScore,
        placementProbability: demo.placementProbability,
      },
    });

    await seedStudentChildData(user.id, demo);
  }

  // 4. Seed Mock Students + Child Records
  console.log(`📊 Seeding ${MOCK_STUDENTS.length} cohort students with activity records...`);
  for (const student of MOCK_STUDENTS) {
    const user = await prisma.user.upsert({
      where: { email: student.email },
      update: {
        name: student.name,
        password: defaultPassword,
        role: "student",
        college: student.college,
        collegeId: student.collegeId,
        branch: student.branch,
        batch: student.batch,
        graduationYear: student.graduationYear,
        targetRole: student.targetRole,
        targetCompany: student.targetCompany,
        dsaScore: student.dsaScore,
        codingScore: student.codingScore,
        interviewScore: student.interviewScore,
        resumeScore: student.resumeScore,
        aptitudeScore: student.aptitudeScore,
        readinessScore: student.readinessScore,
        placementProbability: student.placementProbability,
      },
      create: {
        name: student.name,
        email: student.email,
        password: defaultPassword,
        role: "student",
        college: student.college,
        collegeId: student.collegeId,
        branch: student.branch,
        batch: student.batch,
        graduationYear: student.graduationYear,
        targetRole: student.targetRole,
        targetCompany: student.targetCompany,
        dsaScore: student.dsaScore,
        codingScore: student.codingScore,
        interviewScore: student.interviewScore,
        resumeScore: student.resumeScore,
        aptitudeScore: student.aptitudeScore,
        readinessScore: student.readinessScore,
        placementProbability: student.placementProbability,
      },
    });

    await seedStudentChildData(user.id, student);
  }

  // 5. Seed Top Company Questions for Company Prep
  console.log("🏢 Seeding top company questions for Company Prep...");
  const questionsPath = path.join(process.cwd(), "data", "company_prep_store.json");
  if (fs.existsSync(questionsPath)) {
    try {
      const raw = fs.readFileSync(questionsPath, "utf-8");
      const allQ: any[] = JSON.parse(raw);
      // Seed first 100 questions for top companies (Amazon, Google, Microsoft, Meta)
      const topQuestions = allQ.slice(0, 100);

      const cqData = topQuestions.map((q) => {
        const slug = q.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const compSlug = q.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const id = q.id || `cq_${compSlug}_${q.timeframe || "all_time"}_${slug}_0`;
        return {
          id,
          companyName: q.companyName,
          timeframe: q.timeframe || "all_time",
          leetcodeId: q.leetcodeId ?? null,
          title: q.title,
          difficulty: (q.difficulty || "MEDIUM") as any,
          acceptanceRate: q.acceptanceRate ?? null,
          frequency: q.frequency ?? null,
          problemUrl: q.problemUrl || `https://leetcode.com/problems/${slug}/`,
        };
      });

      await prisma.companyQuestion.createMany({
        data: cqData,
        skipDuplicates: true,
      });
    } catch (err) {
      console.warn("Could not seed top company questions:", err);
    }
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding encountered an error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
