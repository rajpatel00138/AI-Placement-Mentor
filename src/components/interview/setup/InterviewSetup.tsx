"use client";

import { useEffect } from "react";
import { Brain, Languages, ListChecks, Sparkles } from "lucide-react";

import InterviewTypeCard from "./InterviewTypeCard";
import DifficultySelector from "./DifficultySelector";
import CompanySelector from "./CompanySelector";
import DurationSelector from "./DurationSelector";
import StartButton from "./StartButton";
import QuestionFormatSelector from "./QuestionFormatSelector";
import { useInterview, type InterviewType } from "@/context/InterviewContext";

export default function InterviewSetup({
  initialInterviewType,
}: {
  initialInterviewType?: InterviewType;
}) {
  const { state, setInterviewType, setLanguage } = useInterview();

  useEffect(() => {
    if (initialInterviewType) {
      setInterviewType(initialInterviewType);
    }
  }, [initialInterviewType, setInterviewType]);

  return (
    <div className="space-y-8">
      {/* Configure Your Interview Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent-secondary/10 blur-3xl" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>AI Mock Interview Setup</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-heading">
            Configure Your Interview
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-body-muted leading-relaxed font-normal">
            Choose interview type, target company, duration, and difficulty level.
            Our AI generates tailored questions and provides actionable evaluation feedback after your session.
          </p>
        </div>
      </section>

      {/* Configuration Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Main Selectors */}
        <div className="space-y-6 lg:col-span-2">
          <InterviewTypeCard />
          <DifficultySelector />
          <CompanySelector />
          <QuestionFormatSelector />
        </div>

        {/* Right Column - Duration & Session Settings */}
        <div className="space-y-6">
          <DurationSelector />

          {/* Number of Questions Selector */}
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-accent/10 border border-accent/30 p-2 text-accent">
                <ListChecks size={18} />
              </div>
              <h2 className="text-base font-bold text-heading">
                Number of Questions
              </h2>
            </div>

            <select
              defaultValue="5 Questions"
              className="w-full rounded-2xl border border-border bg-base px-4 py-3 text-sm font-medium text-heading outline-none transition focus:border-accent focus:ring-1 focus:ring-accent shadow-xs cursor-pointer"
            >
              <option value="5 Questions" className="bg-surface text-heading">5 Questions (Recommended)</option>
              <option value="10 Questions" className="bg-surface text-heading">10 Questions</option>
              <option value="15 Questions" className="bg-surface text-heading">15 Questions</option>
              <option value="20 Questions" className="bg-surface text-heading">20 Questions</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-accent/10 border border-accent/30 p-2 text-accent">
                <Languages size={18} />
              </div>
              <h2 className="text-base font-bold text-heading">
                Language
              </h2>
            </div>

            <select
              value={state.language || "English"}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-2xl border border-border bg-base px-4 py-3 text-sm font-medium text-heading outline-none transition focus:border-accent focus:ring-1 focus:ring-accent shadow-xs cursor-pointer"
            >
              <option value="English" className="bg-surface text-heading">English</option>
              <option value="Hinglish" className="bg-surface text-heading">Hinglish</option>
            </select>
          </div>

          <StartButton />
        </div>
      </div>
    </div>
  );
}
