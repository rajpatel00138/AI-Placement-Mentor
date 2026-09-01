"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  User,
  Building2,
  Bell,
  Sliders,
  ShieldCheck,
  Save,
  CheckCircle2,
  Briefcase,
  Mail,
  Lock,
  Globe,
  Sun,
  Moon,
  Laptop,
  Sparkles,
} from "lucide-react";

type SettingsTab = "profile" | "alerts" | "discovery" | "security";

export default function RecruiterSettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile Form States
  const [name, setName] = useState("Talent Partner");
  const [email, setEmail] = useState("recruiter@placementmentor.com");
  const [company, setCompany] = useState("Google");
  const [designation, setDesignation] = useState("Lead Technical Recruiter");
  const [targetRoles, setTargetRoles] = useState("Full Stack Engineer, SDE-1, AI Engineer");
  const [location, setLocation] = useState("Bangalore, India");
  const [companyWebsite, setCompanyWebsite] = useState("https://careers.google.com");
  const [bio, setBio] = useState(
    "Recruiting top graduate engineering talent across DSA, full-stack systems, and AI/ML specializations."
  );

  // Notification States
  const [alertCandidateReady, setAlertCandidateReady] = useState(true);
  const [alertWeeklyDigest, setAlertWeeklyDigest] = useState(true);
  const [alertInterviewUpdates, setAlertInterviewUpdates] = useState(true);
  const [alertDriveNotices, setAlertDriveNotices] = useState(false);

  // Discovery Defaults
  const [minReadiness, setMinReadiness] = useState(75);
  const [defaultSort, setDefaultSort] = useState("readinessScore");
  const [preferredBatch, setPreferredBatch] = useState("all");

  // Feedback State
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load local storage preferences if exist
    const savedRecruiterSettings = localStorage.getItem("recruiter_portal_settings");
    if (savedRecruiterSettings) {
      try {
        const parsed = JSON.parse(savedRecruiterSettings);
        if (parsed.name) setName(parsed.name);
        if (parsed.company) setCompany(parsed.company);
        if (parsed.designation) setDesignation(parsed.designation);
        if (parsed.targetRoles) setTargetRoles(parsed.targetRoles);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.bio) setBio(parsed.bio);
        if (parsed.minReadiness) setMinReadiness(parsed.minReadiness);
      } catch (e) {
        console.warn("Failed to load recruiter settings from localStorage:", e);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const settingsObj = {
      name,
      email,
      company,
      designation,
      targetRoles,
      location,
      bio,
      alertCandidateReady,
      alertWeeklyDigest,
      alertInterviewUpdates,
      alertDriveNotices,
      minReadiness,
      defaultSort,
      preferredBatch,
    };
    localStorage.setItem("recruiter_portal_settings", JSON.stringify(settingsObj));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      {/* 1. Header Banner */}
      <div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-0.5 text-xs font-bold text-accent uppercase tracking-wider">
            <Briefcase size={13} />
            <span>Corporate Account Controls</span>
          </span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          Recruiter Portal Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Configure your corporate recruiter identity, candidate discovery filters, and talent alert triggers.
        </p>
      </div>

      {/* 2. Settings Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
            activeTab === "profile"
              ? "bg-accent text-on-accent shadow-xs"
              : "bg-surface text-muted hover:bg-elevated hover:text-primary border border-border"
          }`}
        >
          <Building2 size={16} />
          <span>Recruiter Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("alerts")}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
            activeTab === "alerts"
              ? "bg-accent text-on-accent shadow-xs"
              : "bg-surface text-muted hover:bg-elevated hover:text-primary border border-border"
          }`}
        >
          <Bell size={16} />
          <span>Talent Alerts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("discovery")}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
            activeTab === "discovery"
              ? "bg-accent text-on-accent shadow-xs"
              : "bg-surface text-muted hover:bg-elevated hover:text-primary border border-border"
          }`}
        >
          <Sliders size={16} />
          <span>Discovery Defaults</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
            activeTab === "security"
              ? "bg-accent text-on-accent shadow-xs"
              : "bg-surface text-muted hover:bg-elevated hover:text-primary border border-border"
          }`}
        >
          <ShieldCheck size={16} />
          <span>Security & Portal Theme</span>
        </button>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-2xl border border-success/30 bg-success/10 p-4 text-xs sm:text-sm font-semibold text-success shadow-xs">
          <CheckCircle2 size={18} />
          <span>Settings saved and applied successfully.</span>
        </div>
      )}

      {/* 3. Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Profile */}
        {activeTab === "profile" && (
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-base font-bold text-primary">Corporate Recruiter Identity</h2>
              <p className="text-xs text-muted">Details shown on talent inquiry notes and placement evaluations</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Recruiter Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-elevated px-4 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Work Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-2xl border border-border bg-soft px-4 py-2.5 text-sm text-muted cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Microsoft"
                  className="w-full rounded-2xl border border-border bg-elevated px-4 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Title / Designation
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Talent Acquisition Lead"
                  className="w-full rounded-2xl border border-border bg-elevated px-4 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Target Roles Hiring For
                </label>
                <input
                  type="text"
                  value={targetRoles}
                  onChange={(e) => setTargetRoles(e.target.value)}
                  placeholder="e.g. Full Stack Engineer, SDE-1"
                  className="w-full rounded-2xl border border-border bg-elevated px-4 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bangalore, India"
                  className="w-full rounded-2xl border border-border bg-elevated px-4 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Company Careers / LinkedIn URL
                </label>
                <input
                  type="url"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="https://careers.company.com"
                  className="w-full rounded-2xl border border-border bg-elevated px-4 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Hiring Philosophy / Recruiter Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-elevated p-3.5 text-sm text-primary outline-none transition focus:border-accent resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Alerts */}
        {activeTab === "alerts" && (
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-base font-bold text-primary">Talent Notification Triggers</h2>
              <p className="text-xs text-muted">Receive alerts when students reach placement readiness or submit mock rounds</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-base">
                <div>
                  <p className="text-sm font-bold text-primary">High-Readiness Candidate Alerts</p>
                  <p className="text-xs text-muted">Notify immediately when a candidate scores ≥85% on readiness benchmarks</p>
                </div>
                <input
                  type="checkbox"
                  checked={alertCandidateReady}
                  onChange={(e) => setAlertCandidateReady(e.target.checked)}
                  className="h-5 w-5 rounded-lg border-border text-accent focus:ring-accent cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-base">
                <div>
                  <p className="text-sm font-bold text-primary">Weekly Campus Digest</p>
                  <p className="text-xs text-muted">Receive a weekly summary email of top emerging performers across partner colleges</p>
                </div>
                <input
                  type="checkbox"
                  checked={alertWeeklyDigest}
                  onChange={(e) => setAlertWeeklyDigest(e.target.checked)}
                  className="h-5 w-5 rounded-lg border-border text-accent focus:ring-accent cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-base">
                <div>
                  <p className="text-sm font-bold text-primary">Mock Interview & Diagnostic Reports</p>
                  <p className="text-xs text-muted">Alerts when shortlisted candidates complete comprehensive technical mock sessions</p>
                </div>
                <input
                  type="checkbox"
                  checked={alertInterviewUpdates}
                  onChange={(e) => setAlertInterviewUpdates(e.target.checked)}
                  className="h-5 w-5 rounded-lg border-border text-accent focus:ring-accent cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Discovery Defaults */}
        {activeTab === "discovery" && (
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-base font-bold text-primary">Candidate Discovery Defaults</h2>
              <p className="text-xs text-muted">Set your preferred baseline filters for the recruiter candidate search view</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Default Minimum Readiness Threshold ({minReadiness}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={95}
                  step={5}
                  value={minReadiness}
                  onChange={(e) => setMinReadiness(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted mt-1">
                  <span>0% (All Candidates)</span>
                  <span>50% (Developing)</span>
                  <span>75% (Target)</span>
                  <span>90% (Top Tier Only)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Default Sort Attribute
                  </label>
                  <select
                    value={defaultSort}
                    onChange={(e) => setDefaultSort(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-elevated px-4 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
                  >
                    <option value="readinessScore">Overall Readiness Score</option>
                    <option value="placementProbability">Placement Probability</option>
                    <option value="dsaScore">DSA Score</option>
                    <option value="interviewScore">Mock Interview Score</option>
                    <option value="resumeScore">ATS Resume Score</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Default Target Cohort
                  </label>
                  <select
                    value={preferredBatch}
                    onChange={(e) => setPreferredBatch(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-elevated px-4 py-2.5 text-sm text-primary outline-none transition focus:border-accent"
                  >
                    <option value="all">All Graduating Batches</option>
                    <option value="2025-A">2025-A Immediate Joiners</option>
                    <option value="2025-B">2025-B Next Cohort</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security & Theme */}
        {activeTab === "security" && (
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-base font-bold text-primary">Portal Appearance & Security</h2>
              <p className="text-xs text-muted">Manage theme mode and enterprise session credentials</p>
            </div>

            {/* Theme Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                Interface Appearance
              </label>
              {mounted && (
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition ${
                      resolvedTheme === "light"
                        ? "border-accent bg-soft text-accent ring-1 ring-accent"
                        : "border-border bg-base text-muted hover:text-primary"
                    }`}
                  >
                    <Sun size={16} />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition ${
                      resolvedTheme === "dark"
                        ? "border-accent bg-soft text-accent ring-1 ring-accent"
                        : "border-border bg-base text-muted hover:text-primary"
                    }`}
                  >
                    <Moon size={16} />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition ${
                      theme === "system"
                        ? "border-accent bg-soft text-accent ring-1 ring-accent"
                        : "border-border bg-base text-muted hover:text-primary"
                    }`}
                  >
                    <Laptop size={16} />
                    <span>System</span>
                  </button>
                </div>
              )}
            </div>

            {/* Session Info */}
            <div className="rounded-2xl border border-border bg-base p-4 space-y-2">
              <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-success" />
                <span>Enterprise Verified Session</span>
              </p>
              <p className="text-xs text-muted">
                Authenticated as <strong className="text-primary">{email}</strong> with role <strong className="text-accent uppercase">recruiter</strong>. Full access granted across partner institutions.
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-xs sm:text-sm font-semibold text-on-accent transition hover:bg-accent-hover shadow-xs active:scale-[0.99]"
          >
            <Save size={16} />
            <span>Save Recruiter Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
