import { z } from "zod";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
};

export const authOptions = {
  providers: ["credentials"],
  session: {
    strategy: "jwt",
  },
};

export async function validateCredentials(rawCredentials: unknown) {
  const parsed = z
    .object({
      email: z.string().email(),
      password: z.string().min(6),
    })
    .safeParse(rawCredentials);

  if (!parsed.success) {
    return null;
  }

  const { email, password } = parsed.data;

  if (email.toLowerCase() === "demo@placementmentor.com" && password === "password123") {
    return {
      id: "demo-user",
      name: "Aarav Patel",
      email,
      image: "",
      role: "Student",
    } satisfies AuthUser;
  }

  if (email.includes("@") && password.length >= 6) {
    return {
      id: "preview-user",
      name: "Guest User",
      email,
      image: "",
      role: "Preview",
    } satisfies AuthUser;
  }

  return null;
}
