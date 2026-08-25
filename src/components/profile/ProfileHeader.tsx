import Image from "next/image";
import Link from "next/link";
import { Edit3, Sparkles } from "lucide-react";

type ProfileHeaderProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "ST";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
      {/* Ambient background glows */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-accent-secondary/5 blur-3xl" />

      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:justify-between text-center sm:text-left">
        {/* Left Avatar & User Info */}
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent/30 bg-accent/15 text-accent shadow-sm">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl sm:text-3xl font-extrabold text-accent">
                {initials}
              </span>
            )}
          </div>

          {/* User Info */}
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-soft px-3 py-0.5 text-xs font-semibold text-primary mb-1.5">
              <Sparkles size={12} className="text-accent" />
              <span>Student Account</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
              {user?.name ?? "Student"}
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-muted">
              {user?.email ?? ""}
            </p>

            <p className="mt-2 text-xs text-muted">
              Welcome back to AI Placement Mentor 🚀
            </p>
          </div>
        </div>

        {/* Edit Profile Action */}
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-base hover:bg-soft px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <Edit3 size={15} className="text-accent" />
          <span>Edit Profile</span>
        </Link>
      </div>
    </div>
  );
}