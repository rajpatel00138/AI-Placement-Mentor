import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserPerformance } from "@/lib/activity/service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const performance = await getUserPerformance(session.user.id);
    return NextResponse.json({ success: true, data: performance });
  } catch (error: any) {
    console.error("Failed to get user performance:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
