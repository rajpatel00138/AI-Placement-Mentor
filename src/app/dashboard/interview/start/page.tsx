import InterviewSetup from "@/components/interview/setup/InterviewSetup";
import type { InterviewType } from "@/lib/ai/types";

const interviewTypes: InterviewType[] = [
  "hr",
  "technical",
  "dsa",
  "dbms",
  "os",
  "cn",
  "system-design",
  "aptitude",
  "pseudocode",
  "pseudo-code",
];

export default async function StartInterviewPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const initialInterviewType = interviewTypes.find(
    (interviewType) => interviewType === type
  );

  return <InterviewSetup initialInterviewType={initialInterviewType} />;
}

