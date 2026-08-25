import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCollegeStatistics } from "@/lib/analytics/service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ collegeId: string }> }
) {
  try {
    const session = await auth();
    const { collegeId } = await context.params;

    if (!collegeId || typeof collegeId !== "string") {
      return NextResponse.json(
        { error: "Invalid college identifier provided." },
        { status: 400 }
      );
    }

    const stats = await getCollegeStatistics(collegeId);

    if (!stats) {
      return NextResponse.json(
        { error: `College with identifier '${collegeId}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error in GET /api/analytics/college/[collegeId]:", error);
    return NextResponse.json(
      { error: "Internal server error while processing college statistics." },
      { status: 500 }
    );
  }
}
