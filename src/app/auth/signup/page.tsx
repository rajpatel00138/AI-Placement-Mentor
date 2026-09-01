"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "Signup failed.");
      setIsSubmitting(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Account created, but login failed. Please try signing in manually.");
      setIsSubmitting(false);
      return;
    }

    if (role === "recruiter") {
      router.push("/recruiter/dashboard");
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  }

  async function handleGoogleSignUp() {
    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error("Google signup error:", err);
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base px-4 py-12 text-primary flex items-center justify-center relative overflow-hidden">
      {/* Soft background ambient shapes */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-soft/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-secondary/15 blur-3xl" />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between w-full relative z-10 p-4 sm:p-8">
        {/* Left Side Branding */}
        <div className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Create your mentor workspace</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl lg:text-5xl leading-tight">
            Start building your placement edge.
          </h1>

          <p className="text-base sm:text-lg text-muted leading-relaxed">
            Track progress, organize prep materials, simulate real interview rounds, and accelerate your journey with AI guidance.
          </p>

          <div className="space-y-3 pt-2 text-xs sm:text-sm font-medium text-muted">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
              <span>Full-stack ATS resume analysis and gap detection</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
              <span>Adaptive DSA topic roadmap with curated problem sets</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
              <span>Interactive AI mock interviews with real-time feedback</span>
            </div>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Get started free</p>
            <h2 className="mt-1 text-2xl font-bold text-primary">Create an account</h2>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-elevated px-4 py-3 text-xs sm:text-sm font-semibold text-primary shadow-xs transition hover:bg-soft active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 mb-5"
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
            <span>{isGoogleLoading ? "Connecting to Google..." : "Sign up with Google"}</span>
          </button>

          <div className="relative mb-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-surface px-3 text-[11px] font-bold uppercase tracking-wider text-muted">
              Or sign up with email
            </span>
          </div>

          {/* Role Selector Tabs */}
          <div className="mb-5 rounded-2xl border border-border/80 bg-soft/50 p-1.5 flex gap-1.5">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                role === "student"
                  ? "bg-surface text-primary shadow-xs border border-border"
                  : "text-muted hover:text-primary"
              }`}
            >
              🎓 Student Account
            </button>
            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                role === "recruiter"
                  ? "bg-surface text-primary shadow-xs border border-border"
                  : "text-muted hover:text-primary"
              }`}
            >
              👔 Recruiter Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                Full name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Aarav Sharma"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-primary placeholder:text-muted/60 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                Email address
              </label>
              <input
                name="email"
                type="email"
                placeholder="aarav@college.edu"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-primary placeholder:text-muted/60 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                Password
              </label>
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
              <div className="rounded-xl border border-error/30 bg-error/10 p-3 text-xs font-medium text-error">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 font-semibold text-on-accent transition hover:bg-accent-hover shadow-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{isSubmitting ? "Creating account..." : "Create account"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs sm:text-sm text-muted">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-accent hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
