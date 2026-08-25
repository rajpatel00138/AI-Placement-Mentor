import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logoutUser } from "@/lib/auth-actions";
import DashboardShell from "@/components/layout/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <DashboardShell user={session.user} logoutAction={logoutUser}>
      {children}
    </DashboardShell>
  );
}
