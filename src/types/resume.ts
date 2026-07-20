export interface ResumeAnalysis {
  atsScore: number;
  placementReadiness: number;
  skills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface ResumeFile {
  fileName: string; 
  fileSize: number;
  uploadedAt: Date;
}