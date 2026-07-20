import Link from "next/link";
import { Bell, MoonStar, Search, Sparkles, UserCircle2 } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-500/15 p-2 text-indigo-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Placement Mentor</p>
              <p className="text-xs text-slate-400">Foundation build</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-400 sm:flex">
              <Search className="h-4 w-4" />
              <input className="bg-transparent outline-none" placeholder="Search" />
            </label>
            <button className="rounded-2xl border border-white/10 bg-white/10 p-2.5 text-slate-200">
              <Bell className="h-4 w-4" />
            </button>
            <button className="rounded-2xl border border-white/10 bg-white/10 p-2.5 text-slate-200">
              <MoonStar className="h-4 w-4" />
            </button>
            <Link href="/dashboard/profile" className="rounded-2xl border border-white/10 bg-white/10 p-2.5 text-slate-200">
              <UserCircle2 className="h-4 w-4" />
            </Link>
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
