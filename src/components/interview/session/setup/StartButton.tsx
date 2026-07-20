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

    const dummyQuestions = [
      {
        id: 1,
        question:
          "Explain the Virtual DOM in React. How does it improve rendering performance?",
        difficulty: state.difficulty,
        expectedTime: 3,
      },
      {
        id: 2,
        question:
          "What is the difference between useState and useReducer?",
        difficulty: state.difficulty,
        expectedTime: 4,
      },
      {
        id: 3,
        question:
          "Explain React Hooks and why they were introduced.",
        difficulty: state.difficulty,
        expectedTime: 5,
      },
      {
        id: 4,
        question:
          "What are closures in JavaScript? Explain with an example.",
        difficulty: state.difficulty,
        expectedTime: 4,
      },
      {
        id: 5,
        question:
          "Explain Event Bubbling and Event Capturing in JavaScript.",
        difficulty: state.difficulty,
        expectedTime: 3,
      },
    ];

    setQuestions(dummyQuestions);

    startInterview();

    setLoading(true);

    // Future:
    // - Save interview session
    // - Fetch AI-generated questions
    // - Store session in database

    await new Promise((resolve) => setTimeout(resolve, 1200));

    router.push("/dashboard/interview/session");
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
          Preparing Interview...
        </>
      ) : (
        <>
          <PlayCircle size={20} />
          Start Interview
        </>
      )}
    </button>
  );
}