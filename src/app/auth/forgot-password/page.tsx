"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  }

  return (
    <div className="min-h-screen bg-base px-4 py-12 text-primary flex items-center justify-center relative overflow-hidden">
      {/* Soft background ambient shapes */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-soft/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-secondary/15 blur-3xl" />

      <div className="mx-auto flex max-w-lg flex-col rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm w-full relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl border border-border bg-soft p-3 text-accent shadow-xs">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Secure recovery</p>
            <h1 className="text-2xl font-bold text-primary">Reset your password</h1>
          </div>
        </div>

        {submitted ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-xs sm:text-sm text-success">
              Password reset link sent! Check your inbox at <strong className="font-semibold">{email}</strong>.
            </div>
            <Link
              href="/auth/login"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 font-semibold text-on-accent transition hover:bg-accent-hover shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to login</span>
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-xs sm:text-sm text-muted leading-relaxed">
              Enter your registered account email and we will send instructions to help you securely reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-primary placeholder:text-muted/60 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 font-semibold text-on-accent transition hover:bg-accent-hover shadow-sm active:scale-[0.99]"
              >
                <span>Send reset link</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to login</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
