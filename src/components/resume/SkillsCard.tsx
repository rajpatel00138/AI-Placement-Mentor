"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

interface SkillsCardProps {
  skills: string[];
}

export default function SkillsCard({ skills }: SkillsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-border bg-surface p-6 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-border bg-soft p-3 text-accent">
          <Code2 className="h-6 w-6 text-accent" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-primary">
            Technical Skills
          </h2>

          <p className="text-sm text-muted">
            Skills detected from your resume
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: .8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="rounded-full border border-border bg-elevated px-4 py-2 text-sm font-medium text-primary shadow-sm"
            >
              🚀 {skill}
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-muted">
            No skills detected.
          </p>
        )}
      </div>
    </motion.div>
  );
}