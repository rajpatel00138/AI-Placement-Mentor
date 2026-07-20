"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";
import { useRouter } from "next/navigation";

export default function InterviewTimer() {
    const router = useRouter();
  const { state, finishInterview } = useInterview();

  const [timeLeft, setTimeLeft] = useState(
    state.duration * 60
  );

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
  }, [
    timeLeft,
    state.isInterviewStarted,
    finishInterview,
  ]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 px-8 py-5 text-center">
      <p className="text-sm text-slate-400">
        Time Remaining
      </p>

      <h2 className="mt-2 text-4xl font-bold text-violet-400">
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </h2>

      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-400">
        <Clock3 size={16} />
        Live Interview Timer
      </div>
    </div>
  );
}