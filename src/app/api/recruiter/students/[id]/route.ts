import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStudentDeepDiveProfile } from "@/lib/recruiter/service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // Check authorization: must be logged in as recruiter or admin
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required to access recruiter diagnostics." },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role;
    if (userRole !== "recruiter" && userRole !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only recruiters and administrators can view candidate deep dives." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Candidate ID is required." },
        { status: 400 }
      );
    }

    const profile = await getStudentDeepDiveProfile(id);

    if (!profile) {
      return NextResponse.json(
        { error: `Candidate with ID '${id}' was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error in GET /api/recruiter/students/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching student deep-dive." },
      { status: 500 }
    );
  }
}
