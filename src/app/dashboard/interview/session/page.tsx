import InterviewSession from "@/components/interview/session/InterviewSession";
import { InterviewProvider } from "@/context/InterviewContext";

export default function InterviewSessionPage() {
  return (
    <InterviewProvider>
      <InterviewSession />
    </InterviewProvider>
  );
}