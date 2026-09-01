import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UserProfileSettings, UpdateProfileInput, UpdatePreferencesInput } from "./types";

// In-memory user settings store for offline / dev fallback
type GlobalWithSettings = typeof globalThis & {
  __userSettingsStore?: Map<string, UserProfileSettings & { passwordHash?: string }>;
};

const globalWithSettings = globalThis as GlobalWithSettings;
if (!globalWithSettings.__userSettingsStore) {
  globalWithSettings.__userSettingsStore = new Map();
}

import { findUserByIdFallback, findUserByEmailFallback } from "@/lib/auth-store";

function getFallbackUserSettings(userId: string): UserProfileSettings & { passwordHash?: string } {
  let existing = globalWithSettings.__userSettingsStore?.get(userId);
  if (!existing) {
    // Try to find the registered user from auth store
    let registeredUser = null;
    if (typeof findUserByIdFallback === "function") {
      registeredUser = (globalThis as any).__placementMentorUsers?.get(userId.toLowerCase().trim());
      if (!registeredUser) {
        for (const u of ((globalThis as any).__placementMentorUsers?.values() || [])) {
          if (u.id === userId || u.email.toLowerCase() === userId.toLowerCase()) {
            registeredUser = u;
            break;
          }
        }
      }
    }

    const userName = registeredUser?.name || "Student";
    const userEmail = registeredUser?.email || "student@placementmentor.com";
    const userCollege = registeredUser?.college || "Apex Institute of Technology";
    const userBranch = registeredUser?.branch || "Computer Science";
    const userBatch = registeredUser?.batch || "Batch 2025";

    existing = {
      id: userId,
      name: userName,
      email: userEmail,
      role: registeredUser?.role || "student",
      bio: "Placement preparation student building full-stack engineering, algorithms, and AI projects.",
      college: userCollege,
      branch: userBranch,
      graduationYear: registeredUser?.graduationYear || 2025,
      batch: userBatch,
      targetRole: registeredUser?.targetRole || "Software Engineer",
      targetCompany: registeredUser?.targetCompany || "Google / Microsoft",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      portfolioUrl: "https://portfolio.dev",
      emailNotificationsEnabled: true,
      dsaReminderEnabled: true,
      interviewFeedbackAlerts: true,
      themePreference: "light",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordHash: "$2a$10$wB9W79q0rG0lC.eGj3W8i.6K5bN9f6K8a5n6m7k8j9l0m1n2o3p4q",
    };
    globalWithSettings.__userSettingsStore?.set(userId, existing);
  }
  return existing;
}

/**
 * Get settings for a user
 */
export async function getUserSettings(userId: string): Promise<UserProfileSettings | null> {
  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";

  if (shouldUsePrisma) {
    try {
      const user = await (prisma as any).user.findFirst({
        where: {
          OR: [{ id: userId }, { email: userId }],
        },
      });

      if (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio || null,
          college: user.college || null,
          branch: user.branch || null,
          graduationYear: user.graduationYear || null,
          batch: user.batch || null,
          targetRole: user.targetRole || null,
          targetCompany: user.targetCompany || null,
          githubUrl: user.githubUrl || null,
          linkedinUrl: user.linkedinUrl || null,
          portfolioUrl: user.portfolioUrl || null,
          emailNotificationsEnabled: user.emailNotificationsEnabled ?? true,
          dsaReminderEnabled: user.dsaReminderEnabled ?? true,
          interviewFeedbackAlerts: user.interviewFeedbackAlerts ?? true,
          themePreference: (user.themePreference as "light" | "dark" | "system") || "light",
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      }
    } catch (error) {
      console.warn("Prisma error in getUserSettings, falling back to memory store:", error);
    }
  }

  const fallback = getFallbackUserSettings(userId);
  const { passwordHash, ...safe } = fallback;
  return safe;
}

/**
 * Update user's personal profile information
 */
export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput
): Promise<UserProfileSettings | null> {
  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";
  const now = new Date().toISOString();

  if (shouldUsePrisma) {
    try {
      const updated = await (prisma as any).user.update({
        where: { id: userId },
        data: {
          ...(input.name !== undefined ? { name: input.name.trim() } : {}),
          ...(input.bio !== undefined ? { bio: input.bio } : {}),
          ...(input.college !== undefined ? { college: input.college } : {}),
          ...(input.branch !== undefined ? { branch: input.branch } : {}),
          ...(input.graduationYear !== undefined ? { graduationYear: input.graduationYear } : {}),
          ...(input.batch !== undefined ? { batch: input.batch } : {}),
          ...(input.targetRole !== undefined ? { targetRole: input.targetRole } : {}),
          ...(input.targetCompany !== undefined ? { targetCompany: input.targetCompany } : {}),
          ...(input.githubUrl !== undefined ? { githubUrl: input.githubUrl } : {}),
          ...(input.linkedinUrl !== undefined ? { linkedinUrl: input.linkedinUrl } : {}),
          ...(input.portfolioUrl !== undefined ? { portfolioUrl: input.portfolioUrl } : {}),
        },
      });

      return {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        bio: updated.bio || null,
        college: updated.college || null,
        branch: updated.branch || null,
        graduationYear: updated.graduationYear || null,
        batch: updated.batch || null,
        targetRole: updated.targetRole || null,
        targetCompany: updated.targetCompany || null,
        githubUrl: updated.githubUrl || null,
        linkedinUrl: updated.linkedinUrl || null,
        portfolioUrl: updated.portfolioUrl || null,
        emailNotificationsEnabled: updated.emailNotificationsEnabled ?? true,
        dsaReminderEnabled: updated.dsaReminderEnabled ?? true,
        interviewFeedbackAlerts: updated.interviewFeedbackAlerts ?? true,
        themePreference: (updated.themePreference as "light" | "dark" | "system") || "light",
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch (error) {
      console.warn("Prisma error in updateUserProfile, updating memory store:", error);
    }
  }

  const current = getFallbackUserSettings(userId);
  const updated: UserProfileSettings & { passwordHash?: string } = {
    ...current,
    ...input,
    name: input.name !== undefined ? input.name.trim() : current.name,
    updatedAt: now,
  };
  globalWithSettings.__userSettingsStore?.set(userId, updated);

  const { passwordHash, ...safe } = updated;
  return safe;
}

/**
 * Update user preferences (theme & notifications)
 */
export async function updateUserPreferences(
  userId: string,
  input: UpdatePreferencesInput
): Promise<UserProfileSettings | null> {
  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";
  const now = new Date().toISOString();

  if (shouldUsePrisma) {
    try {
      const updated = await (prisma as any).user.update({
        where: { id: userId },
        data: {
          ...(input.emailNotificationsEnabled !== undefined
            ? { emailNotificationsEnabled: input.emailNotificationsEnabled }
            : {}),
          ...(input.dsaReminderEnabled !== undefined
            ? { dsaReminderEnabled: input.dsaReminderEnabled }
            : {}),
          ...(input.interviewFeedbackAlerts !== undefined
            ? { interviewFeedbackAlerts: input.interviewFeedbackAlerts }
            : {}),
          ...(input.themePreference !== undefined
            ? { themePreference: input.themePreference }
            : {}),
        },
      });

      return {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        bio: updated.bio || null,
        college: updated.college || null,
        branch: updated.branch || null,
        graduationYear: updated.graduationYear || null,
        batch: updated.batch || null,
        targetRole: updated.targetRole || null,
        targetCompany: updated.targetCompany || null,
        githubUrl: updated.githubUrl || null,
        linkedinUrl: updated.linkedinUrl || null,
        portfolioUrl: updated.portfolioUrl || null,
        emailNotificationsEnabled: updated.emailNotificationsEnabled ?? true,
        dsaReminderEnabled: updated.dsaReminderEnabled ?? true,
        interviewFeedbackAlerts: updated.interviewFeedbackAlerts ?? true,
        themePreference: (updated.themePreference as "light" | "dark" | "system") || "light",
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch (error) {
      console.warn("Prisma error in updateUserPreferences, updating memory store:", error);
    }
  }

  const current = getFallbackUserSettings(userId);
  const updated: UserProfileSettings & { passwordHash?: string } = {
    ...current,
    ...input,
    updatedAt: now,
  };
  globalWithSettings.__userSettingsStore?.set(userId, updated);

  const { passwordHash, ...safe } = updated;
  return safe;
}

/**
 * Change user password
 */
export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!currentPassword || !newPassword) {
    return { success: false, error: "Both current and new passwords are required." };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "New password must be at least 6 characters long." };
  }

  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";

  if (shouldUsePrisma) {
    try {
      const user = await (prisma as any).user.findFirst({
        where: {
          OR: [{ id: userId }, { email: userId }],
        },
      });

      if (!user) {
        return { success: false, error: "User not found." };
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return { success: false, error: "Current password does not match." };
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await (prisma as any).user.update({
        where: { id: user.id },
        data: { password: newPasswordHash },
      });

      return { success: true };
    } catch (error: any) {
      console.warn("Prisma error in changeUserPassword:", error);
      return { success: false, error: error?.message || "Failed to update password." };
    }
  }

  // Fallback store
  const user = getFallbackUserSettings(userId);
  if (user.passwordHash) {
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return { success: false, error: "Current password does not match." };
    }
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  globalWithSettings.__userSettingsStore?.set(userId, user);
  return { success: true };
}

/**
 * Delete user account and cascade associated records
 */
export async function deleteUserAccount(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true";

  if (shouldUsePrisma) {
    try {
      const user = await (prisma as any).user.findFirst({
        where: {
          OR: [{ id: userId }, { email: userId }],
        },
      });

      if (!user) {
        return { success: false, error: "User not found." };
      }

      // Cascade is handled in schema for ChatSessions
      await (prisma as any).user.delete({
        where: { id: user.id },
      });

      return { success: true };
    } catch (error: any) {
      console.warn("Prisma error in deleteUserAccount:", error);
      return { success: false, error: error?.message || "Failed to delete account." };
    }
  }

  globalWithSettings.__userSettingsStore?.delete(userId);
  return { success: true };
}
