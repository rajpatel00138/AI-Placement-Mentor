export interface UserProfileSettings {
  id: string;
  name: string;
  email: string;
  role: string;
  bio?: string | null;
  college?: string | null;
  branch?: string | null;
  graduationYear?: number | null;
  batch?: string | null;
  targetRole?: string | null;
  targetCompany?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  emailNotificationsEnabled: boolean;
  dsaReminderEnabled: boolean;
  interviewFeedbackAlerts: boolean;
  themePreference: "light" | "dark" | "system";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string | null;
  college?: string | null;
  branch?: string | null;
  graduationYear?: number | null;
  batch?: string | null;
  targetRole?: string | null;
  targetCompany?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
}

export interface UpdatePreferencesInput {
  emailNotificationsEnabled?: boolean;
  dsaReminderEnabled?: boolean;
  interviewFeedbackAlerts?: boolean;
  themePreference?: "light" | "dark" | "system";
}
