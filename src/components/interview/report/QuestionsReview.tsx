"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Code2, ChevronDown, ChevronUp, Terminal, HelpCircle } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";
import MarkdownContent from "@/components/chat/MarkdownContent";

export default function QuestionsReview() {
  const { state } = useInterview();
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({
    1: true,
  });

  const toggleExpand = (id: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isPseudocode = state.interviewType === "pseudocode" || state.interviewType === "pseudo-code";

  if (!state.questions || state.questions.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-accent/10 p-2.5 text-accent">
            {isPseudocode ? <Code2 size={22} /> : <HelpCircle size={22} />}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-heading">
              Questions & Solutions Review
            </h2>
            <p className="text-xs sm:text-sm text-body-muted">
              {isPseudocode
                ? "Review your algorithmic pseudocode, logic tracing, and problem solutions."
                : "Review your submitted answers alongside the question prompts."}
            </p>
          </div>
        </div>

        <span className="rounded-full border border-border bg-base px-3 py-1 text-xs font-semibold text-body-muted">
          {state.questions.length} Questions
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {state.questions.map((q) => {
          const isExpanded = !!expandedQuestions[q.id];
          const candidateAnswer = state.answers[q.id] || "";
          const isMCQ = q.type === "mcq";
          const isCorrect = isMCQ && q.correctAnswer && candidateAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

          return (
            <div
              key={q.id}
              className="rounded-2xl border border-border bg-base transition hover:border-border/80 overflow-hidden"
            >
              {/* Question Header Accordion Toggle */}
              <button
                type="button"
                onClick={() => toggleExpand(q.id)}
                className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition hover:bg-soft/20 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">
                    Q{q.id}
                  </span>

                  <div className="truncate">
                    <span className="text-xs font-semibold uppercase tracking-wider text-body-muted mr-2">
                      {q.difficulty} • {q.type === "mcq" ? "MCQ" : "Descriptive"}
                    </span>
                    <p className="text-sm font-semibold text-heading truncate">
                      {q.question.replace(/```[\s\S]*?```/g, "").slice(0, 80)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isMCQ && candidateAnswer && (
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      isCorrect ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30" : "bg-red-500/10 text-red-500 border border-red-500/30"
                    }`}>
                      {isCorrect ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  )}
                  {isExpanded ? <ChevronUp size={18} className="text-body-muted" /> : <ChevronDown size={18} className="text-body-muted" />}
                </div>
              </button>

              {/* Collapsible Question Detail & Candidate Solution */}
              {isExpanded && (
                <div className="border-t border-border p-4 sm:p-5 space-y-4 bg-surface/50">
                  {/* Full Question Text with Markdown & Code */}
                  <div className="rounded-xl border border-border bg-base p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent mb-2 block">
                      Problem Statement
                    </span>
                    <MarkdownContent
                      content={
                        q.codeSnippet && !q.question.includes("```")
                          ? `${q.question}\n\n\`\`\`pseudocode\n${q.codeSnippet}\n\`\`\``
                          : q.question
                      }
                    />
                  </div>

                  {/* Candidate Answer */}
                  <div className="rounded-xl border border-border bg-base p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-body-muted flex items-center gap-1.5">
                        <Terminal size={12} className="text-accent" />
                        Your Submitted {isPseudocode ? "Pseudocode / Solution" : "Answer"}
                      </span>
                      <span className="text-[11px] text-body-muted">
                        {candidateAnswer ? `${candidateAnswer.length} chars` : "Not answered"}
                      </span>
                    </div>

                    {candidateAnswer ? (
                      isPseudocode || !isMCQ ? (
                        <pre className="mt-1 overflow-x-auto rounded-lg border border-border/80 bg-[#121820] p-3.5 font-mono text-xs text-gray-100 leading-relaxed whitespace-pre-wrap selection:bg-accent/40">
                          <code>{candidateAnswer}</code>
                        </pre>
                      ) : (
                        <p className="mt-1 text-sm font-medium text-heading">
                          {candidateAnswer}
                        </p>
                      )
                    ) : (
                      <p className="text-xs italic text-body-muted">No answer provided during the session.</p>
                    )}
                  </div>

                  {/* MCQ Options & Explanation */}
                  {isMCQ && (
                    <div className="rounded-xl border border-border bg-base p-4 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-body-muted block">
                        Correct Solution & Key
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        Correct Answer: {q.correctAnswer}
                      </p>
                      {q.explanation && (
                        <p className="text-xs text-body-muted leading-relaxed">
                          <span className="font-semibold text-heading">Explanation:</span> {q.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
