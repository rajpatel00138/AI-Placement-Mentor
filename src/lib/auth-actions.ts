"use server";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  redirect("/dashboard");
}

export async function logoutUser() {
  await signOut({ redirect: false });
  redirect("/auth/login");
}
