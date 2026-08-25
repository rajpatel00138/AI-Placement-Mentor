"use client";

import { dsaProblems } from "@/data/dsaProblems";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

type RevisionState = {
  r1: boolean;
  r2: boolean;
  r3: boolean;
  r4: boolean;
};

type RevisionMap = Record<string, RevisionState>;

export type ProblemStatus =
  | "not-started"
  | "in-progress"
  | "completed";

type StatusMap = Record<string, ProblemStatus>;

type FavoriteMap = Record<string, boolean>;

interface DSAContextType {
  // Revision
  revisions: RevisionMap;
  toggleRevision: (
    problemId: string,
    revision: keyof RevisionState
  ) => void;

  // Status
  status: StatusMap;
  updateStatus: (
    problemId: string,
    status: ProblemStatus
  ) => void;

  // Favorites
  favorites: FavoriteMap;
  toggleFavorite: (
    problemId: string
  ) => void;

  // Analytics
  totalProblems: number;
  solvedProblems: number;
  completedProblems: number;
  inProgressProblems: number;
  notStartedProblems: number;
  progress: number;
}

const DSAContext =
  createContext<DSAContextType | null>(null);

// Helper to find problem metadata
function findProblemMeta(problemId: string) {
  for (const cat of dsaProblems) {
    for (const grp of cat.groups) {
      for (const p of grp.problems) {
        if (p.id === problemId) {
          return {
            title: p.name,
            difficulty: p.difficulty,
            category: cat.name,
          };
        }
      }
    }
  }
  return {
    title: problemId,
    difficulty: "Medium",
    category: "General",
  };
}

export function DSAProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [revisions, setRevisions] = useState<RevisionMap>({});
  const [status, setStatus] = useState<StatusMap>({});
  const [favorites, setFavorites] = useState<FavoriteMap>({});

  // 1. Load Solves from Backend (Single Source of Truth)
  useEffect(() => {
    async function loadBackendSolves() {
      try {
        const res = await fetch("/api/user/dsa");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.solves)) {
            const initialStatus: StatusMap = {};
            json.solves.forEach((id: string) => {
              initialStatus[id] = "completed";
            });
            setStatus((prev) => ({ ...prev, ...initialStatus }));
          }
        }
      } catch (err) {
        console.warn("Failed to load backend DSA solves:", err);
      }
    }

    loadBackendSolves();
  }, []);

  // 2. Update Status & Sync to Backend + Reactive Event
  const updateStatus = useCallback((
    problemId: string,
    newStatus: ProblemStatus
  ) => {
    setStatus((prev) => ({
      ...prev,
      [problemId]: newStatus,
    }));

    const meta = findProblemMeta(problemId);
    const isSolved = newStatus === "completed";

    fetch("/api/user/dsa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problemId,
        difficulty: meta.difficulty,
        category: meta.category,
        problemTitle: meta.title,
        isSolved,
      }),
    })
      .then((res) => {
        if (res.ok) {
          // Dispatch reactive update event to refresh Dashboard metrics without page reload
          window.dispatchEvent(new Event("activityUpdated"));
        }
      })
      .catch((err) => {
        console.warn("Failed to sync DSA solve with backend:", err);
      });
  }, []);

  // Toggle Revision
  const toggleRevision = (
    problemId: string,
    revision: keyof RevisionState
  ) => {
    setRevisions((prev) => {
      const current =
        prev[problemId] ?? {
          r1: false,
          r2: false,
          r3: false,
          r4: false,
        };

      return {
        ...prev,
        [problemId]: {
          ...current,
          [revision]: !current[revision],
        },
      };
    });
  };

  // Toggle Favorite
  const toggleFavorite = (
    problemId: string
  ) => {
    setFavorites((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  };

  // Total Problems
  const totalProblems = dsaProblems.reduce(
    (total, category) =>
      total +
      category.groups.reduce(
        (groupTotal, group) =>
          groupTotal + group.problems.length,
        0
      ),
    0
  );

  // Analytics
  const completedProblems = Object.values(
    status
  ).filter(
    (value) => value === "completed"
  ).length;

  const inProgressProblems = Object.values(
    status
  ).filter(
    (value) => value === "in-progress"
  ).length;

  const notStartedProblems =
    totalProblems -
    completedProblems -
    inProgressProblems;

  // Solved = Completed
  const solvedProblems = completedProblems;

  // Progress
  const progress =
    totalProblems === 0
      ? 0
      : Math.round(
          (completedProblems /
            totalProblems) *
            100
        );

  return (
    <DSAContext.Provider
      value={{
        revisions,
        toggleRevision,

        status,
        updateStatus,

        favorites,
        toggleFavorite,

        totalProblems,
        solvedProblems,
        completedProblems,
        inProgressProblems,
        notStartedProblems,
        progress,
      }}
    >
      {children}
    </DSAContext.Provider>
  );
}

export function useDSAContext() {
  const context = useContext(DSAContext);
  if (!context) {
    throw new Error(
      "useDSAContext must be used inside DSAProvider"
    );
  }
  return context;
}