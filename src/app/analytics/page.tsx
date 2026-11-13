import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AnalyticsRootPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  const role = (session.user as any).role;
  if (role === "recruiter" || role === "admin") {
    redirect("/recruiter/analytics");
  }

  // Students must never access cohort-wide recruiter analytics
  redirect("/dashboard");
}
