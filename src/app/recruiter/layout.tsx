import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logoutUser } from "@/lib/auth-actions";
import RecruiterShell from "@/components/recruiter/RecruiterShell";

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userRole = (session.user as any).role;
  if (userRole !== "recruiter") {
    redirect("/dashboard");
  }

  return (
    <RecruiterShell user={session.user} logoutAction={logoutUser}>
      {children}
    </RecruiterShell>
  );
}
