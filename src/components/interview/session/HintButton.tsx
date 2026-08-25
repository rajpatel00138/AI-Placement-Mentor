"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";

export default function HintButton() {
  const { state } = useInterview();

  const currentQuestion =
    state.questions[state.currentQuestion];

  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    setHint("");
    setLoading(false);
  }, [state.currentQuestion]);

  if (!currentQuestion) {
    return null;
  }

  const generateHint = async () => {
    if (hint) return;

    try {
      setLoading(true);

      const response = await fetch("/api/interview/hint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          interviewType: state.interviewType,
          difficulty: state.difficulty,
          company: state.company,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to generate hint.");
      }

      setHint(data.hint);
    } catch (error) {
      console.error(error);
      alert("Failed to generate hint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5">
      <button
        onClick={generateHint}
        disabled={loading || !!hint}
        className="flex items-center gap-3 rounded-xl bg-amber-500 px-5 py-3 font-medium text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Generating Hint...
          </>
        ) : (
          <>
            <Lightbulb size={18} />
            {hint ? "Hint Generated" : "Need a Hint?"}
          </>
        )}
      </button>

      {hint && (
        <div className="mt-5 rounded-2xl border border-amber-500/30 bg-slate-950 p-4">
          <h3 className="mb-2 font-semibold text-amber-400">
            💡 AI Hint
          </h3>

          <p className="leading-7 text-slate-300">
            {hint}
          </p>
        </div>
      )}
    </section>
  );
}