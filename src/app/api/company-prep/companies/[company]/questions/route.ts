import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCompanyQuestions } from "@/lib/company-prep/service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ company: string }> }
) {
  try {
    const { company } = await context.params;
    const session = await auth();
    const studentId = session?.user?.id || "guest";

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "alltime";
    const difficulty = searchParams.get("difficulty") || undefined;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await getCompanyQuestions({
      company: decodeURIComponent(company),
      timeframe,
      difficulty,
      search,
      status,
      page,
      limit,
      studentId,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Failed to fetch company questions:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
