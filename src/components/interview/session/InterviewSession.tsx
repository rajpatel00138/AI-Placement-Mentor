"use client";

import SessionHeader from "./SessionHeader";
import ProgressSidebar from "./ProgressSidebar";
import QuestionCard from "./QuestionCard";
import AnswerEditor from "./AnswerEditor";
import HintButton from "./HintButton";

export default function InterviewSession() {
  return (
    <div className="space-y-8">
      <SessionHeader />

      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <QuestionCard />
          <HintButton />
          <AnswerEditor />
        </div>

        <ProgressSidebar />
      </div>
    </div>
  );
}