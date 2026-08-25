import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateUserPreferences } from "@/lib/settings/service";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    const sessionUser = session?.user as { id?: string; email?: string; role?: string } | undefined;
    const userId = sessionUser?.id || sessionUser?.email || "std_001";

    const body = await request.json().catch(() => ({}));
    const {
      emailNotificationsEnabled,
      dsaReminderEnabled,
      interviewFeedbackAlerts,
      themePreference,
    } = body;

    const updated = await updateUserPreferences(userId, {
      emailNotificationsEnabled:
        emailNotificationsEnabled !== undefined ? Boolean(emailNotificationsEnabled) : undefined,
      dsaReminderEnabled:
        dsaReminderEnabled !== undefined ? Boolean(dsaReminderEnabled) : undefined,
      interviewFeedbackAlerts:
        interviewFeedbackAlerts !== undefined ? Boolean(interviewFeedbackAlerts) : undefined,
      themePreference: themePreference as "light" | "dark" | "system" | undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "User not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (error: any) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
