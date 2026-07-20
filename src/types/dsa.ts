export type Difficulty = "Easy" | "Medium" | "Hard";

export type Platform =
  | "leetcode"
  | "gfg"
  | "codeforces"
  | "codechef"
  | "other";

export interface ProblemLink {
  platform: Platform;
  url: string;
}

export interface DSAProblem {
  id: string;
  title: string;

  topic: string;
  subtopic: string;

  difficulty: Difficulty;

  status: string;

  notes: string;

  revisit: string;

  links: ProblemLink[];
}


// ================= UI Tracker Types =================

export interface TrackerProblem {
  id: string;
  name: string;
  difficulty: Difficulty;
  link: string;
}

export interface ProblemGroup {
  name: string;
  problems: TrackerProblem[];
}

export interface Category {
  id: string;
  name: string;
  groups: ProblemGroup[];
}