import Link from "next/link";
import { ArrowRight, Sparkles, Brain, ShieldCheck, BarChart3 } from "lucide-react";

const featureHighlights = [
  { title: "Placement roadmap", description: "Structure your journey with milestones and focus areas." },
  { title: "Interview prep", description: "Practice with a polished and calm interview workspace." },
  { title: "Smart analytics", description: "Track progress with elegant dashboards and momentum insights." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25),_transparent_40%),linear-gradient(135deg,#020617_0%,#111827_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-200">
                <Sparkles className="h-4 w-4" />
                AI Placement Mentor
              </div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                Prepare smarter, ship faster, and enter placements with clarity.
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                A premium all-in-one platform for resumes, roadmap planning, interview prep, and analytics in one calm experience.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth/signup" className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 font-medium text-white transition hover:bg-indigo-400">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/dashboard" className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-medium text-slate-100 transition hover:bg-white/20">
                  View dashboard
                </Link>
              </div>
            </div>
            <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Launch snapshot</p>
                  <p className="font-semibold text-white">Placement readiness: 87%</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  "Resume polish in progress",
                  "Daily DSA consistency streak",
                  "Mock interview scheduled",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {featureHighlights.map((feature) => (
            <div key={feature.title} className="rounded-[24px] border border-white/10 bg-slate-900/70 p-6 shadow-lg">
              <div className="mb-3 inline-flex rounded-2xl bg-white/10 p-2 text-indigo-300">
                {feature.title.includes("roadmap") ? <BarChart3 className="h-4 w-4" /> : null}
                {feature.title.includes("Interview") ? <ShieldCheck className="h-4 w-4" /> : null}
                {feature.title.includes("analytics") ? <Sparkles className="h-4 w-4" /> : null}
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
