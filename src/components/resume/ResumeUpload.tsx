"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  ShieldCheck,
  FileSearch,
} from "lucide-react";
import { motion } from "framer-motion";
import ResumeAnalysis from "./ResumeAnalysis";

export default function ResumeUpload() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const MAX_SIZE = 4.5 * 1024 * 1024;

  const handleFile = (selectedFile: File) => {
    setError("");
    setAnalysis(null);

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (
      !validTypes.includes(selectedFile.type) &&
      !selectedFile.name.endsWith(".pdf") &&
      !selectedFile.name.endsWith(".docx") &&
      !selectedFile.name.endsWith(".txt")
    ) {
      setError("Only PDF, DOCX, and TXT files are allowed.");
      return;
    }

    if (selectedFile.size > MAX_SIZE) {
      setError("File size exceeds the 4.5 MB limit. Please upload a smaller resume file.");
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setAnalysis(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const syncResumeRecord = async (fileName: string, atsScore: number, summary: string, skills: string[], skillGaps: string[]) => {
    try {
      await fetch("/api/user/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          atsScore,
          summary,
          skills,
          skillGaps,
        }),
      });

      // Dispatch reactive update event to refresh Dashboard metrics without page reload
      window.dispatchEvent(new Event("activityUpdated"));
    } catch (e) {
      console.warn("Failed to sync resume record with backend:", e);
    }
  };

  const analyzeResume = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.analysis) {
        throw new Error(data.error || "Failed to analyze resume. Please try another file.");
      }

      setAnalysis(data.analysis);

      // Dispatch reactive update event to refresh Dashboard metrics across views
      window.dispatchEvent(new Event("activityUpdated"));
    } catch (err: any) {
      console.error("Resume analysis client error:", err);
      setError(err.message || "Failed to analyze resume. Please verify file format and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-sm"
    >
      {/* Subtle Ambient Background Glows */}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-accent-secondary/5 blur-3xl" />

      <div className="relative p-8 sm:p-10">
        {!file ? (
          <div className="text-center">
            {/* Upload Icon Badge */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-accent/30 bg-accent/15 text-accent shadow-sm">
              <UploadCloud className="h-10 w-10 text-accent" />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles size={14} className="text-accent" />
              <span>AI Powered Resume Scanner</span>
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-primary">
              Upload Your Resume
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-7 text-muted">
              Get ATS Score, Placement Readiness, Missing Skills,
              AI Suggestions and Personalized Career Roadmap in
              just a few seconds.
            </p>

            {/* Sub-cards */}
            <div className="mt-10 grid gap-5 md:grid-cols-3 text-left">
              <div className="rounded-2xl border border-border bg-elevated p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-soft text-accent">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-primary">
                  ATS Optimized
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Analyze your resume against modern ATS recruitment algorithms.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-elevated p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-soft text-accent">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-primary">
                  AI Suggestions
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Personalized improvements and action verbs generated by AI.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-elevated p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-soft text-accent">
                  <FileSearch className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-primary">
                  Skill Gap Report
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  Find missing technical and behavioral skills required for placements.
                </p>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <button
              onClick={() => inputRef.current?.click()}
              className="mt-10 rounded-2xl bg-accent hover:bg-accent-hover px-10 py-4 text-base sm:text-lg font-semibold text-on-accent shadow-sm transition duration-300 hover:scale-105"
            >
              Choose Resume
            </button>

            <p className="mt-4 text-xs sm:text-sm text-muted">
              Supported formats: PDF, DOCX • Maximum Size: 5 MB
            </p>

            {error && (
              <div className="mt-6 rounded-2xl border border-error/30 bg-error/10 p-4 text-sm font-medium text-error">
                {error}
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-border bg-elevated p-6 sm:p-8 shadow-sm backdrop-blur-xl"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-border bg-soft p-3.5 text-accent">
                  <FileText className="h-8 w-8 text-accent" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-primary">
                    {file.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                onClick={removeFile}
                className="rounded-xl border border-error/30 bg-error/10 p-3 text-error transition hover:bg-error/20"
                title="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={analyzeResume}
              disabled={loading}
              className="mt-8 w-full rounded-2xl bg-accent hover:bg-accent-hover py-4 text-lg font-bold text-on-accent shadow-sm transition duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>AI is analyzing your resume...</span>
                </div>
              ) : (
                "Analyze Resume"
              )}
            </button>

            {error && (
              <div className="mt-6 rounded-2xl border border-error/30 bg-error/10 p-4 text-center text-sm font-medium text-error">
                {error}
              </div>
            )}

            {analysis && (
              <ResumeAnalysis analysis={analysis} />
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}