import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { MOCK_COLLEGES, MOCK_STUDENTS } from "../src/lib/analytics/mock-data";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/placement_mentor?schema=public";

function getPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter } as never);
}

const prisma = getPrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

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
      name: "Global Recruiter",
      email: "recruiter@mentor.com",
      role: "recruiter",
      targetRole: "Talent Acquisition",
      targetCompany: "Top Tech",
    },
    {
      name: "Placement Officer",
      email: "tpo@ait.edu",
      role: "admin",
      college: "Apex Institute of Technology",
      collegeId: "col_apex_01",
    },
  ];

  for (const admin of adminUsers) {
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {
        name: admin.name,
        role: admin.role,
        college: admin.college,
        collegeId: admin.collegeId,
      },
      create: {
        name: admin.name,
        email: admin.email,
        password: defaultPassword,
        role: admin.role,
        college: admin.college,
        collegeId: admin.collegeId,
      },
    });
  }

  // 3. Seed Students (30+ with varied scores)
  console.log(`🎓 Seeding ${MOCK_STUDENTS.length} students with analytics metrics...`);
  for (const student of MOCK_STUDENTS) {
    await prisma.user.upsert({
      where: { email: student.email },
      update: {
        name: student.name,
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
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
