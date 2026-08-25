import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteUserAccount } from "@/lib/settings/service";

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    const sessionUser = session?.user as { id?: string; email?: string; role?: string } | undefined;
    const userId = sessionUser?.id || sessionUser?.email || "std_001";

    const body = await request.json().catch(() => ({}));
    const { confirmationText, userEmail } = body;

    // Verify confirmation string matches "DELETE" or the user's email
    if (
      confirmationText !== "DELETE" &&
      confirmationText !== userEmail &&
      confirmationText !== sessionUser?.email
    ) {
      return NextResponse.json(
        { error: "Confirmation text does not match required verification." },
        { status: 400 }
      );
    }

    const result = await deleteUserAccount(userId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to delete account." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account and associated placement records deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
