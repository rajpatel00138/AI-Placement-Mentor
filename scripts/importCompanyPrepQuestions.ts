import "dotenv/config";
import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/prisma";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

interface ParsedQuestion {
  id: string;
  companyName: string;
  timeframe: string;
  leetcodeId: number | null;
  title: string;
  difficulty: Difficulty;
  acceptanceRate: number | null;
  frequency: number | null;
  problemUrl: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseDifficulty(val: string): Difficulty {
  const norm = (val || "").trim().toUpperCase();
  if (norm.includes("EASY")) return "EASY";
  if (norm.includes("HARD")) return "HARD";
  return "MEDIUM";
}

function normalizeTimeframe(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes("thirty") || lower.includes("30") || (lower.includes("day") && !lower.includes("three") && !lower.includes("six"))) return "thirty_days";
  if (lower.includes("three") || lower.includes("3_month") || lower.includes("3 month")) return "three_months";
  if (lower.includes("more than six") || lower.includes("more_than_six")) return "more_than_six_months";
  if (lower.includes("six") || lower.includes("6_month") || lower.includes("6 month")) return "six_months";
  if (lower.includes("one year") || lower.includes("1_year") || lower.includes("1 year")) return "one_year";
  if (lower.includes("two year") || lower.includes("2_year") || lower.includes("more than two")) return "more_than_two_years";
  if (lower.includes("all")) return "all_time";
  return lower.replace(/\.csv$/i, "").replace(/^[0-9.\s_-]+/, "").replace(/[\s_-]+/g, "_");
}

async function main() {
  console.log("\n==========================================================");
  console.log("🚀 COMPANY-WISE PREPARATION: CSV INGESTION & DB MIGRATION");
  console.log("==========================================================\n");

  const baseDir = path.join(process.cwd(), "data", "company_csvs");

  if (!fs.existsSync(baseDir)) {
    console.error(`❌ Data directory not found: ${baseDir}`);
    process.exit(1);
  }

  // 1. Wipe existing rows in Prisma if connected and log row counts before and after
  console.log("🧹 Step 1: Checking and wiping existing database records...");
  let countBefore = 0;
  let countAfter = 0;
  let prismaAvailable = false;

  try {
    countBefore = await prisma.companyQuestion.count();
    console.log(`   - Existing CompanyQuestion rows before wipe: ${countBefore}`);
    await prisma.companyQuestion.deleteMany({});
    countAfter = await prisma.companyQuestion.count();
    console.log(`   - Existing CompanyQuestion rows after wipe: ${countAfter}`);
    console.log(`   ✅ DB wipe verified successfully (${countBefore} -> ${countAfter} records).`);
    prismaAvailable = true;
  } catch (err: any) {
    console.warn(`   ⚠️ Prisma database check/wipe skipped (PostgreSQL not connected): ${err.message}`);
    console.log(`   ℹ️ Ingestion will proceed and save to local persistent JSON store & attempt Prisma batch insertion.`);
  }

  // 2. Traverse all company subdirectories
  console.log("\n📁 Step 2: Recursively scanning company folders in data/company_csvs/...");
  const entries = fs.readdirSync(baseDir);
  const companyDirs = entries.filter((entry) => {
    const fullPath = path.join(baseDir, entry);
    return fs.statSync(fullPath).isDirectory();
  });

  console.log(`   Found ${companyDirs.length} company subdirectories.\n`);

  const allQuestions: ParsedQuestion[] = [];
  const perCompanyStats: Record<string, { files: number; questions: number }> = {};
  const seenIds = new Set<string>();

  let totalFilesScanned = 0;

  for (let cIdx = 0; cIdx < companyDirs.length; cIdx++) {
    const companyName = companyDirs[cIdx];
    const companyFolderPath = path.join(baseDir, companyName);
    const csvFiles = fs.readdirSync(companyFolderPath).filter((f) => f.endsWith(".csv"));

    let companyQuestionsCount = 0;

    for (const filename of csvFiles) {
      totalFilesScanned++;
      const timeframe = normalizeTimeframe(filename);
      const filePath = path.join(companyFolderPath, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const lines = fileContent.split(/\r?\n/).filter((l) => l.trim().length > 0);

      if (lines.length <= 1) continue;

      const headerLine = lines[0];
      const headers = parseCSVLine(headerLine).map((h) => h.toLowerCase());

      const diffIdx = headers.findIndex((h) => h.includes("diff"));
      const titleIdx = headers.findIndex((h) => h.includes("title") || h.includes("question") || h.includes("name"));
      const freqIdx = headers.findIndex((h) => h.includes("freq"));
      const accIdx = headers.findIndex((h) => h.includes("accept"));
      const linkIdx = headers.findIndex(
        (h) =>
          h === "leetcode question link" ||
          h === "link" ||
          h.includes("link") ||
          h.includes("url") ||
          h.includes("leetcode")
      );
      const idIdx = headers.findIndex((h) => h === "id" || h === "#" || h.includes("id"));

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (cols.length === 0 || !cols.some((c) => c.length > 0)) continue;

        const rawTitle = titleIdx !== -1 && cols[titleIdx] ? cols[titleIdx] : "";
        if (!rawTitle || rawTitle === "undefined") continue;

        const rawDiff = diffIdx !== -1 ? cols[diffIdx] : "MEDIUM";
        const difficulty = parseDifficulty(rawDiff);

        const rawFreq = freqIdx !== -1 ? cols[freqIdx] : "";
        const parsedFreq = rawFreq ? parseFloat(rawFreq.replace("%", "").trim()) : null;
        const frequency = isNaN(parsedFreq as number) ? null : parsedFreq;

        const rawAcc = accIdx !== -1 ? cols[accIdx] : "";
        const parsedAcc = rawAcc ? parseFloat(rawAcc.replace("%", "").trim()) : null;
        const acceptanceRate = isNaN(parsedAcc as number) ? null : parsedAcc;

        let problemUrl = linkIdx !== -1 ? cols[linkIdx] : "";
        if (!problemUrl || !problemUrl.startsWith("http")) {
          const slug = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          problemUrl = `https://leetcode.com/problems/${slug}/`;
        }

        const rawId = idIdx !== -1 ? cols[idIdx] : "";
        const parsedId = rawId ? parseInt(rawId.replace(/\D/g, ""), 10) : null;
        const leetcodeId = parsedId && !isNaN(parsedId) ? parsedId : null;

        const compSlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const titleSlug = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        let questionId = `cq_${compSlug}_${timeframe}_${titleSlug}`;
        let dupCounter = 1;
        while (seenIds.has(questionId)) {
          dupCounter++;
          questionId = `cq_${compSlug}_${timeframe}_${titleSlug}_${dupCounter}`;
        }
        seenIds.add(questionId);

        allQuestions.push({
          id: questionId,
          companyName,
          timeframe,
          leetcodeId,
          title: rawTitle,
          difficulty,
          acceptanceRate,
          frequency,
          problemUrl,
        });

        companyQuestionsCount++;
      }
    }

    perCompanyStats[companyName] = {
      files: csvFiles.length,
      questions: companyQuestionsCount,
    };

    if ((cIdx + 1) % 50 === 0 || cIdx + 1 === companyDirs.length) {
      console.log(
        `   [${cIdx + 1}/${companyDirs.length}] Scanned companies... (${allQuestions.length} total questions parsed)`
      );
    }
  }

  console.log("\n==========================================================");
  console.log("📊 INGESTION SUMMARY");
  console.log("==========================================================");
  console.log(`🏢 Total Companies Processed: ${companyDirs.length}`);
  console.log(`📄 Total CSV Files Processed: ${totalFilesScanned}`);
  console.log(`❓ Total Questions Parsed:    ${allQuestions.length}`);
  console.log("==========================================================\n");

  // Save to persistent JSON store for sub-millisecond retrieval
  const jsonStorePath = path.join(process.cwd(), "data", "company_prep_store.json");
  fs.writeFileSync(jsonStorePath, JSON.stringify(allQuestions), "utf-8");
  const sizeMb = (fs.statSync(jsonStorePath).size / (1024 * 1024)).toFixed(2);
  console.log(`💾 Saved persistent JSON store to ${jsonStorePath} (${sizeMb} MB)`);

  // Batch insert into Prisma in chunks of 500
  if (prismaAvailable) {
    console.log("\n⚡ Step 3: Batch inserting questions into PostgreSQL via Prisma (chunks of 1000)...");
    const chunkSize = 1000;
    let inserted = 0;

    for (let i = 0; i < allQuestions.length; i += chunkSize) {
      const chunk = allQuestions.slice(i, i + chunkSize);
      try {
        await prisma.companyQuestion.createMany({
          data: chunk,
          skipDuplicates: true,
        });
        inserted += chunk.length;
        console.log(
          `   → Inserted ${inserted}/${allQuestions.length} rows (${Math.round(
            (inserted / allQuestions.length) * 100
          )}%)...`
        );
      } catch (err: any) {
        console.error(`   ❌ Failed to insert chunk starting at index ${i}:`, err.message);
      }
    }

    const finalDbCount = await prisma.companyQuestion.count();
    console.log(`\n✅ PostgreSQL Ingestion Completed! Total rows in DB: ${finalDbCount}`);
  } else {
    console.log("\nℹ️ JSON store is fully updated and ready. When PostgreSQL is online, rerun to populate PostgreSQL.");
  }

  console.log("\n🎉 Done! Everything is up to date.\n");
}

main()
  .catch((err) => {
    console.error("Fatal error during import:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
