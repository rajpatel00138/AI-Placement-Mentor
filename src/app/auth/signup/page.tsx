"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
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

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.2),_transparent_40%),linear-gradient(135deg,#020617_0%,#111827_100%)] px-4 py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl lg:flex-row lg:items-center lg:p-12">
        <div className="max-w-xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-200">
            <Sparkles className="h-4 w-4" />
            Create your mentor workspace
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Start building your placement edge.</h1>
          <p className="text-lg text-slate-300">Track progress, organize prep materials, and move forward with confidence.</p>
        </div>
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Full name</label>
              <input
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
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
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
                required
              />
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating account..." : "Create account"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-6 text-sm text-slate-400">
            Already have an account? <Link href="/auth/login" className="font-medium text-emerald-300">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
