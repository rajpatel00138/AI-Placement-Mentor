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
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interviewType: state.interviewType,
          difficulty: state.difficulty,
          company: state.company,
          language: state.language,
          questionFormat: state.questionFormat,
          numberOfQuestions: state.numberOfQuestions || 5,
          timestamp: Date.now(),
        }),
      });

      const data: {
        success?: boolean;
        error?: string;
        questions?: unknown;
      } = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Question generation failed.");
      }

      if (!Array.isArray(data.questions)) {
        throw new Error("The server returned an invalid list of questions.");
      }

      const questions = data.questions.map(
        (
          q: {
            type?: "descriptive" | "mcq";
            question: string;
            codeSnippet?: string;
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
          codeSnippet: q.codeSnippet,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: state.difficulty,
          expectedTime: q.expectedTime ?? 2,
        })
      );

      setQuestions(questions);
      startInterview();
      router.push("/dashboard/interview/session");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to generate interview questions."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleStart}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-accent hover:bg-accent-hover px-6 py-4 font-bold text-on-accent transition-all duration-200 shadow-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Preparing AI Interview...</span>
        </>
      ) : (
        <>
          <PlayCircle size={20} />
          <span>Start AI Interview</span>
        </>
      )}
    </button>
  );
}
