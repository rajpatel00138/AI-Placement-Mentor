"use client";

import { RotateCcw, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/context/InterviewContext";

export default function ReportActions() {
  const router = useRouter();
  const { resetInterview } = useInterview();

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <button
        onClick={() => {
          resetInterview();
          router.push("/dashboard/interview/start");
        }}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-4 font-semibold text-white transition hover:bg-violet-700"
      >
        <RotateCcw size={20} />
        Start Another Interview
      </button>

      <button
        onClick={() => {
          resetInterview();
          router.push("/dashboard");
        }}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-700 px-6 py-4 font-semibold text-white transition hover:border-violet-500"
      >
        <LayoutDashboard size={20} />
        Back to Dashboard
      </button>
    </div>
  );
}