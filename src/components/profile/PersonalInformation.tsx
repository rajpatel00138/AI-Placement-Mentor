"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Building2, GraduationCap, Briefcase, Mail, Edit3 } from "lucide-react";
import { UserProfileSettings } from "@/lib/settings/types";

type PersonalInformationProps = {
  user?: {
    name?: string | null;
    email?: string | null;
  };
};

export default function PersonalInformation({
  user,
}: PersonalInformationProps) {
  const [profileData, setProfileData] = useState<UserProfileSettings | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const json = await res.json();
          if (json.settings) {
            setProfileData(json.settings);
          }
        }
      } catch (err) {
        console.warn("Failed to load profile settings:", err);
      }
    }
    loadData();
  }, []);

  const fullName = profileData?.name || user?.name || "Student";
  const userEmail = profileData?.email || user?.email || "";
  const college = profileData?.college || "Not specified yet";
  const branch = profileData?.branch || "Computer Science";
  const graduationYear = profileData?.graduationYear || new Date().getFullYear();
  const targetRole = profileData?.targetRole || "Software Engineer";

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-bold text-primary">
            Personal Information
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Your verified student academic details and placement targets.
          </p>
        </div>

        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-base px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-soft transition"
        >
          <Edit3 size={13} className="text-accent" />
          <span>Edit in Settings</span>
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Full Name
          </label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={fullName}
              readOnly
              className="w-full rounded-xl border border-border bg-elevated pl-9 pr-4 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent shadow-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={userEmail}
              readOnly
              className="w-full rounded-xl border border-border bg-elevated pl-9 pr-4 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent shadow-sm"
            />
          </div>
        </div>

        {/* College */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            College / University
          </label>
          <div className="relative">
            <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={college}
              readOnly
              className="w-full rounded-xl border border-border bg-elevated pl-9 pr-4 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent shadow-sm"
            />
          </div>
        </div>

        {/* Branch */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Branch / Stream
          </label>
          <div className="relative">
            <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={branch}
              readOnly
              className="w-full rounded-xl border border-border bg-elevated pl-9 pr-4 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent shadow-sm"
            />
          </div>
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Graduation Year
          </label>
          <input
            value={graduationYear}
            readOnly
            className="w-full rounded-xl border border-border bg-elevated px-4 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent shadow-sm"
          />
        </div>

        {/* Target Role */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Target Placement Role
          </label>
          <div className="relative">
            <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={targetRole}
              readOnly
              className="w-full rounded-xl border border-border bg-elevated pl-9 pr-4 py-2.5 text-xs sm:text-sm text-primary outline-none transition focus:border-accent shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}