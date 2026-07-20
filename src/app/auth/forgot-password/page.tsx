import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_40%),linear-gradient(135deg,#030712_0%,#111827_100%)] px-4 py-12 text-white">
      <div className="mx-auto flex max-w-3xl flex-col rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3 text-slate-200">
          <div className="rounded-2xl border border-indigo-400/30 bg-indigo-400/10 p-3">
            <ShieldCheck className="h-6 w-6 text-indigo-300" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Secure recovery</p>
            <h1 className="text-2xl font-semibold">Reset your password</h1>
          </div>
        </div>
        <p className="mb-6 text-slate-300">Enter your email and we will send a magic link to help you regain access.</p>
        <form className="space-y-4">
          <input className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3" placeholder="you@example.com" />
          <button className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-medium text-slate-900 transition hover:bg-slate-200">
            Send reset link <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        <Link href="/auth/login" className="mt-6 text-sm text-slate-400">
          Back to login
        </Link>
      </div>
    </div>
  );
}
