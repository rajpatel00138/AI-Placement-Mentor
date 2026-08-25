import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateUserProfile } from "@/lib/settings/service";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    const sessionUser = session?.user as { id?: string; email?: string; role?: string } | undefined;
    const userId = sessionUser?.id || sessionUser?.email || "std_001";

    const body = await request.json().catch(() => ({}));
    const {
      name,
      bio,
      college,
      branch,
      graduationYear,
      batch,
      targetRole,
      targetCompany,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    } = body;

    const updated = await updateUserProfile(userId, {
      name,
      bio,
      college,
      branch,
      graduationYear: graduationYear ? Number(graduationYear) : undefined,
      batch,
      targetRole,
      targetCompany,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
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
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
