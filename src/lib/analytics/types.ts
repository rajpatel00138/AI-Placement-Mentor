export interface StudentScoreInput {
  dsaScore: number;
  resumeScore: number;
  interviewScore: number;
  codingScore: number;
  aptitudeScore: number;
}

export interface StudentAnalyticsRecord extends StudentScoreInput {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  college?: string | null;
  collegeId?: string | null;
  branch?: string | null;
  batch?: string | null;
  graduationYear?: number | null;
  targetRole?: string | null;
  targetCompany?: string | null;
  readinessScore: number;
  placementProbability: number;
  rank?: number;
  strengths?: string[];
  weaknesses?: string[];
  lastLoginAt?: string | null;
  activityStatus?: string;
}

export interface ScoreWeights {
  dsa: number;
  coding: number;
  interview: number;
  resume: number;
  aptitude: number;
}

export interface ScoreDistributionBuckets {
  low: number;      // 0-40
  medium: number;   // 41-70
  high: number;     // 71-100
}

export interface CollegeStatistics {
  collegeId?: string;
  collegeName: string;
  totalStudents: number;
  averageReadinessScore: number;
  averagePlacementProbability: number;
  averageScores: {
    dsa: number;
    coding: number;
    interview: number;
    resume: number;
    aptitude: number;
  };
  scoreDistribution: ScoreDistributionBuckets;
  topPerformers: StudentAnalyticsRecord[];
  weakAreas: {
    domain: string;
    averageScore: number;
    recommendation: string;
  }[];
  strengthAreas: {
    domain: string;
    averageScore: number;
  }[];
}

export interface RecruiterAnalyticsFilter {
  minReadinessScore?: number;
  college?: string;
  batch?: string;
  branch?: string;
  search?: string;
  sortBy?: "readinessScore" | "placementProbability" | "name" | "dsaScore" | "resumeScore" | "interviewScore" | "lastLoginAt";
  sortOrder?: "asc" | "desc";
}
