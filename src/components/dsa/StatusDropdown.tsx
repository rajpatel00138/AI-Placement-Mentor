"use client";

import { ProblemStatus } from "./context/DSAContext";

interface StatusDropdownProps {
  value: ProblemStatus;
  onChange: (status: ProblemStatus) => void;
}

const options = [
  {
    value: "not-started",
    label: "⚪ Not Started",
  },
  {
    value: "in-progress",
    label: "🟡 In Progress",
  },
  {
    value: "completed",
    label: "🟢 Completed",
  },
];

export default function StatusDropdown({
  value,
  onChange,
}: StatusDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) =>
        onChange(e.target.value as ProblemStatus)
      }
      aria-label="Select Problem Status"
      className="
        h-9
        w-full
        min-w-[150px]
        rounded-xl
        border
        border-border
        bg-base
        px-3
        text-xs
        font-medium
        text-primary
        outline-none
        transition-all
        focus:border-accent
        cursor-pointer
        shadow-sm
      "
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-surface text-primary"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}