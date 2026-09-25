-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('SOLVED', 'BOOKMARKED', 'UNSOLVED');

-- CreateTable
CREATE TABLE "CompanyQuestion" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "leetcodeId" INTEGER,
    "title" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "acceptanceRate" DOUBLE PRECISION,
    "frequency" DOUBLE PRECISION,
    "problemUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCompanyQuestionProgress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "status" "QuestionStatus" NOT NULL DEFAULT 'UNSOLVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentCompanyQuestionProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompanyQuestion_companyName_timeframe_idx" ON "CompanyQuestion"("companyName", "timeframe");

-- CreateIndex
CREATE INDEX "CompanyQuestion_companyName_difficulty_idx" ON "CompanyQuestion"("companyName", "difficulty");

-- CreateIndex
CREATE INDEX "StudentCompanyQuestionProgress_studentId_idx" ON "StudentCompanyQuestionProgress"("studentId");

-- CreateIndex
CREATE INDEX "StudentCompanyQuestionProgress_questionId_idx" ON "StudentCompanyQuestionProgress"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCompanyQuestionProgress_studentId_questionId_key" ON "StudentCompanyQuestionProgress"("studentId", "questionId");

-- AddForeignKey
ALTER TABLE "StudentCompanyQuestionProgress" ADD CONSTRAINT "StudentCompanyQuestionProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCompanyQuestionProgress" ADD CONSTRAINT "StudentCompanyQuestionProgress_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "CompanyQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
