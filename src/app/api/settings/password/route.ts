import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { changeUserPassword } from "@/lib/settings/service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const sessionUser = session?.user as { id?: string; email?: string; role?: string } | undefined;
    const userId = sessionUser?.id || sessionUser?.email || "std_001";

    const body = await request.json().catch(() => ({}));
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current password and new password are required." },
        { status: 400 }
      );
    }

    const result = await changeUserPassword(userId, currentPassword, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Password change failed." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error: any) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
