import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";

const INPUT_FILE = path.join(
  process.cwd(),
  "src",
  "data",
  "dsa-master-sheet.xlsx"
);

const workbook = XLSX.readFile(INPUT_FILE);

const sheet = workbook.Sheets[workbook.SheetNames[0]];

const range = XLSX.utils.decode_range(sheet["!ref"]!);

let currentTopic = "";
let currentSubtopic = "";

interface ParsedProblem {
  id: string;
  title: string;
  topic: string;
  subtopic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: string;
  notes: string;
  revisit: string;
  links: {
    platform: "leetcode" | "gfg" | "codeforces" | "other";
    url: string;
  }[];
}

const problems: ParsedProblem[] = [];
function cell(row: number, col: number) {
  const addr = XLSX.utils.encode_cell({ r: row, c: col });
  return sheet[addr];
}

const merges = sheet["!merges"] || [];

function value(row: number, col: number): string {
  const addr = XLSX.utils.encode_cell({ r: row, c: col });

  if (sheet[addr]?.v !== undefined) {
    return String(sheet[addr].v).trim();
  }

  for (const merge of merges) {
    if (
      row >= merge.s.r &&
      row <= merge.e.r &&
      col >= merge.s.c &&
      col <= merge.e.c
    ) {
      const startAddr = XLSX.utils.encode_cell({
        r: merge.s.r,
        c: merge.s.c,
      });

      const startCell = sheet[startAddr];

      if (startCell?.v !== undefined) {
        return String(startCell.v).trim();
      }
    }
  }

  return "";
}

function hyperlink(row: number, col: number) {
  return cell(row, col)?.l?.Target ?? "";
}

function slug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function difficulty(value: string): "Easy" | "Medium" | "Hard" {
  const level = Number(value);

  if (level <= 2) return "Easy";
  if (level <= 4) return "Medium";
  return "Hard";
}

function platform(url: string) {
  if (url.includes("leetcode")) return "leetcode";
  if (url.includes("geeksforgeeks")) return "gfg";
  if (url.includes("codeforces")) return "codeforces";
  return "other";
}


for (let row = 3; row <= range.e.r; row++) {

  const srNo = value(row, 0);

  const topic = value(row, 2);
  const subtopic = value(row, 3);
  const title = value(row, 4);

  if (!srNo && !topic && !subtopic && !title) continue;

    if (value(row, 0).includes("PHASE")) {
        continue;
    }
  if (topic) currentTopic = topic;
  if (subtopic) currentSubtopic = subtopic;

  if (!title || title === "Problem Name") continue;

  const url = hyperlink(row, 5);

  problems.push({
    id: slug(title),
    title,
    topic: currentTopic,
    subtopic: currentSubtopic,
    difficulty: difficulty(value(row, 6)),
    status: value(row, 7),
    notes: value(row, 8),
    revisit: value(row, 9),
    links: [
      {
        platform: platform(url),
        url,
      },
    ],
  });
}



const OUTPUT_DIR = path.join(process.cwd(), "src", "data", "dsa");

mkdirSync(OUTPUT_DIR, { recursive: true });

const grouped = new Map<string, typeof problems>();

for (const problem of problems) {
    if (!problem.topic) continue;
    const key = slug(problem.topic);

  if (!grouped.has(key)) {
    grouped.set(key, []);
  }

  grouped.get(key)!.push(problem);
}

const indexExports: string[] = [];

for (const [topic, items] of grouped) {
    let variable = topic
      .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      .replace(/[^a-zA-Z0-9_]/g, "");

    if (/^\d/.test(variable)) {
      variable = "topic" + variable;
    }

 const fileContent = `import { DSAProblem } from "@/types/dsa";

    export const ${variable}: DSAProblem[] = ${JSON.stringify(
        items,  
        null,
        2
    )} as DSAProblem[];
    `;

  writeFileSync(
    path.join(OUTPUT_DIR, `${topic}.ts`),
    fileContent
  );

  indexExports.push(
    `export { ${variable} } from "./${topic}";`
  );
}

writeFileSync(
  path.join(OUTPUT_DIR, "index.ts"),
  indexExports.join("\n")
);

console.log("Generated", grouped.size, "topic files."); 

console.log(`✅ Parsed ${problems.length} problems`);
console.log(`✅ Generated ${grouped.size} topic files`);
console.log("🎉 Conversion completed successfully!");