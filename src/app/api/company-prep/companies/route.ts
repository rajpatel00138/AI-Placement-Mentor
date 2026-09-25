import { NextResponse } from "next/server";
import { getCompaniesList } from "@/lib/company-prep/service";

export async function GET() {
  try {
    const companies = await getCompaniesList();
    return NextResponse.json({
      success: true,
      data: companies,
    });
  } catch (error: any) {
    console.error("Failed to fetch company list:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
