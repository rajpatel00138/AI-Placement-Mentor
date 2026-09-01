"use client";

import { FileText, CheckCircle2, Circle, Code2, Terminal } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";

export default function AnswerEditor() {
  const { state, setAnswer } = useInterview();

  const currentQuestion = state.questions[state.currentQuestion];

  if (!currentQuestion) {
    return null;
  }

  const answer = state.answers[currentQuestion.id] ?? "";
  const isMCQ = currentQuestion.type === "mcq";
  const isPseudocode = state.interviewType === "pseudocode" || state.interviewType === "pseudo-code";

  // Enable Tab indentation for code/pseudocode writing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const updated = answer.substring(0, start) + "    " + answer.substring(end);
      setAnswer(currentQuestion.id, updated);

      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-accent/10 p-2.5 text-accent">
            {isPseudocode ? <Code2 size={20} /> : <FileText size={20} />}
          </div>

          <div>
            <h2 className="text-xl font-bold text-heading">
              {isPseudocode ? "Your Pseudocode Solution" : "Your Answer"}
            </h2>

            <p className="text-sm text-body-muted">
              {isMCQ
                ? "Choose the correct option."
                : isPseudocode
                ? "Write step-by-step logic, loop invariants & complexity analysis."
                : "Write your answer clearly and completely."}
            </p>
          </div>
        </div>

        {isPseudocode && !isMCQ && (
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <Terminal size={13} />
            Tab indent supported
          </span>
        )}
      </div>

      {isMCQ ? (
        <div className="mt-6 space-y-3">
          {currentQuestion.options?.map((option, idx) => {
            const selected = answer === option;
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            return (
              <button
                key={option}
                type="button"
                onClick={() => setAnswer(currentQuestion.id, option)}
                className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                  selected
                    ? "border-accent bg-accent/10 ring-1 ring-accent text-heading shadow-xs"
                    : "border-border bg-base hover:border-accent/50 hover:bg-soft/20 dark:hover:bg-soft/10 text-heading"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition ${
                    selected
                      ? "bg-accent text-on-accent shadow-xs"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  {letter}
                </div>

                <div className="flex-1 text-xs sm:text-sm font-medium text-heading leading-relaxed">
                  {option}
                </div>

                {selected ? (
                  <CheckCircle2 size={20} className="shrink-0 text-accent" />
                ) : (
                  <Circle size={20} className="shrink-0 text-body-muted/50" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isPseudocode
                ? `// Write your structured pseudocode here...\n// Example:\n// FUNCTION solve(array, target):\n//     SET left = 0, right = LENGTH(array) - 1\n//     WHILE left <= right:\n//         ...\n//     RETURN result\n//\n// Time Complexity: O(...)\n// Space Complexity: O(...)`
                : "Start typing your answer here..."
            }
            className={`mt-6 h-80 w-full resize-none rounded-2xl border border-border bg-base p-5 text-heading placeholder:text-body-muted/70 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent ${
              isPseudocode ? "font-mono text-xs sm:text-sm leading-relaxed" : "text-sm leading-relaxed"
            }`}
            spellCheck={!isPseudocode}
          />

          <div className="mt-4 flex items-center justify-between text-xs sm:text-sm text-body-muted">
            <span>Answer is automatically saved.</span>
            <span>{answer.length} Characters</span>
          </div>
        </>
      )}
    </section>
  );
}