"use client";

import { useEffect, useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShieldCheck,
  Bell,
  Palette,
  AlertTriangle,
  Save,
  Check,
  Loader2,
  Lock,
  Mail,
  GraduationCap,
  Building2,
  Briefcase,
  Code2,
  Globe,
  Link2,
  Sun,
  Moon,
  Laptop,
  Trash2,
  Sparkles,
  Info,
  X,
  ExternalLink,
} from "lucide-react";
import { UserProfileSettings } from "@/lib/settings/types";

type SettingsTab = "profile" | "security" | "notifications" | "appearance" | "danger";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [settings, setSettings] = useState<UserProfileSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  // 1. Profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [graduationYear, setGraduationYear] = useState<number | "">(2026);
  const [batch, setBatch] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // 2. Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // 3. Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dsaReminders, setDsaReminders] = useState(true);
  const [interviewAlerts, setInterviewAlerts] = useState(true);
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifFeedback, setNotifFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // 4. Appearance
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "system">("light");
  const [themeSaving, setThemeSaving] = useState(false);
  const [themeFeedback, setThemeFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // 5. Danger Zone
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            const s: UserProfileSettings = data.settings;
            setSettings(s);
            setName(s.name || "");
            setEmail(s.email || "");
            setBio(s.bio || "");
            setCollege(s.college || "");
            setBranch(s.branch || "");
            setGraduationYear(s.graduationYear || 2026);
            setBatch(s.batch || "");
            setTargetRole(s.targetRole || "");
            setTargetCompany(s.targetCompany || "");
            setGithubUrl(s.githubUrl || "");
            setLinkedinUrl(s.linkedinUrl || "");
            setPortfolioUrl(s.portfolioUrl || "");
            setEmailNotifications(s.emailNotificationsEnabled ?? true);
            setDsaReminders(s.dsaReminderEnabled ?? true);
            setInterviewAlerts(s.interviewFeedbackAlerts ?? true);
            setSelectedTheme(s.themePreference || "light");
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileFeedback(null);

    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          college,
          branch,
          graduationYear: graduationYear ? Number(graduationYear) : null,
          batch,
          targetRole,
          targetCompany,
          githubUrl,
          linkedinUrl,
          portfolioUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProfileFeedback({ type: "success", msg: "Profile updated successfully!" });
      } else {
        setProfileFeedback({ type: "error", msg: data.error || "Failed to update profile." });
      }
    } catch (err: any) {
      setProfileFeedback({ type: "error", msg: err?.message || "An unexpected error occurred." });
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileFeedback(null), 4000);
    }
  };

  // Change Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordFeedback(null);

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: "error", msg: "New passwords do not match." });
      setPasswordSaving(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordFeedback({ type: "error", msg: "New password must be at least 6 characters." });
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordFeedback({ type: "success", msg: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordFeedback({ type: "error", msg: data.error || "Failed to change password." });
      }
    } catch (err: any) {
      setPasswordFeedback({ type: "error", msg: err?.message || "An unexpected error occurred." });
    } finally {
      setPasswordSaving(false);
      setTimeout(() => setPasswordFeedback(null), 4000);
    }
  };

  // Save Notifications
  const handleSaveNotifications = async () => {
    setNotifSaving(true);
    setNotifFeedback(null);

    try {
      const res = await fetch("/api/settings/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailNotificationsEnabled: emailNotifications,
          dsaReminderEnabled: dsaReminders,
          interviewFeedbackAlerts: interviewAlerts,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotifFeedback({ type: "success", msg: "Notification preferences saved!" });
      } else {
        setNotifFeedback({ type: "error", msg: data.error || "Failed to save preferences." });
      }
    } catch (err: any) {
      setNotifFeedback({ type: "error", msg: err?.message || "An unexpected error occurred." });
    } finally {
      setNotifSaving(false);
      setTimeout(() => setNotifFeedback(null), 4000);
    }
  };

  // Change and Save Theme
  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
    setThemeSaving(true);
    setThemeFeedback(null);

    try {
      const res = await fetch("/api/settings/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themePreference: newTheme,
        }),
      });

      if (res.ok) {
        setThemeFeedback({ type: "success", msg: `Theme updated to ${newTheme}!` });
      }
    } catch (err) {
      console.error("Failed to persist theme preference:", err);
    } finally {
      setThemeSaving(false);
      setTimeout(() => setThemeFeedback(null), 3000);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/settings/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmationText: deleteConfirmInput,
          userEmail: email,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = "/auth/login?deleted=true";
      } else {
        setDeleteError(data.error || "Failed to delete account.");
      }
    } catch (err: any) {
      setDeleteError(err?.message || "An unexpected error occurred.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const navTabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles size={13} className="text-accent" />
          <span>Account & Preferences</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Manage your personal profile, security credentials, diagnostic notifications, and appearance.
        </p>
      </div>

      {/* Main Settings Container */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="grid min-h-[640px] lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* ========================================================= */}
          {/* LEFT / TOP NAVIGATION TABS */}
          {/* ========================================================= */}
          <aside className="border-b lg:border-b-0 lg:border-r border-border bg-elevated p-4">
            <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                const isDanger = tab.id === "danger";

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer text-left ${
                      active
                        ? isDanger
                          ? "bg-error/15 text-error border border-error/30 shadow-sm"
                          : "bg-soft text-primary border border-border shadow-sm"
                        : isDanger
                        ? "text-error/80 hover:bg-error/10 hover:text-error"
                        : "text-muted hover:bg-base hover:text-primary"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        active
                          ? isDanger
                            ? "text-error"
                            : "text-accent"
                          : isDanger
                          ? "text-error/70"
                          : "text-muted"
                      }
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ========================================================= */}
          {/* RIGHT CONTENT AREA */}
          {/* ========================================================= */}
          <main className="p-6 sm:p-8 bg-surface">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted">
                <Loader2 size={28} className="animate-spin text-accent" />
                <p className="mt-3 text-xs sm:text-sm">Loading account settings...</p>
              </div>
            ) : (
              <div>
                {/* 1. PROFILE TAB */}
                {activeTab === "profile" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 max-w-2xl"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-primary">Student Profile</h2>
                      <p className="text-xs sm:text-sm text-muted">
                        This information powers your placement readiness diagnostic and ATS analysis matching.
                      </p>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      {/* Avatar & Email preview */}
                      <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-elevated">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-on-accent font-bold text-xl shadow-sm">
                          {name ? name.slice(0, 2).toUpperCase() : "ST"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">{name || "Student"}</p>
                          <p className="text-xs text-muted">{email}</p>
                          <span className="inline-block mt-1 rounded-full bg-soft border border-border px-2 py-0.5 text-[10px] font-bold text-primary">
                            🎓 Student Account
                          </span>
                        </div>
                      </div>

                      {/* Name & Email fields */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded-xl border border-border bg-base px-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                            Email Address <span className="text-muted text-[10px] normal-case">(Managed by Auth)</span>
                          </label>
                          <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full rounded-xl border border-border bg-base/50 px-3.5 py-2.5 text-xs sm:text-sm text-muted cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                          Personal Bio & Career Summary
                        </label>
                        <textarea
                          rows={3}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Brief introduction of your technical interests and career goals..."
                          className="w-full rounded-xl border border-border bg-base p-3.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent resize-none placeholder:text-muted"
                        />
                      </div>

                      {/* College & Branch */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                            College / University
                          </label>
                          <input
                            type="text"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            placeholder="e.g. Institute of Technology"
                            className="w-full rounded-xl border border-border bg-base px-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent placeholder:text-muted"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                            Branch / Department
                          </label>
                          <input
                            type="text"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            placeholder="e.g. Computer Science & Engineering"
                            className="w-full rounded-xl border border-border bg-base px-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent placeholder:text-muted"
                          />
                        </div>
                      </div>

                      {/* Graduation Year & Batch */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                            Graduation Year
                          </label>
                          <input
                            type="number"
                            value={graduationYear}
                            onChange={(e) =>
                              setGraduationYear(e.target.value ? Number(e.target.value) : "")
                            }
                            placeholder="2026"
                            className="w-full rounded-xl border border-border bg-base px-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent placeholder:text-muted"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                            Batch / Section
                          </label>
                          <input
                            type="text"
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            placeholder="e.g. Batch 2026"
                            className="w-full rounded-xl border border-border bg-base px-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent placeholder:text-muted"
                          />
                        </div>
                      </div>

                      {/* Target Role & Target Company */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                            Target Role
                          </label>
                          <input
                            type="text"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="e.g. Software Development Engineer"
                            className="w-full rounded-xl border border-border bg-base px-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent placeholder:text-muted"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                            Target Company
                          </label>
                          <input
                            type="text"
                            value={targetCompany}
                            onChange={(e) => setTargetCompany(e.target.value)}
                            placeholder="e.g. Google, Amazon, Microsoft"
                            className="w-full rounded-xl border border-border bg-base px-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent placeholder:text-muted"
                          />
                        </div>
                      </div>

                      {/* Links: GitHub & LinkedIn */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                            GitHub Profile
                          </label>
                          <div className="relative">
                            <Code2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                              type="url"
                              value={githubUrl}
                              onChange={(e) => setGithubUrl(e.target.value)}
                              placeholder="https://github.com/username"
                              className="w-full rounded-xl border border-border bg-base pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent placeholder:text-muted"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                            LinkedIn Profile
                          </label>
                          <div className="relative">
                            <Link2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                              type="url"
                              value={linkedinUrl}
                              onChange={(e) => setLinkedinUrl(e.target.value)}
                              placeholder="https://linkedin.com/in/username"
                              className="w-full rounded-xl border border-border bg-base pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent placeholder:text-muted"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Feedback message */}
                      {profileFeedback && (
                        <div
                          className={`rounded-xl p-3 text-xs font-medium ${
                            profileFeedback.type === "success"
                              ? "bg-success/15 border border-success/30 text-success"
                              : "bg-error/15 border border-error/30 text-error"
                          }`}
                        >
                          {profileFeedback.msg}
                        </div>
                      )}

                      {/* Save Button */}
                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="inline-flex items-center gap-2 rounded-2xl bg-accent hover:bg-accent-hover px-6 py-2.5 text-xs sm:text-sm font-semibold text-on-accent shadow-sm transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60"
                      >
                        {profileSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>Save Profile Changes</span>
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 2. SECURITY TAB */}
                {activeTab === "security" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 max-w-2xl"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-primary">Security & Credentials</h2>
                      <p className="text-xs sm:text-sm text-muted">
                        Manage your password and review your active authentication provider.
                      </p>
                    </div>

                    {/* Auth Provider Badge */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-elevated">
                      <div className="rounded-xl border border-border bg-soft p-2.5 text-accent">
                        <Lock size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-primary">
                          Credentials Authentication
                        </p>
                        <p className="text-xs text-muted">
                          Protected with bcrypt hashing and Auth.js JWT session verification.
                        </p>
                      </div>
                    </div>

                    {/* Change Password Form */}
                    <form onSubmit={handleSavePassword} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-border bg-base px-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="At least 6 characters"
                            className="w-full rounded-xl border border-border bg-base px-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Re-type new password"
                            className="w-full rounded-xl border border-border bg-base px-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent"
                          />
                        </div>
                      </div>

                      {/* Password Feedback */}
                      {passwordFeedback && (
                        <div
                          className={`rounded-xl p-3 text-xs font-medium ${
                            passwordFeedback.type === "success"
                              ? "bg-success/15 border border-success/30 text-success"
                              : "bg-error/15 border border-error/30 text-error"
                          }`}
                        >
                          {passwordFeedback.msg}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={passwordSaving}
                        className="inline-flex items-center gap-2 rounded-2xl bg-accent hover:bg-accent-hover px-6 py-2.5 text-xs sm:text-sm font-semibold text-on-accent shadow-sm transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60"
                      >
                        {passwordSaving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                        <span>Update Password</span>
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 3. NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 max-w-2xl"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-primary">Notification Preferences</h2>
                      <p className="text-xs sm:text-sm text-muted">
                        Configure daily practice reminders and placement alerts.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Email Notifications Toggle */}
                      <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-elevated">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-primary">Email Placement Alerts</p>
                          <p className="text-xs text-muted">
                            Receive summaries when new recruiter requirements or drive notices match your profile.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
                        </label>
                      </div>

                      {/* DSA Daily Reminders */}
                      <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-elevated">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-primary">Daily DSA Streak Reminders</p>
                          <p className="text-xs text-muted">
                            Daily notifications to maintain your problem-solving streak and target goals.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={dsaReminders}
                            onChange={(e) => setDsaReminders(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
                        </label>
                      </div>

                      {/* Mock Interview Feedback */}
                      <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-elevated">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-primary">AI Interview Diagnostic Alerts</p>
                          <p className="text-xs text-muted">
                            Get alerted when AI completes scoring and diagnostic evaluation of your mock interviews.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={interviewAlerts}
                            onChange={(e) => setInterviewAlerts(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
                        </label>
                      </div>
                    </div>

                    {/* Notification Feedback */}
                    {notifFeedback && (
                      <div
                        className={`rounded-xl p-3 text-xs font-medium ${
                          notifFeedback.type === "success"
                            ? "bg-success/15 border border-success/30 text-success"
                            : "bg-error/15 border border-error/30 text-error"
                        }`}
                      >
                        {notifFeedback.msg}
                      </div>
                    )}

                    <button
                      onClick={handleSaveNotifications}
                      disabled={notifSaving}
                      className="inline-flex items-center gap-2 rounded-2xl bg-accent hover:bg-accent-hover px-6 py-2.5 text-xs sm:text-sm font-semibold text-on-accent shadow-sm transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60"
                    >
                      {notifSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      <span>Save Notification Preferences</span>
                    </button>
                  </motion.div>
                )}

                {/* 4. APPEARANCE TAB */}
                {activeTab === "appearance" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 max-w-2xl"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-primary">Appearance & Theme</h2>
                      <p className="text-xs sm:text-sm text-muted">
                        Customize how AI Placement Mentor looks on your device.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      {/* Light Card */}
                      <button
                        type="button"
                        onClick={() => handleThemeChange("light")}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                          selectedTheme === "light"
                            ? "border-accent bg-soft/50 ring-2 ring-accent shadow-sm"
                            : "border-border bg-elevated hover:bg-soft/20"
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 mb-3">
                          <Sun size={20} />
                        </div>
                        <p className="text-sm font-bold text-primary">Light Theme</p>
                        <p className="text-xs text-muted mt-1">Warm cream canvas with deep slate contrast.</p>
                      </button>

                      {/* Dark Card */}
                      <button
                        type="button"
                        onClick={() => handleThemeChange("dark")}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                          selectedTheme === "dark"
                            ? "border-accent bg-soft/50 ring-2 ring-accent shadow-sm"
                            : "border-border bg-elevated hover:bg-soft/20"
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-500 mb-3">
                          <Moon size={20} />
                        </div>
                        <p className="text-sm font-bold text-primary">Dark Theme</p>
                        <p className="text-xs text-muted mt-1">Sleek obsidian navy mode with soft accents.</p>
                      </button>

                      {/* System Card */}
                      <button
                        type="button"
                        onClick={() => handleThemeChange("system")}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                          selectedTheme === "system"
                            ? "border-accent bg-soft/50 ring-2 ring-accent shadow-sm"
                            : "border-border bg-elevated hover:bg-soft/20"
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 text-accent mb-3">
                          <Laptop size={20} />
                        </div>
                        <p className="text-sm font-bold text-primary">System Auto</p>
                        <p className="text-xs text-muted mt-1">Syncs automatically with your OS preference.</p>
                      </button>
                    </div>

                    {/* Theme Feedback */}
                    {themeFeedback && (
                      <div className="rounded-xl p-3 text-xs font-medium bg-success/15 border border-success/30 text-success">
                        {themeFeedback.msg}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 5. DANGER ZONE TAB */}
                {activeTab === "danger" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 max-w-2xl"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-error">Danger Zone</h2>
                      <p className="text-xs sm:text-sm text-muted">
                        Irreversible account operations and data removal.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-error/30 bg-error/5 p-5 space-y-4">
                      <div className="flex items-start gap-3.5">
                        <div className="rounded-xl border border-error/30 bg-error/10 p-2 text-error shrink-0 mt-0.5">
                          <AlertTriangle size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-primary">Delete Student Account</h3>
                          <p className="text-xs text-muted leading-relaxed mt-1">
                            Permanently removes your student profile, ATS resume scores, diagnostic placement
                            analytics, and all AI mock interview records. This action cannot be
                            reversed.
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-error/20 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowDeleteModal(true)}
                          className="inline-flex items-center gap-2 rounded-xl bg-error hover:bg-error/90 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:scale-105 cursor-pointer"
                        >
                          <Trash2 size={15} />
                          <span>Delete My Account</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-error/30 bg-surface p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-error">
                  <AlertTriangle size={20} />
                  <h3 className="text-lg font-bold">Confirm Account Deletion</h3>
                </div>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmInput("");
                    setDeleteError("");
                  }}
                  className="rounded-lg p-1 text-muted hover:text-primary"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Please type <strong className="text-error font-mono font-bold">DELETE</strong> or your email address (
                <span className="font-mono text-primary font-semibold">{email}</span>) to permanently confirm account
                deletion.
              </p>

              <input
                type="text"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full rounded-xl border border-border bg-base px-3.5 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-error"
              />

              {deleteError && (
                <p className="text-xs font-semibold text-error bg-error/10 p-2.5 rounded-lg border border-error/20">
                  {deleteError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmInput("");
                    setDeleteError("");
                  }}
                  className="rounded-xl border border-border bg-base px-4 py-2 text-xs font-semibold text-primary hover:bg-soft transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={
                    deleteLoading ||
                    (deleteConfirmInput !== "DELETE" && deleteConfirmInput !== email)
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-error hover:bg-error/90 px-4 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {deleteLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  <span>Confirm Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
