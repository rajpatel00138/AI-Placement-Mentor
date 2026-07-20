"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@placementmentor.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25),_transparent_40%),linear-gradient(135deg,#030712_0%,#111827_100%)] px-4 py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between lg:p-12">
        <div className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-200">
            <Sparkles className="h-4 w-4" />
            AI Placement Mentor
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Your calm, intelligent launchpad for placement success.
          </h1>
          <p className="text-lg text-slate-300">
            Build a premium prep experience with roadmap guidance, mock interviews, and polished progress insight.
          </p>
        </div>
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-xl">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">Welcome back</p>
            <h2 className="mt-2 text-2xl font-semibold">Log in to continue</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none ring-0"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none ring-0"
                required
              />
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Sign in"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-6 text-sm text-slate-400">
            New here? <Link href="/auth/signup" className="font-medium text-indigo-300">Create an account</Link>
          </div>
          <div className="mt-3 text-sm text-slate-400">
            Forgot password? <Link href="/auth/forgot-password" className="font-medium text-indigo-300">Recover access</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
