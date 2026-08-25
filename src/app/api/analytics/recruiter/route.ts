import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRecruiterBatchAnalytics } from "@/lib/analytics/service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized. Recruiter access required." }, { status: 403 });
    }

    // Check query params
    const { searchParams } = new URL(request.url);
    const minReadinessScoreParam = searchParams.get("minReadinessScore");
    const college = searchParams.get("college") || undefined;
    const batch = searchParams.get("batch") || undefined;
    const branch = searchParams.get("branch") || undefined;
    const search = searchParams.get("search") || undefined;
    const tabParam = searchParams.get("tab");
    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");

    let minReadinessScore: number | undefined = undefined;
    if (minReadinessScoreParam) {
      const parsed = parseInt(minReadinessScoreParam, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
        minReadinessScore = parsed;
      }
    }

    const tab = tabParam === "top_performers" || tabParam === "most_improved" ? tabParam : "all";

    const validSortFields = [
      "readinessScore",
      "placementProbability",
      "name",
      "dsaScore",
      "resumeScore",
      "interviewScore",
      "lastLoginAt",
    ] as const;
    let sortBy: typeof validSortFields[number] = "readinessScore";
    if (sortByParam && (validSortFields as readonly string[]).includes(sortByParam)) {
      sortBy = sortByParam as typeof validSortFields[number];
    }

    const sortOrder = sortOrderParam === "asc" ? "asc" : "desc";

    const result = await getRecruiterBatchAnalytics({
      minReadinessScore,
      college,
      batch,
      branch,
      search,
      tab,
      sortBy,
      sortOrder,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in GET /api/analytics/recruiter:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching recruiter batch analytics." },
      { status: 500 }
    );
  }
}
