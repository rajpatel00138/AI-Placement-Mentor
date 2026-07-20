"use client";

import { dsaProblems } from "@/data/dsaProblems";
import {
  createContext,
  useContext,
  useEffect,
  useState,
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

export function DSAProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [revisions, setRevisions] =
    useState<RevisionMap>({});

  const [status, setStatus] =
    useState<StatusMap>({});

  const [favorites, setFavorites] =
    useState<FavoriteMap>({});

  // Load Local Storage
  useEffect(() => {
    const savedRevisions =
      localStorage.getItem("dsa-revisions");

    if (savedRevisions) {
      setRevisions(JSON.parse(savedRevisions));
    }

    const savedStatus =
      localStorage.getItem("dsa-status");

    if (savedStatus) {
      setStatus(JSON.parse(savedStatus));
    }

    const savedFavorites =
      localStorage.getItem("dsa-favorites");

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save Revisions
  useEffect(() => {
    localStorage.setItem(
      "dsa-revisions",
      JSON.stringify(revisions)
    );
  }, [revisions]);

  // Save Status
  useEffect(() => {
    localStorage.setItem(
      "dsa-status",
      JSON.stringify(status)
    );
  }, [status]);

  // Save Favorites
  useEffect(() => {
    localStorage.setItem(
      "dsa-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // Update Revision
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

  // Update Status
  const updateStatus = (
    problemId: string,
    status: ProblemStatus
  ) => {
    setStatus((prev) => ({
      ...prev,
      [problemId]: status,
    }));
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
  const solvedProblems =
    completedProblems;

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
  const context =
    useContext(DSAContext);

  if (!context) {
    throw new Error(
      "useDSAContext must be used inside DSAProvider"
    );
  }

  return context;
}