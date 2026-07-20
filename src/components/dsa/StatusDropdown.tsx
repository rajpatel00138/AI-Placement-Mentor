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
      className="
        h-10
        min-w-[180px]
        rounded-xl
        border
        border-slate-700
        bg-slate-900
        px-4
        text-sm
        font-medium
        text-white
        outline-none
        transition-all
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-500/20
        cursor-pointer
      "
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-slate-900 text-white"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}