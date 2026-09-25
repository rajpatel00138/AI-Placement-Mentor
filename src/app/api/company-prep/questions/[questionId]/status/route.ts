import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { setQuestionStatus } from "@/lib/company-prep/service";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await context.params;
    const session = await auth();
    const studentId = session?.user?.id || "guest";

    const body = await request.json();
    const { status } = body; // "SOLVED" | "BOOKMARKED" | "UNSOLVED"

    if (!status || !["SOLVED", "BOOKMARKED", "UNSOLVED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const result = await setQuestionStatus(
      studentId,
      decodeURIComponent(questionId),
      status as "SOLVED" | "BOOKMARKED" | "UNSOLVED"
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Failed to update question status:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
