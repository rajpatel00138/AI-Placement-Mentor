"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  fallbackClassName?: string;
  defaultInitials?: string;
  priority?: boolean;
}

export function getInitials(name?: string | null, fallback = "U"): string {
  if (!name || !name.trim()) return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UserAvatar({
  src,
  name,
  alt,
  size = 40,
  className = "h-full w-full object-cover",
  fallbackClassName = "font-bold text-accent",
  defaultInitials = "U",
  priority = false,
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state if the src URL changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = getInitials(name, defaultInitials);

  if (!src || hasError) {
    return <span className={fallbackClassName}>{initials}</span>;
  }

  return (
    <Image
      src={src}
      alt={alt || name || "User avatar"}
      width={size}
      height={size}
      className={className}
      onError={() => setHasError(true)}
      priority={priority}
    />
  );
}
