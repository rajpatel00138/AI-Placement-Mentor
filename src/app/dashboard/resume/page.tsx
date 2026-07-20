import ResumeUpload from "@/components/resume/ResumeUpload";

export default function ResumePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Resume Analysis
        </h1>

        <p className="mt-2 text-slate-400">
          Upload your resume and receive AI-powered analysis and career insights.
        </p>
      </div>

      {/* Upload Section */}
      <ResumeUpload />
    </div>
  );
}