import { handlers } from "@/auth";
import { NextRequest } from "next/server";

function toNextRequest(request: Request | NextRequest): NextRequest {
  if (request instanceof NextRequest) {
    return request;
  }

  return new NextRequest(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    signal: request.signal ? request.signal : undefined,
    duplex: "half",
  });
}

export async function GET(request: Request | NextRequest) {
  try {
    const nextReq = toNextRequest(request);
    return await handlers.GET(nextReq);
  } catch (e) {
    console.error("NextAuth GET error:", e);
    throw e;
  }
}

export async function POST(request: Request | NextRequest) {
  try {
    const nextReq = toNextRequest(request);
    return await handlers.POST(nextReq);
  } catch (e) {
    console.error("NextAuth POST error:", e);
    throw e;
  }
}
