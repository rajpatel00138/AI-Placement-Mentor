import {
  CollegeStatistics,
  ScoreDistributionBuckets,
  ScoreWeights,
  StudentAnalyticsRecord,
  StudentScoreInput,
} from "./types";

/**
 * Configurable weights for calculating student Placement Readiness Score.
 * Total weights must sum to 1.0 (100%).
 *
 * DSA & Coding are given highest weight for technical interviews,
 * followed by Mock Interview communication, Resume ATS quality, and Aptitude.
 */
export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  dsa: 0.30,       // 30% - Data Structures & Algorithms problem solving
  coding: 0.25,    // 25% - Practical coding assessment & speed
  interview: 0.20, // 20% - Mock interview & communication performance
  resume: 0.15,    // 15% - ATS resume score & keyword matching
  aptitude: 0.10,  // 10% - Quantitative & logical reasoning
};

/**
 * Calculates the overall Readiness Score (0 to 100) for a student.
 * Uses a weighted average of individual domain performance scores.
 *
 * @param student Object containing individual sub-scores (0-100)
 * @param weights Optional custom scoring weights
 * @returns Integer readiness score between 0 and 100
 */
export function calculateReadinessScore(
  student: StudentScoreInput,
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS
): number {
  const dsa = Math.max(0, Math.min(100, student.dsaScore || 0));
  const coding = Math.max(0, Math.min(100, student.codingScore || 0));
  const interview = Math.max(0, Math.min(100, student.interviewScore || 0));
  const resume = Math.max(0, Math.min(100, student.resumeScore || 0));
  const aptitude = Math.max(0, Math.min(100, student.aptitudeScore || 0));

  const weightedSum =
    dsa * weights.dsa +
    coding * weights.coding +
    interview * weights.interview +
    resume * weights.resume +
    aptitude * weights.aptitude;

  const totalWeight =
    weights.dsa +
    weights.coding +
    weights.interview +
    weights.resume +
    weights.aptitude;

  const score = totalWeight > 0 ? weightedSum / totalWeight : 0;
  return Math.round(score);
}

/**
 * Calculates the predicted Placement Probability (0.00 to 1.00).
 *
 * FORMULA EXPLANATION:
 * We use a modified logistic/sigmoid function centered at readiness score 55:
 *   P(placement) = 1 / (1 + e^(-k * (readinessScore - midpoint)))
 *
 * Parameters:
 *   - Midpoint (x0) = 55: A student with an average 55 readiness has a baseline 50% placement probability.
 *   - Steepness (k) = 0.08: Controls the smooth transition curve.
 *   - Balance penalty / bonus: Students with balanced scores across both DSA & Interview get up to +0.05 bonus,
 *     while critical gaps (< 35 in either core pillar) apply a slight penalty.
 *
 * The final output is clamped strictly between 0.05 (5% minimum chance) and 0.99 (99% maximum).
 *
 * @param student Object containing score fields or computed readinessScore
 * @returns Floating point probability between 0.00 and 1.00 rounded to 2 decimal places
 */
export function calculatePlacementProbability(
  student: Partial<StudentScoreInput> & { readinessScore?: number }
): number {
  const readiness =
    student.readinessScore !== undefined
      ? student.readinessScore
      : calculateReadinessScore({
          dsaScore: student.dsaScore ?? 0,
          codingScore: student.codingScore ?? 0,
          interviewScore: student.interviewScore ?? 0,
          resumeScore: student.resumeScore ?? 0,
          aptitudeScore: student.aptitudeScore ?? 0,
        });

  const midpoint = 55;
  const k = 0.08;

  // Base logistic sigmoid scaling
  let probability = 1 / (1 + Math.exp(-k * (readiness - midpoint)));

  // Domain balance adjustment:
  const dsa = student.dsaScore ?? readiness;
  const interview = student.interviewScore ?? readiness;

  if (dsa >= 75 && interview >= 75) {
    // Strong all-rounder bonus
    probability += 0.04;
  } else if (dsa < 35 || interview < 35) {
    // Critical deficiency penalty
    probability -= 0.06;
  }

  // Clamp probability between 0.05 and 0.99
  const clamped = Math.max(0.05, Math.min(0.99, probability));
  return Number(clamped.toFixed(2));
}

/**
 * Derives strengths and weakness tags based on component sub-scores.
 */
export function getStudentStrengthsAndWeaknesses(student: StudentScoreInput): {
  strengths: string[];
  weaknesses: string[];
} {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  const domains = [
    { name: "DSA", score: student.dsaScore, strong: "DSA Expert", weak: "DSA Practice Needed" },
    { name: "Coding", score: student.codingScore, strong: "Fast Coder", weak: "Coding Speed Low" },
    { name: "Interview", score: student.interviewScore, strong: "Strong Communicator", weak: "Interview Prep Needed" },
    { name: "Resume", score: student.resumeScore, strong: "ATS Optimized", weak: "Resume Polish Needed" },
    { name: "Aptitude", score: student.aptitudeScore, strong: "High Problem Solving", weak: "Aptitude Revision Needed" },
  ];

  domains.forEach((d) => {
    if (d.score >= 75) {
      strengths.push(d.strong);
    } else if (d.score < 50) {
      weaknesses.push(d.weak);
    }
  });

  if (strengths.length === 0) {
    strengths.push("Consistent Learner");
  }
  if (weaknesses.length === 0) {
    weaknesses.push("Well Rounded Profile");
  }

  return {
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
  };
}

/**
 * Calculates college/batch level statistical aggregates.
 *
 * @param students Array of student analytics records
 * @param collegeName Optional label for the college
 * @returns CollegeStatistics object
 */
export function calculateCollegeStatistics(
  students: StudentAnalyticsRecord[],
  collegeName: string = "All Batches"
): CollegeStatistics {
  const totalStudents = students.length;

  if (totalStudents === 0) {
    return {
      collegeName,
      totalStudents: 0,
      averageReadinessScore: 0,
      averagePlacementProbability: 0,
      averageScores: { dsa: 0, coding: 0, interview: 0, resume: 0, aptitude: 0 },
      scoreDistribution: { low: 0, medium: 0, high: 0 },
      topPerformers: [],
      weakAreas: [],
      strengthAreas: [],
    };
  }

  let totalReadiness = 0;
  let totalProbability = 0;
  let totalDsa = 0;
  let totalCoding = 0;
  let totalInterview = 0;
  let totalResume = 0;
  let totalAptitude = 0;

  const distribution: ScoreDistributionBuckets = {
    low: 0,    // 0-40
    medium: 0, // 41-70
    high: 0,   // 71-100
  };

  students.forEach((s) => {
    totalReadiness += s.readinessScore;
    totalProbability += s.placementProbability;
    totalDsa += s.dsaScore;
    totalCoding += s.codingScore;
    totalInterview += s.interviewScore;
    totalResume += s.resumeScore;
    totalAptitude += s.aptitudeScore;

    if (s.readinessScore <= 40) {
      distribution.low += 1;
    } else if (s.readinessScore <= 70) {
      distribution.medium += 1;
    } else {
      distribution.high += 1;
    }
  });

  const avgReadiness = Math.round(totalReadiness / totalStudents);
  const avgProbability = Number((totalProbability / totalStudents).toFixed(2));
  const avgScores = {
    dsa: Math.round(totalDsa / totalStudents),
    coding: Math.round(totalCoding / totalStudents),
    interview: Math.round(totalInterview / totalStudents),
    resume: Math.round(totalResume / totalStudents),
    aptitude: Math.round(totalAptitude / totalStudents),
  };

  // Rank and find top 5 performers
  const ranked = rankStudents(students);
  const topPerformers = ranked.slice(0, 5);

  // Identify weak areas (< 60 average) and strength areas (>= 60)
  const domainAverages = [
    {
      domain: "Data Structures & Algorithms",
      averageScore: avgScores.dsa,
      recommendation: "Schedule intensive LeetCode pattern workshops on Dynamic Programming and Graphs.",
    },
    {
      domain: "Coding Implementation",
      averageScore: avgScores.coding,
      recommendation: "Host weekly timed hackathons to boost implementation speed and edge-case handling.",
    },
    {
      domain: "Mock Interviews",
      averageScore: avgScores.interview,
      recommendation: "Conduct peer-to-peer behavioral and system design mock sessions.",
    },
    {
      domain: "Resume ATS Quality",
      averageScore: avgScores.resume,
      recommendation: "Run automated ATS resume screening and project impact metric reviews.",
    },
    {
      domain: "Aptitude & Reasoning",
      averageScore: avgScores.aptitude,
      recommendation: "Provide daily timed quantitative aptitude problem sets.",
    },
  ];

  const weakAreas = domainAverages
    .filter((d) => d.averageScore < 65)
    .sort((a, b) => a.averageScore - b.averageScore);

  const strengthAreas = domainAverages
    .filter((d) => d.averageScore >= 65)
    .sort((a, b) => b.averageScore - a.averageScore)
    .map(({ domain, averageScore }) => ({ domain, averageScore }));

  return {
    collegeName,
    totalStudents,
    averageReadinessScore: avgReadiness,
    averagePlacementProbability: avgProbability,
    averageScores: avgScores,
    scoreDistribution: distribution,
    topPerformers,
    weakAreas,
    strengthAreas,
  };
}

/**
 * Sorts students descending by readinessScore, breaking ties with placementProbability.
 * Attaches rank numbers (1-indexed).
 *
 * @param students Array of student records
 * @returns New array of students with rank fields populated
 */
export function rankStudents(students: StudentAnalyticsRecord[]): StudentAnalyticsRecord[] {
  const sorted = [...students].sort((a, b) => {
    if (b.readinessScore !== a.readinessScore) {
      return b.readinessScore - a.readinessScore;
    }
    if (b.placementProbability !== a.placementProbability) {
      return b.placementProbability - a.placementProbability;
    }
    return (b.dsaScore + b.codingScore) - (a.dsaScore + a.codingScore);
  });

  return sorted.map((student, index) => {
    const tags = getStudentStrengthsAndWeaknesses(student);
    return {
      ...student,
      rank: index + 1,
      strengths: student.strengths ?? tags.strengths,
      weaknesses: student.weaknesses ?? tags.weaknesses,
      activityStatus: student.activityStatus ?? deriveActivityStatus(student.lastLoginAt),
    };
  });
}

/**
 * Derives human-friendly activity status from lastLoginAt timestamp.
 */
export function deriveActivityStatus(lastLoginAt?: Date | string | null): string {
  if (!lastLoginAt) return "Never logged in";
  const date = typeof lastLoginAt === "string" ? new Date(lastLoginAt) : lastLoginAt;
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0 || isNaN(diffMs)) return "Active recently";

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 5) return "Active now";
  if (diffMins < 60) return `Active ${diffMins}m ago`;
  if (diffHours < 24) return `Active ${diffHours}h ago`;
  if (diffDays === 1) return "Active yesterday";
  if (diffDays < 7) return `Active ${diffDays}d ago`;
  return `Active on ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

