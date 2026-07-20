const fs = require("fs");

const html = fs.readFileSync("DSA REVISION.html", "utf8");

// Extract DATA array
const match = html.match(/const DATA = (\[[\s\S]*?\]);/);

if (!match) {
  console.log("DATA array not found.");
  process.exit(1);
}

let data = eval(match[1]);

let categoryId = 1;

const result = data.map(([categoryName, groups]) => ({
  id: `cat-${categoryId++}`,
  name: categoryName,
  groups: groups.map(([groupName, problems]) => ({
    name: groupName,
    problems: problems.map((problem, index) => ({
      id:
        categoryName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-") +
        "-" +
        index,
      name: problem,
    })),
  })),
}));

const output =
`import { Category } from "@/types/dsa";

export const dsaProblems: Category[] =
${JSON.stringify(result, null, 2)};`;

fs.writeFileSync(
  "src/data/dsaProblems.ts",
  output
);

console.log("✅ dsaProblems.ts generated successfully!");