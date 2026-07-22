import { ReactNode } from "react";
import { InterviewProvider } from "@/context/InterviewContext";

export default function InterviewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <InterviewProvider>
      {children}
    </InterviewProvider>
  );
}