import InterviewSetup from "@/components/interview/setup/InterviewSetup";
import { InterviewProvider } from "@/context/InterviewContext";

export default function StartInterviewPage() {
  return (
    <InterviewProvider>
      <InterviewSetup />
    </InterviewProvider>
  );
}