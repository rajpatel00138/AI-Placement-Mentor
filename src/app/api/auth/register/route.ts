import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createUserFallback } from "@/lib/auth-store";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let payload: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      const body = await request.text();

      if (!body.trim()) {
        return NextResponse.json({ error: "Request body is required." }, { status: 400 });
      }

      payload = JSON.parse(body) as Record<string, unknown>;
    } else {
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries());
    }

    const nameValue = payload.name;
    const emailValue = payload.email;
    const passwordValue = payload.password;

    if (!nameValue || !emailValue || !passwordValue) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const normalizedEmail = String(emailValue).toLowerCase().trim();
    const normalizedName = String(nameValue).trim();
    const normalizedPassword = String(passwordValue);

    const requestedRole = payload.role === "recruiter" ? "recruiter" : "student";

    const shouldUsePrisma = process.env.USE_PRISMA_PERSISTENCE === "true" || process.env.NODE_ENV === "production";

    if (shouldUsePrisma) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (existingUser) {
          return NextResponse.json({ error: "User already exists." }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

        const user = await prisma.user.create({
          data: {
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword,
            role: requestedRole,
          },
        });

        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      } catch (error) {
        console.warn("Prisma registration failed, falling back to in-memory registration", error);
      }
    }

    const fallbackUser = await createUserFallback({
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
      role: requestedRole,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: fallbackUser.id,
        name: fallbackUser.name,
        email: fallbackUser.email,
        role: fallbackUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
