import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { MOCK_COLLEGES, MOCK_STUDENTS } from "../src/lib/analytics/mock-data";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/placement_mentor?schema=public";

function getPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter } as never);
}

const prisma = getPrismaClient();

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
  ];

  for (const demo of demoStudents) {
    await prisma.user.upsert({
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
  }

  // 4. Seed Mock Students
  console.log(`📊 Seeding ${MOCK_STUDENTS.length} cohort students with analytics metrics...`);
  for (const student of MOCK_STUDENTS) {
    await prisma.user.upsert({
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
