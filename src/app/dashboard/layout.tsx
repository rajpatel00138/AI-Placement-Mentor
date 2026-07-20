import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, LayoutGrid, MessageSquare, NotebookPen, Search, Settings, Sparkles, SunMoon, UserCircle2 } from "lucide-react";
import { navigationItems } from "@/constants/navigation";
import { auth } from "@/auth";
import { logoutUser } from "@/lib/auth-actions";

const sidebarLinks = navigationItems;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-white/10 bg-slate-900/80 p-5 backdrop-blur lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3">
            <div className="rounded-2xl bg-indigo-500/20 p-2 text-indigo-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Placement Mentor</p>
              <p className="text-xs text-slate-400">Premium prep platform</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {sidebarLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <div className="rounded-xl bg-white/10 p-2">
                  {item.icon === "LayoutGrid" ? <LayoutGrid className="h-4 w-4" /> : null}
                  {item.icon === "FileText" ? <NotebookPen className="h-4 w-4" /> : null}
                  {item.icon === "BarChart3" ? <Search className="h-4 w-4" /> : null}
                  {item.icon === "Mic" ? <MessageSquare className="h-4 w-4" /> : null}
                  {item.icon === "Compass" ? <Sparkles className="h-4 w-4" /> : null}
                  {item.icon === "PieChart" ? <LayoutGrid className="h-4 w-4" /> : null}
                  {item.icon === "MessageSquare" ? <MessageSquare className="h-4 w-4" /> : null}
                  {item.icon === "NotebookPen" ? <NotebookPen className="h-4 w-4" /> : null}
                  {item.icon === "Settings" ? <Settings className="h-4 w-4" /> : null}
                </div>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="border-b border-white/10 bg-slate-900/70 px-5 py-4 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-400">Good evening</p>
                <h1 className="text-xl font-semibold">Placement Command Center</h1>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-400">
                  <Search className="h-4 w-4" />
                  <input className="bg-transparent outline-none" placeholder="Search" />
                </label>
                <button className="rounded-2xl border border-white/10 bg-white/10 p-2.5 text-slate-200">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="rounded-2xl border border-white/10 bg-white/10 p-2.5 text-slate-200">
                  <SunMoon className="h-4 w-4" />
                </button>
                <form action={logoutUser}>
                  <button type="submit" className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/20">
                    Logout
                  </button>
                </form>
                <Link href="/dashboard/profile" className="rounded-2xl border border-white/10 bg-white/10 p-2.5 text-slate-200">
                  <UserCircle2 className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </header>
          <main className="p-5 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
