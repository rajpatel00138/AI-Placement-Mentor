import { StudentAnalyticsRecord } from "@/lib/analytics/types";

export interface ResumeDiagnostic {
  atsScore: number;
  summary: string;
  skillsIdentified: string[];
  skillGaps: string[];
  recommendations: string[];
}

export interface DSATrackerDiagnostic {
  totalSolved: number;
  totalProblems: number;
  streakDays: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  topTopics: string[];
}

export interface InterviewDiagnostic {
  mockInterviewsCompleted: number;
  bestScore: number;
  averageScore: number;
  categoryBreakdown: {
    hr: number;
    technical: number;
    dsa: number;
    dbms: number;
    os: number;
    networks: number;
    systemDesign: number;
    aptitude: number;
  };
}

export interface RoadmapDiagnostic {
  completionPercentage: number;
  currentMilestone: string;
  completedMilestones: number;
  totalMilestones: number;
  milestones: {
    id: string;
    title: string;
    status: "completed" | "in_progress" | "upcoming";
    skills: string[];
  }[];
}

export interface StudentDeepDiveProfile {
  student: StudentAnalyticsRecord;
  resume: ResumeDiagnostic;
  dsa: DSATrackerDiagnostic;
  interview: InterviewDiagnostic;
  roadmap: RoadmapDiagnostic;
}
