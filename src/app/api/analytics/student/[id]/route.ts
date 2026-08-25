import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStudentAnalytics } from "@/lib/analytics/service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await context.params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid student identifier provided." },
        { status: 400 }
      );
    }

    // Role-based Access Control
    if (session?.user) {
      const sessionUser = session.user as { id?: string; email?: string; role?: string };
      const userRole = sessionUser.role || "student";
      const userId = sessionUser.id;
      const userEmail = sessionUser.email;

      // If the authenticated user is a student, ensure they only access their own data
      if (
        userRole === "student" &&
        id !== userId &&
        id !== userEmail &&
        id !== "me"
      ) {
        return NextResponse.json(
          { error: "Forbidden: Students are only permitted to view their own analytics." },
          { status: 403 }
        );
      }
    }

    const targetId = id === "me" ? (session?.user?.id || session?.user?.email || "std_001") : id;
    const student = await getStudentAnalytics(targetId);

    if (!student) {
      return NextResponse.json(
        { error: `Student with ID or email '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: student.id,
        name: student.name,
        email: student.email,
        college: student.college,
        collegeId: student.collegeId,
        branch: student.branch,
        batch: student.batch,
        graduationYear: student.graduationYear,
        targetRole: student.targetRole,
        targetCompany: student.targetCompany,
        scores: {
          dsa: student.dsaScore,
          coding: student.codingScore,
          interview: student.interviewScore,
          resume: student.resumeScore,
          aptitude: student.aptitudeScore,
        },
        readinessScore: student.readinessScore,
        placementProbability: student.placementProbability,
        rank: student.rank,
        strengths: student.strengths,
        weaknesses: student.weaknesses,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/analytics/student/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error while processing student analytics." },
      { status: 500 }
    );
  }
}
