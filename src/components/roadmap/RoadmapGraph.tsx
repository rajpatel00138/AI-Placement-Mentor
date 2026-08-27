"use client";

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, X, ExternalLink, Lock, Zap } from "lucide-react";

// -- Exported types (shared with RoadmapPlanner) ------------------------------
export type LearningResource = { label: string; url: string };
export type Step = {
  title: string;
  description: string;
  topics: string[];
  outcome: string;
  icon: LucideIcon;
  resources: LearningResource[];
};

// -- Props ---------------------------------------------------------------------
interface RoadmapGraphProps {
  roadmap: Step[];
  selectedCourse: string;
  group: { title: string };
  completed: string[];
  toggle: (step: Step) => void;
}

// -- SVG bezier connector -------------------------------------------------------
function BezierConnector({
  fromDone,
  toDone,
  isCurrentToNext,
}: {
  fromDone: boolean;
  toDone: boolean;
  isCurrentToNext: boolean;
}) {
  const linked = fromDone && toDone;
  const color = linked
    ? "var(--color-success)"
    : isCurrentToNext
    ? "var(--color-accent)"
    : "var(--color-border)";

  return (
    <div className="flex justify-center" aria-hidden="true">
      <svg width="40" height="64" viewBox="0 0 40 64" fill="none">
        {/* Glow track */}
        <path
          d="M 20 0 C 20 20, 20 44, 20 64"
          stroke={linked ? "var(--color-success)" : "var(--color-border)"}
          strokeWidth="2"
          strokeOpacity="0.15"
          fill="none"
        />
        {/* Animated dashed line for current->next */}
        {isCurrentToNext && !linked && (
          <path
            d="M 20 0 C 20 20, 20 44, 20 64"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeLinecap="round"
            fill="none"
            className="animate-dash"
          />
        )}
        {/* Main connector line */}
        {!isCurrentToNext && (
          <path
            d="M 20 0 C 20 20, 20 44, 20 64"
            stroke={color}
            strokeWidth="2"
            strokeDasharray={linked ? undefined : "4 5"}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {/* Arrowhead */}
        <polyline
          points="14,56 20,64 26,56"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

// -- Status ring pulse for current node ----------------------------------------
function PulseRing() {
  return (
    <span
      className="pointer-events-none absolute inset-0 rounded-2xl"
      aria-hidden="true"
    >
      <span className="absolute inset-0 rounded-2xl ring-2 ring-accent/40 animate-ping opacity-40" />
    </span>
  );
}

// -- Step number badge ---------------------------------------------------------
function StepBadge({ index, total, done, current }: { index: number; total: number; done: boolean; current: boolean }) {
  return (
    <span
      className={`absolute -right-2.5 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-extrabold ring-2 ring-surface transition ${
        done
          ? "bg-success text-on-accent ring-success/30"
          : current
          ? "bg-accent text-on-accent ring-accent/30"
          : "bg-base text-muted ring-border"
      }`}
    >
      {index + 1}
    </span>
  );
}

// -- Compact clickable node card -----------------------------------------------
function NodeCard({
  step,
  index,
  total,
  done,
  current,
  selected,
  onClick,
}: {
  step: Step;
  index: number;
  total: number;
  done: boolean;
  current: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = step.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full max-w-sm rounded-2xl border p-4 text-left shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 hover:-translate-y-0.5 hover:shadow-lg ${
        selected
          ? done
            ? "border-success/60 bg-success/15 ring-2 ring-success/30 shadow-success/10 shadow-lg"
            : current
            ? "border-accent/60 bg-soft/70 ring-2 ring-accent/30 shadow-accent/10 shadow-lg"
            : "border-accent/40 bg-soft/40 ring-2 ring-accent/20"
          : done
          ? "border-success/40 bg-success/10 hover:border-success/60"
          : current
          ? "border-accent/40 bg-soft/50 ring-1 ring-accent/30 shadow-accent/5 shadow-md"
          : "border-border bg-elevated hover:bg-soft/20 hover:border-border/80"
      }`}
    >
      {/* Pulse animation for active node */}
      {current && !done && <PulseRing />}

      {/* Step number badge */}
      <StepBadge index={index} total={total} done={done} current={current} />

      <div className="flex items-center gap-3.5">
        {/* Icon */}
        <div
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
            done
              ? "bg-success text-on-accent shadow-sm shadow-success/20"
              : current
              ? "bg-accent text-on-accent shadow-sm shadow-accent/30"
              : "border border-border bg-base text-muted group-hover:border-accent/40 group-hover:bg-soft group-hover:text-accent"
          }`}
        >
          {done ? <CheckCircle2 size={20} /> : current ? <Zap size={18} /> : <Icon size={18} />}
        </div>

        {/* Text content */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-primary leading-snug">{step.title}</p>
          <span
            className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              done
                ? "border border-success/30 bg-success/15 text-success"
                : current
                ? "border border-accent/30 bg-accent/15 text-accent"
                : "border border-border bg-base text-muted"
            }`}
          >
            {done ? (
              <>✓ Completed</>
            ) : current ? (
              <>● Active</>
            ) : (
              <><Lock size={8} className="inline" /> Up Next</>
            )}
          </span>
        </div>
      </div>

      <p className="mt-2.5 line-clamp-2 text-[11px] leading-relaxed text-muted">
        {step.description}
      </p>

      {/* Topics preview chips */}
      <div className="mt-3 flex flex-wrap gap-1">
        {step.topics.slice(0, 2).map((topic) => (
          <span
            key={topic}
            className="truncate max-w-[140px] rounded-md border border-border bg-base px-1.5 py-0.5 text-[10px] text-muted"
          >
            {topic}
          </span>
        ))}
        {step.topics.length > 2 && (
          <span className="rounded-md border border-border bg-base px-1.5 py-0.5 text-[10px] text-muted">
            +{step.topics.length - 2} more
          </span>
        )}
      </div>
    </button>
  );
}

// -- Slide-in detail panel -----------------------------------------------------
function DetailPanel({
  step,
  selectedCourse,
  completed,
  toggle,
  onClose,
}: {
  step: Step;
  selectedCourse: string;
  completed: string[];
  toggle: (step: Step) => void;
  onClose: () => void;
}) {
  const Icon = step.icon;
  const done = completed.includes(`${selectedCourse}-${step.title}`);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Panel header */}
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${
              done ? "bg-success text-on-accent shadow-success/20" : "bg-accent/10 text-accent"
            }`}
          >
            {done ? <CheckCircle2 size={20} /> : <Icon size={18} />}
          </div>
          <div>
            <h2 className="text-base font-bold text-primary leading-tight">{step.title}</h2>
            <span
              className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                done
                  ? "border border-success/30 bg-success/15 text-success"
                  : "border border-accent/30 bg-accent/15 text-accent"
              }`}
            >
              {done ? "Completed" : "In Progress"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="shrink-0 rounded-lg border border-border p-1.5 text-muted transition hover:bg-base hover:text-primary"
        >
          <X size={16} />
        </button>
      </div>

      {/* Panel body */}
      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        <p className="text-sm leading-relaxed text-muted">{step.description}</p>

        <div>
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            Topics Covered
          </p>
          <div className="flex flex-wrap gap-1.5">
            {step.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-lg border border-border bg-base px-2.5 py-1 text-[11px] font-medium text-primary"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            Learning Resources
          </p>
          <div className="flex flex-wrap gap-2">
            {step.resources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-base px-2.5 py-1.5 text-xs font-semibold text-accent transition hover:bg-soft hover:text-accent-hover"
              >
                Learn: {resource.label}
                <ExternalLink size={11} />
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-accent">
            Target Outcome
          </p>
          <p className="text-sm leading-relaxed text-primary">{step.outcome}</p>
        </div>
      </div>

      {/* Panel footer */}
      <div className="border-t border-border p-5">
        <button
          type="button"
          onClick={() => toggle(step)}
          className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
            done
              ? "border border-border bg-base text-muted hover:bg-soft hover:text-primary"
              : "bg-accent text-on-accent hover:bg-accent-hover shadow-sm shadow-accent/20"
          }`}
        >
          {done ? "Mark as Incomplete" : "Mark as Complete"}
        </button>
      </div>
    </div>
  );
}

// -- Main export ---------------------------------------------------------------
export default function RoadmapGraph({
  roadmap,
  selectedCourse,
  group,
  completed,
  toggle,
}: RoadmapGraphProps) {
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);

  useEffect(() => {
    setSelectedStep(null);
  }, [selectedCourse]);

  function getStatus(step: Step, index: number) {
    const id = `${selectedCourse}-${step.title}`;
    const done = completed.includes(id);
    const completeCount = roadmap.filter((s) =>
      completed.includes(`${selectedCourse}-${s.title}`)
    ).length;
    const current = !done && index === completeCount;
    return { done, current };
  }

  function handleNodeClick(step: Step) {
    setSelectedStep((prev) => (prev?.title === step.title ? null : step));
  }

  const panelOpen = selectedStep !== null;

  return (
    <>
      {/* Dash-animation keyframes injected inline */}
      <style>{`
        @keyframes dash-move {
          to { stroke-dashoffset: -20; }
        }
        .animate-dash {
          animation: dash-move 1.2s linear infinite;
        }
      `}</style>

      <div className="flex h-full flex-col">
        {/* Course heading */}
        <div className="border-b border-border bg-surface px-6 py-6 text-center sm:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {group.title}
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
            {selectedCourse}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted sm:text-sm">
            Click any milestone to view details and resources. Mark stages complete as you finish them.
          </p>
        </div>

        {/* Graph canvas + slide-in panel */}
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          {/* Scrollable node graph */}
          <div
            className={`flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${
              panelOpen ? "sm:pr-0" : ""
            }`}
          >
            <div className="flex flex-col items-center px-4 py-10 sm:px-6">
              {roadmap.map((step, index) => {
                const { done, current } = getStatus(step, index);
                const isSelected = selectedStep?.title === step.title;

                const nextStep = roadmap[index + 1];
                const nextDone = nextStep
                  ? completed.includes(`${selectedCourse}-${nextStep.title}`)
                  : false;
                const nextStatus = nextStep ? getStatus(nextStep, index + 1) : null;
                const isCurrentToNext = current || (nextStatus?.current ?? false);

                return (
                  <div
                    key={step.title}
                    className="flex w-full flex-col items-center"
                  >
                    <NodeCard
                      step={step}
                      index={index}
                      total={roadmap.length}
                      done={done}
                      current={current}
                      selected={isSelected}
                      onClick={() => handleNodeClick(step)}
                    />
                    {index < roadmap.length - 1 && (
                      <BezierConnector
                        fromDone={done}
                        toDone={nextDone}
                        isCurrentToNext={isCurrentToNext}
                      />
                    )}
                  </div>
                );
              })}

              {/* Completion celebration */}
              {roadmap.every((step) =>
                completed.includes(`${selectedCourse}-${step.title}`)
              ) && (
                <div className="mt-6 w-full max-w-sm rounded-2xl border border-success/30 bg-success/10 p-4 text-center">
                  <p className="text-2xl">🎉</p>
                  <p className="mt-1 text-sm font-bold text-success">
                    Roadmap Complete!
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    You have mastered all modules in this track.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detail panel -- slides in from the right */}
          <div
            className={`absolute inset-y-0 right-0 z-10 w-full border-l border-border bg-surface shadow-2xl transition-transform duration-300 ease-in-out sm:w-[360px] ${
              panelOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {selectedStep && (
              <DetailPanel
                step={selectedStep}
                selectedCourse={selectedCourse}
                completed={completed}
                toggle={toggle}
                onClose={() => setSelectedStep(null)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
