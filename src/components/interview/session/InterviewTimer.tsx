"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";
import { useRouter } from "next/navigation";

export default function InterviewTimer() {
  const router = useRouter();
  const { state, finishInterview } = useInterview();

  const [timeLeft, setTimeLeft] = useState(state.duration * 60);

  useEffect(() => {
    setTimeLeft(state.duration * 60);
  }, [state.duration]);

  useEffect(() => {
    if (!state.isInterviewStarted) return;

    if (timeLeft <= 0) {
      finishInterview();
      router.push("/dashboard/interview/report");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, state.isInterviewStarted, finishInterview, router]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Warn red when under 2 minutes
  const isWarning = timeLeft < 120;

  return (
    <div
      className={`rounded-2xl border px-8 py-5 text-center ${
        isWarning
          ? "border-red-400/40 bg-red-500/10"
          : "border-accent/30 bg-accent/10"
      }`}
    >
      <p className="text-sm text-body-muted">Time Remaining</p>

      <h2
        className={`mt-2 text-4xl font-bold tabular-nums ${
          isWarning ? "text-red-500 dark:text-red-400" : "text-accent"
        }`}
      >
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </h2>

      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-body-muted">
        <Clock3 size={16} />
        Live Interview Timer
      </div>
    </div>
  );
}