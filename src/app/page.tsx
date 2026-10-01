"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Brain,
  Compass,
  Mic,
  BarChart3,
  CheckCircle2,
  Flame,
  Menu,
  X,
  GraduationCap,
  Building2,
  TrendingUp,
  ChevronRight,
  Target,
  FileText,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Roadmap", href: "/dashboard/roadmap" },
];

const STATS = [
  {
    number: "500+",
    label: "Students Assessed",
    description: "Across top engineering colleges & specialized branches",
    icon: GraduationCap,
    iconColor: "text-accent",
    iconBg: "bg-accent/15 border-accent/30",
  },
  {
    number: "50+",
    label: "Partner Recruiters",
    description: "Actively shortlisting talent via predictive analytics",
    icon: Building2,
    iconColor: "text-accent-secondary",
    iconBg: "bg-accent-secondary/15 border-accent-secondary/30",
  },
  {
    number: "92%+",
    label: "Readiness Accuracy",
    description: "Multi-pillar scoring validated against hiring outcomes",
    icon: TrendingUp,
    iconColor: "text-success",
    iconBg: "bg-success/15 border-success/30",
  },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [count, setCount] = useState(0);

  // Scroll detection for navbar background blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Readiness Score count-up
  useEffect(() => {
    let current = 0;
    const target = 87;
    const timer = setInterval(() => {
      current += 1;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 18);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-base text-primary selection:bg-accent selection:text-on-accent relative overflow-hidden">
      {/* AMBIENT BACKGROUND GLOWS & GRID */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Hero soft glow blobs */}
        <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-tr from-accent/15 via-soft/30 to-accent-secondary/15 blur-[120px]" />
        <div className="absolute -bottom-40 right-0 h-[500px] w-[600px] rounded-full bg-soft/40 blur-[130px]" />
        <div className="absolute top-1/2 -left-40 h-[400px] w-[500px] rounded-full bg-accent/10 blur-[130px]" />
      </div>

      {/* 1. TOP NAVBAR */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-border bg-surface/90 backdrop-blur-xl shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Left */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent shadow-sm transition group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-primary group-hover:text-accent transition">
                AI Placement Mentor
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                Readiness System
              </span>
            </div>
          </Link>

          {/* Centered Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-surface/80 px-4 py-1.5 backdrop-blur-lg shadow-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted transition hover:bg-soft hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Far Right Filled CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/signup"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-accent hover:bg-accent-hover px-4 py-2.5 text-xs font-semibold text-on-accent shadow-sm transition duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden rounded-xl border border-border bg-surface p-2 text-muted hover:bg-soft hover:text-primary transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-border bg-surface/95 px-4 py-6 backdrop-blur-2xl md:hidden shadow-lg"
            >
              <div className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-soft hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover py-3 text-sm font-semibold text-on-accent shadow"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-border bg-surface py-3 text-sm font-medium text-primary hover:bg-soft"
                  >
                    View Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN HERO CONTENT */}
      <main className="pt-28 sm:pt-36 lg:pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* HERO LEFT COLUMN */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-7 space-y-6 sm:space-y-8"
            >
              {/* Badge above headline */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>AI-POWERED PLACEMENT READINESS</span>
              </div>

              {/* Large 3-line Hero Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary leading-[1.1] sm:leading-[1.12]">
                <span className="block text-primary">Prepare Smarter,</span>
                <span className="block text-accent py-1">
                  Accelerate Your Career,
                </span>
                <span className="block text-primary">Enter Placements With Clarity.</span>
              </h1>

              {/* Subheading */}
              <p className="max-w-xl text-base sm:text-lg text-muted font-normal leading-relaxed">
                A unified diagnostic intelligence platform uniting ATS resume refinement, adaptive DSA roadmaps, realistic AI mock interviews, and recruiter-level analytics into one calm experience.
              </p>

              {/* Two CTA buttons side by side */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/auth/signup"
                  className="group relative inline-flex min-h-[50px] items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-accent hover:bg-accent-hover px-7 py-3.5 font-semibold text-on-accent shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-7 py-3.5 font-semibold text-primary shadow-sm transition-all duration-300 hover:bg-soft hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>View Dashboard</span>
                </Link>
              </div>

              {/* Mini feature checkmarks */}
              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-medium text-muted">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" /> Free Student Diagnostic
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" /> Recruiter Cohort Analytics
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" /> Instant ATS Scoring
                </span>
              </div>
            </motion.div>

            {/* HERO RIGHT COLUMN: OVERLAPPING DUAL-CARD COMPOSITION */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.65 }}
              className="lg:col-span-5 relative flex justify-center lg:justify-end mt-4 lg:mt-0"
            >
              <div className="relative w-full max-w-[460px]">
                {/* LARGER CARD BEHIND: Dashboard Preview */}
                <div className="relative overflow-hidden rounded-[28px] border border-border bg-surface p-6 shadow-xl backdrop-blur-2xl">
                  {/* Card top bar */}
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-error" />
                      <div className="h-3 w-3 rounded-full bg-warning" />
                      <div className="h-3 w-3 rounded-full bg-success" />
                      <span className="ml-2 text-xs font-medium text-muted">Command Center • Overview</span>
                    </div>
                    <span className="rounded-full bg-soft border border-border px-2.5 py-0.5 text-[10px] font-semibold text-accent">
                      LIVE
                    </span>
                  </div>

                  {/* Dashboard Preview Elements */}
                  <div className="mt-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-border bg-elevated p-3.5">
                        <p className="text-[11px] text-muted font-medium uppercase tracking-wider">Target Company</p>
                        <p className="text-sm font-bold text-primary mt-1">Google • SWE</p>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
                          <div className="h-full w-[85%] rounded-full bg-accent" />
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border bg-elevated p-3.5">
                        <p className="text-[11px] text-muted font-medium uppercase tracking-wider">Cohort Rank</p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-base font-black text-warning">#3</span>
                          <span className="text-[11px] text-muted">of 120 Candidates</span>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
                          <div className="h-full w-[95%] rounded-full bg-success" />
                        </div>
                      </div>
                    </div>

                    {/* Pillar scores preview */}
                    <div className="rounded-2xl border border-border bg-elevated p-4 space-y-2.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-primary font-medium">Data Structures & Algorithms</span>
                        <span className="font-bold text-accent">92 / 100</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-primary font-medium">AI Mock Interview Score</span>
                        <span className="font-bold text-accent-secondary">88 / 100</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-primary font-medium">ATS Resume Quality</span>
                        <span className="font-bold text-success">85 / 100</span>
                      </div>
                    </div>

                    {/* Streak indicator */}
                    <div className="flex items-center justify-between rounded-xl border border-border bg-soft/50 p-3 text-xs text-primary">
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-warning" />
                        <span>14-day consistency streak</span>
                      </div>
                      <span className="text-success font-semibold">+12% momentum</span>
                    </div>
                  </div>
                </div>

                {/* SMALLER FLOATING CARD IN FRONT */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -20, y: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="absolute -bottom-8 -left-4 sm:-left-8 w-[260px] sm:w-[280px] rounded-[24px] border border-border bg-surface p-4 sm:p-5 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="absolute -top-3.5 right-4 rounded-full border border-success/40 bg-success px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-accent shadow-sm">
                    VERIFIED READY
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-success/30 bg-success/15 text-success">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold tracking-wider text-muted">Diagnostic Score</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-primary">{count}%</span>
                        <span className="text-[10px] font-semibold text-success">Readiness</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-[11px]">
                    <span className="text-muted">Placement Probability</span>
                    <span className="font-bold text-success">96% High</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* STATS ROW */}
          <div className="mt-20 sm:mt-24 lg:mt-28 border-t border-border pt-12 sm:pt-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {STATS.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                    className="group relative flex items-start gap-4 rounded-[24px] border border-border bg-surface p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border ${stat.iconBg} ${stat.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                      <StatIcon className="h-6 w-6" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-3xl sm:text-4xl font-black tracking-tight text-primary group-hover:text-accent transition-colors">
                        {stat.number}
                      </p>
                      <p className="text-sm font-bold text-primary">
                        {stat.label}
                      </p>
                      <p className="text-xs text-muted leading-relaxed">
                        {stat.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* FEATURES SECTION */}
          <section id="features" className="mt-24 sm:mt-32 pb-16">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3 py-1 text-xs font-semibold text-primary">
                <Target className="h-3.5 w-3.5 text-accent" />
                <span>CORE PILLARS</span>
              </div>
              <h2 className="text-3xl font-black text-primary sm:text-4xl">
                Engineered for Placement Excellence
              </h2>
              <p className="text-sm text-muted">
                Everything you need to benchmark skills, sharpen your resume, and secure tier-1 offers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1: Placement Roadmap */}
              <div className="group rounded-[26px] border border-border bg-surface p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent/15 text-accent mb-5">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-primary group-hover:text-accent transition">
                  Placement Roadmap
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Structure your journey with personalized milestones, skill gap analysis, and a clear week-by-week path to your target role.
                </p>
                <Link href="/dashboard/roadmap" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition">
                  Explore Roadmap <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Feature 2: AI Mock Interviews */}
              <div className="group rounded-[26px] border border-border bg-surface p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-secondary/30 bg-accent-secondary/15 text-accent-secondary mb-5">
                  <Mic className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-primary group-hover:text-accent transition">
                  AI Mock Interviews
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Practice behavioral and technical questions with instant feedback on confidence, clarity, and keyword coverage.
                </p>
                <Link href="/dashboard/interview" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition">
                  Start Practice <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Feature 3: Resume Analysis */}
              <div className="group rounded-[26px] border border-border bg-surface p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-success/30 bg-success/15 text-success mb-5">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-primary group-hover:text-accent transition">
                  Resume Analysis
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Get an ATS-style score, section-by-section feedback, and keyword gap analysis so your resume gets shortlisted.
                </p>
                <Link href="/dashboard/resume" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition">
                  Analyze Resume <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Feature 4: Company-Wise Preparation */}
              <div className="group rounded-[26px] border border-border bg-surface p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-warning/30 bg-warning/15 text-warning mb-5">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-primary group-hover:text-accent transition">
                  Company-Wise Preparation
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Practice real interview questions asked by top companies, filtered by timeframe, with progress tracking for every question.
                </p>
                <Link href="/student/company-prep" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition">
                  Start Preparing <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-surface py-8 text-center text-xs text-muted">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AI Placement Mentor. Built for modern campus placements.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-primary transition">Privacy Policy</Link>
            <Link href="/" className="hover:text-primary transition">Terms of Service</Link>
            <Link href="/dashboard" className="hover:text-primary transition">Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
