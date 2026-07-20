import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-white">
      <div className="max-w-md rounded-[28px] border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">404</p>
        <h1 className="mt-3 text-3xl font-semibold">This page vanished.</h1>
        <p className="mt-3 text-slate-300">The route you are looking for is not available yet.</p>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-2xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
