"use client";

import {
  Brain,
  Clock3,
  Building2,
  Languages,
  ListChecks,
} from "lucide-react";

import InterviewTypeCard from "./InterviewTypeCard";
import DifficultySelector from "./DifficultySelector";
import CompanySelector from "./CompanySelector";
import DurationSelector from "./DurationSelector";
import StartButton from "./StartButton";
import QuestionFormatSelector from "./QuestionFormatSelector";

export default function InterviewSetup() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8">

        <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/15 px-4 py-2 text-violet-300">
          <Brain size={16} />
          AI Mock Interview
        </div>

        <h1 className="mt-5 text-4xl font-bold text-white">
          Configure Your Interview
        </h1>

        <p className="mt-4 max-w-3xl text-slate-400">
          Choose interview type, company, duration and difficulty.
          Our AI will generate personalized interview questions and
          provide detailed feedback after the session.
        </p>

      </section>

      {/* Grid */}

      <div className="grid gap-8 lg:grid-cols-3">

        {/* Left */}

        <div className="space-y-6 lg:col-span-2">

          <InterviewTypeCard />

          <DifficultySelector />

          <CompanySelector />
          <QuestionFormatSelector />

        </div>

        {/* Right */}

        <div className="space-y-6">

          <DurationSelector />

          {/* Questions */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="mb-5 flex items-center gap-3">

              <ListChecks className="text-violet-400" />

              <h2 className="text-lg font-semibold text-white">
                Number of Questions
              </h2>

            </div>

            <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none">

              <option>5 Questions</option>
              <option>10 Questions</option>
              <option>15 Questions</option>
              <option>20 Questions</option>

            </select>

          </div>

          {/* Language */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="mb-5 flex items-center gap-3">

              <Languages className="text-cyan-400" />

              <h2 className="text-lg font-semibold text-white">
                Language
              </h2>

            </div>

            <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none">

              <option>English</option>
              <option>Hinglish</option>

            </select>

          </div>

          <StartButton />

        </div>

      </div>

    </div>
  );
}