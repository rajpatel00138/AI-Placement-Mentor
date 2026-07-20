import * as topics from "@/data/dsa";
import {
  Category,
  DSAProblem,
  TrackerProblem,
} from "@/types/dsa";

const allProblems: DSAProblem[] = Object.values(topics).flat();

const groupedTopics = new Map<string, Map<string, TrackerProblem[]>>();

for (const problem of allProblems) {
  if (!groupedTopics.has(problem.topic)) {
    groupedTopics.set(problem.topic, new Map());
  }

  const subtopics = groupedTopics.get(problem.topic)!;

  if (!subtopics.has(problem.subtopic)) {
    subtopics.set(problem.subtopic, []);
  }

  subtopics.get(problem.subtopic)!.push({
    id: problem.id,
    name: problem.title,
    difficulty: problem.difficulty,
    link: problem.links[0]?.url ?? "",
  });
}

export const dsaProblems: Category[] = Array.from(
  groupedTopics.entries()
).map(([topic, groups]) => ({
  id: topic.toLowerCase().replace(/\s+/g, "-"),
  name: topic,
  groups: Array.from(groups.entries()).map(
    ([subtopic, problems]) => ({
      name: subtopic,
      problems,
    })
  ),
}));