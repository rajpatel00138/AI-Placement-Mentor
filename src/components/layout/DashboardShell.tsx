"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  FileText,
  BarChart3,
  Mic,
  Compass,
  PieChart,
  MessageSquare,
  Settings,
  Sparkles,
  Search,
  Bell,
  Sun,
  Moon,
  UserCircle2,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { navigationItems } from "@/constants/navigation";

interface DashboardShellProps {
  children: React.ReactNode;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
  logoutAction: () => Promise<void>;
}

const iconMap: Record<string, any> = {
  LayoutGrid,
  FileText,
  BarChart3,
  Mic,
  Compass,
  PieChart,
  MessageSquare,
  Settings,
};

export default function DashboardShell({
  children,
  user,
  logoutAction,
}: DashboardShellProps) {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const userInitials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST";

  const renderNavLinks = () => (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const IconComponent = iconMap[item.icon] || LayoutGrid;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
              isActive
                ? "bg-soft border border-border text-primary shadow-xs"
                : "text-muted hover:bg-elevated hover:text-primary"
            }`}
          >
            <div
              className={`rounded-xl p-1.5 transition ${
                isActive
                  ? "bg-accent text-on-accent shadow-xs"
                  : "bg-elevated/70 text-muted group-hover:text-primary"
              }`}
            >
              <IconComponent size={16} />
            </div>
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden bg-base text-primary flex">
      {/* ========================================================= */}
      {/* 1. DESKTOP FIXED SIDEBAR */}
      {/* ========================================================= */}
      <aside className="hidden lg:flex lg:w-72 h-full shrink-0 flex-col border-r border-border bg-surface overflow-hidden">
        {/* Brand / Logo Top (Fixed) */}
        <div className="p-5 shrink-0 border-b border-border/40">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-2xl border border-border bg-elevated/60 p-3 transition hover:border-accent/40"
          >
            <div className="rounded-2xl bg-accent/15 border border-accent/30 p-2 text-accent">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-primary truncate">AI Placement Mentor</p>
              <p className="text-[11px] text-muted truncate">Premium prep platform</p>
            </div>
          </Link>
        </div>

        {/* Nav Links (Independently scrollable if needed) */}
        <div className="px-3.5 py-4 flex-1 overflow-y-auto">
          {renderNavLinks()}
        </div>

        {/* User Footer (Fixed at Bottom) */}
        <div className="p-3.5 border-t border-border bg-elevated/40 shrink-0">
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl border border-border bg-surface shadow-xs">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent font-bold text-xs shadow-xs overflow-hidden">
                {user?.image ? (
                  <img src={user.image} alt={user.name || "User"} className="h-full w-full object-cover" />
                ) : (
                  userInitials
                )}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-primary truncate">
                  {user?.name || "Student"}
                </p>
                <p className="text-[10px] text-muted truncate">
                  {user?.email || "student@placement.edu"}
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/settings"
              className="p-1.5 rounded-xl text-muted hover:bg-soft hover:text-primary transition shrink-0"
              title="Settings"
            >
              <Settings size={16} />
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MOBILE SLIDE-OVER DRAWER */}
      {/* ========================================================= */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide Drawer Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative flex w-4/5 max-w-xs h-full flex-col border-r border-border bg-surface z-10 shadow-2xl overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-accent/15 border border-accent/30 p-1.5 text-accent">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-bold text-primary">AI Placement Mentor</p>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="rounded-xl border border-border p-1.5 text-muted hover:text-primary"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {renderNavLinks()}
              </div>

              <div className="p-4 border-t border-border bg-elevated/40 shrink-0">
                <div className="flex items-center justify-between">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent font-bold text-xs overflow-hidden">
                      {user?.image ? (
                        <img src={user.image} alt={user.name || "User"} className="h-full w-full object-cover" />
                      ) : (
                        userInitials
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-primary truncate">
                        {user?.name || "Student"}
                      </p>
                      <p className="text-[10px] text-muted truncate">
                        {user?.email || "student@placement.edu"}
                      </p>
                    </div>
                  </Link>

                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="p-1.5 text-muted hover:text-error transition"
                      title="Logout"
                    >
                      <LogOut size={16} />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 3. RIGHT CONTENT COLUMN (HEADER FIXED, MAIN SCROLLS) */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* TOP BAR (FIXED - NEVER SCROLLS AWAY) */}
        <header className="shrink-0 border-b border-border bg-surface px-5 py-3.5 backdrop-blur z-20">
          <div className="flex items-center justify-between gap-4">
            {/* Left Header Greeting & Mobile Toggle */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden rounded-2xl border border-border bg-base p-2 text-muted hover:bg-soft hover:text-primary transition shrink-0"
                title="Open Navigation"
              >
                <Menu size={18} />
              </button>

              <div className="truncate">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-muted truncate">
                  {greeting}
                </p>
                <h1 className="text-base sm:text-lg font-bold text-primary truncate">
                  Placement Command Center
                </h1>
              </div>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Search input (desktop) */}
              <label className="hidden md:flex items-center gap-2 rounded-2xl border border-border bg-base px-3 py-1.5 text-xs text-muted focus-within:border-accent">
                <Search className="h-3.5 w-3.5 text-muted" />
                <input
                  className="bg-transparent outline-none text-xs text-primary placeholder-muted w-32 lg:w-44"
                  placeholder="Search dashboard..."
                />
              </label>

              {/* Notification button */}
              <button
                className="rounded-2xl border border-border bg-base p-2 text-muted hover:bg-soft hover:text-primary transition"
                title="Notifications"
              >
                <Bell size={16} />
              </button>

              {/* Theme toggle button */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="rounded-2xl border border-border bg-base p-2 text-muted hover:bg-soft hover:text-primary transition"
                  title="Toggle Light / Dark Mode"
                >
                  {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              )}

              {/* Logout button */}
              <form action={logoutAction} className="hidden sm:block">
                <button
                  type="submit"
                  className="rounded-2xl border border-border bg-base px-3.5 py-1.5 text-xs font-semibold text-muted transition hover:bg-soft hover:text-primary cursor-pointer"
                >
                  Logout
                </button>
              </form>

              {/* User Profile Avatar Icon Link */}
              <Link
                href="/dashboard/profile"
                className="rounded-2xl border border-border bg-base p-2 text-muted hover:bg-soft hover:text-primary transition"
                title="Profile"
              >
                <UserCircle2 size={18} />
              </Link>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT REGION (THE ONLY ELEMENT THAT SCROLLS CONTENT) */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
