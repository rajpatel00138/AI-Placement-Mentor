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
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 font-semibold text-on-accent transition hover:bg-accent-hover"
      >
        <RotateCcw size={20} />
        Start Another Interview
      </button>

      <button
        onClick={() => {
          resetInterview();
          router.push("/dashboard");
        }}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border px-6 py-4 font-semibold text-heading transition hover:border-accent hover:text-accent"
      >
        <LayoutDashboard size={20} />
        Back to Dashboard
      </button>
    </div>
  );
}