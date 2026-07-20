import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("resume") as File | null;

  if (!file) {
    return NextResponse.json(
      {
        success: false,
        message: "No file received",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Resume received successfully",
    fileName: file.name,
  });
}