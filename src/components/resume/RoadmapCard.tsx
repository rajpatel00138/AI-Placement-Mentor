"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

interface RoadmapCardProps {
  roadmap?: string[];
  suggestions?: string[];
}

export default function RoadmapCard({
  roadmap,
  suggestions = [],
}: RoadmapCardProps) {
  const steps = roadmap && roadmap.length > 0 ? roadmap : suggestions;
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-border bg-surface p-6 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-border bg-soft p-3 text-accent">
          <Rocket className="h-6 w-6 text-accent" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-primary">
            AI Career Roadmap
          </h2>

          <p className="text-sm text-muted">
            Follow these steps to become placement ready
          </p>
        </div>
      </div>

      <div className="relative mt-8">
        {/* Vertical Line */}
        <div className="absolute left-5 top-0 h-full w-0.5 rounded-full bg-border" />

        <div className="space-y-6">
          {steps.length > 0 ? (
            steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                className="relative flex gap-4"
              >
                <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent font-bold text-on-accent shadow-sm">
                  {index + 1}
                </div>

                <div className="flex-1 rounded-2xl border border-border bg-elevated p-5 shadow-sm">
                  <h3 className="font-semibold text-primary">
                    Step {index + 1}
                  </h3>

                  <p className="mt-1.5 leading-6 text-sm text-muted">
                    {item}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="rounded-2xl border border-success/30 bg-success/10 p-5 text-sm font-medium text-success">
              🎉 Congratulations! Your roadmap is complete.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}