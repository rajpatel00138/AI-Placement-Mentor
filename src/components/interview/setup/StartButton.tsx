"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlayCircle } from "lucide-react";

import { useInterview } from "@/context/InterviewContext";

export default function StartButton() {
  const router = useRouter();

  const {
    state,
    setQuestions,
    startInterview,
  } = useInterview();

  const [loading, setLoading] = useState(false);

  async function handleStart() {
    if (
      !state.interviewType ||
      !state.difficulty ||
      !state.company ||
      !state.duration
    ) {
      alert("Please complete all interview settings.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/interview/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewType: state.interviewType,
          difficulty: state.difficulty,
          company: state.company,
          language: state.language,
          questionFormat: state.questionFormat,
          numberOfQuestions: 5,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message);
      }

      const questions = data.questions.map(
        (
          q: {
            type?: "descriptive" | "mcq";
            question: string;
            options?: string[];
            correctAnswer?: string;
            explanation?: string;
            expectedTime?: number;
          },
          index: number
        ) => ({
          id: index + 1,

          type: q.type ?? "descriptive",

          question: q.question,

          options: q.options,

          correctAnswer: q.correctAnswer,

          explanation: q.explanation,

          difficulty: state.difficulty,

          expectedTime: q.expectedTime ?? 3,
        })
      );

      setQuestions(questions);

      startInterview();

      router.push("/dashboard/interview/session");
    } catch (error) {
      console.error(error);

      alert("Unable to generate interview questions.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleStart}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          Preparing AI Interview...
        </>
      ) : (
        <>
          <PlayCircle size={20} />
          Start AI Interview
        </>
      )}
    </button>
  );
}