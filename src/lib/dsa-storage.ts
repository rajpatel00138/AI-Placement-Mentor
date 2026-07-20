import { ProgressMap } from "@/types/dsa";

const KEY = "dsa-progress";

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressMap) {
  if (typeof window === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(progress));
}