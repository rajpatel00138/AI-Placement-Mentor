"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Building2,
  ShieldCheck,
  Briefcase,
  Layers,
} from "lucide-react";
import { signIn } from "next-auth/react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRoleParam = searchParams.get("role");
  const [selectedRole, setSelectedRole] = useState<"student" | "recruiter">(
    initialRoleParam === "recruiter" ? "recruiter" : "student"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (initialRoleParam === "recruiter") {
      setSelectedRole("recruiter");
      setEmail("");
      setPassword("");
      setError("");
    } else if (initialRoleParam === "student") {
      setSelectedRole("student");
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [initialRoleParam]);

  const handleRoleSelect = (role: "student" | "recruiter") => {
    setSelectedRole(role);
    setError("");
    setEmail("");
    setPassword("");
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // 1. Role and credentials verification
      const checkRes = await fetch("/api/auth/validate-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          expectedRole: selectedRole,
        }),
      });

      const checkData = await checkRes.json();

      if (!checkRes.ok || !checkData.valid) {
        setError(checkData.error || "Invalid email or password.");
        setIsSubmitting(false);
        return;
      }

      // 2. Perform NextAuth authentication
      const result = await signIn("credentials", {
        email,
        password,
        expectedRole: selectedRole,
        redirect: false,
      });

      if (result?.error) {
        setError("Sign in failed. Please verify your credentials.");
        setIsSubmitting(false);
        return;
      }

      // 3. Route according to verified role
      if (selectedRole === "recruiter") {
        router.push("/recruiter/dashboard");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      console.error("Login submission error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    if (selectedRole !== "student") return;
    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error("Google signin error:", err);
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base px-4 py-12 text-primary flex items-center justify-center relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-soft/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-secondary/15 blur-3xl" />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between w-full relative z-10 p-4 sm:p-8">
        {/* Left Side Branding */}
        <div className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>AI Placement Mentor</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl lg:text-5xl leading-tight">
            {selectedRole === "student"
              ? "Your calm, intelligent launchpad for placement success."
              : "Enterprise Candidate Discovery & Cohort Intelligence."}
          </h1>

          <p className="text-base sm:text-lg text-muted leading-relaxed">
            {selectedRole === "student"
              ? "Build a personalized prep experience with verified roadmap progress, ATS resume analysis, mock interviews, and real-time readiness analytics."
              : "Discover top-tier student candidates, track college placement readiness metrics, and filter talent by verified coding and interview benchmarks."}
          </p>

          <div className="space-y-3 pt-2 text-xs sm:text-sm font-medium text-muted">
            {selectedRole === "student" ? (
              <>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Unified workspace for technical, interview, and resume mastery</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span>Adaptive DSA roadmaps and realistic AI mock interview simulations</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>Recruiter cohort analytics and candidate readiness rankings</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>Detailed student drill-downs across DSA, Resume, and Interview scores</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Portal Login</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-0.5 text-[11px] font-semibold text-accent border border-border">
                {selectedRole === "student" ? "🎓 Student Portal" : "👔 Recruiter Portal"}
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-primary">
              {selectedRole === "student" ? "Student Sign In" : "Recruiter Sign In"}
            </h2>
          </div>

          {/* 1. Large Portal Selection Cards */}
          <div className="mb-6 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleRoleSelect("student")}
              className={`flex flex-col items-start p-3 rounded-2xl border text-left transition relative ${
                selectedRole === "student"
                  ? "border-accent bg-soft/70 shadow-xs ring-1 ring-accent/30"
                  : "border-border bg-surface hover:bg-elevated text-muted hover:text-primary"
              }`}
            >
              <div
                className={`p-2 rounded-xl mb-2 ${
                  selectedRole === "student"
                    ? "bg-accent text-on-accent"
                    : "bg-soft text-muted"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-primary">Student</span>
              <span className="text-[10px] text-muted line-clamp-1">Prep & Roadmaps</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("recruiter")}
              className={`flex flex-col items-start p-3 rounded-2xl border text-left transition relative ${
                selectedRole === "recruiter"
                  ? "border-accent bg-soft/70 shadow-xs ring-1 ring-accent/30"
                  : "border-border bg-surface hover:bg-elevated text-muted hover:text-primary"
              }`}
            >
              <div
                className={`p-2 rounded-xl mb-2 ${
                  selectedRole === "recruiter"
                    ? "bg-accent text-on-accent"
                    : "bg-soft text-muted"
                }`}
              >
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-primary">Recruiter</span>
              <span className="text-[10px] text-muted line-clamp-1">Talent Discovery</span>
            </button>
          </div>

          {/* 2. Google OAuth Button (Student Only) */}
          {selectedRole === "student" && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-elevated px-4 py-3 text-xs sm:text-sm font-semibold text-primary shadow-xs transition hover:bg-soft active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 mb-4"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
              </button>

              <div className="relative mb-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <span className="relative bg-surface px-3 text-[11px] font-bold uppercase tracking-wider text-muted">
                  Or sign in with email
                </span>
              </div>
            </>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                {selectedRole === "student" ? "Student Email" : "Corporate Recruiter Email"}
              </label>
              <input
                name="email"
                type="email"
                placeholder={
                  selectedRole === "student"
                    ? "student@college.edu"
                    : "recruiter@partner.com"
                }
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-primary placeholder:text-muted/60 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                required
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-primary placeholder:text-muted/60 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                required
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-error/30 bg-error/10 p-3 text-xs font-medium text-error leading-relaxed">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 font-semibold text-on-accent transition hover:bg-accent-hover shadow-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>
                {isSubmitting
                  ? "Verifying & Signing in..."
                  : selectedRole === "student"
                  ? "Sign In as Student"
                  : "Sign In as Recruiter"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs sm:text-sm text-muted">
            New here?{" "}
            <Link href="/auth/signup" className="font-semibold text-accent hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
