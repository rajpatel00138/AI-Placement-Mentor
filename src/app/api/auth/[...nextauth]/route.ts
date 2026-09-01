import { handlers } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(request: Request | NextRequest) {
  try {
    const nextReq = request instanceof NextRequest ? request : new NextRequest(request.url, request as RequestInit);
    return await handlers.GET(nextReq);
  } catch (e) {
    console.error("NextAuth GET error:", e);
    throw e;
  }
}

export async function POST(request: Request | NextRequest) {
  try {
    const nextReq = request instanceof NextRequest ? request : new NextRequest(request.url, request as RequestInit);
    return await handlers.POST(nextReq);
  } catch (e) {
    console.error("NextAuth POST error:", e);
    throw e;
  }
}
