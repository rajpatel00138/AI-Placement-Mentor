"use client";

import { motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";

interface MissingSkillsCardProps {
  skills: string[];
}

export default function MissingSkillsCard({
  skills,
}: MissingSkillsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-border bg-surface p-6 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-error/30 bg-error/10 p-3 text-error">
          <TriangleAlert className="h-6 w-6 text-error" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-primary">
            Missing Skills
          </h2>

          <p className="text-sm text-muted">
            Skills recommended for better placements
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{
                scale: 1.05,
                rotate: -1,
              }}
              className="rounded-full border border-error/30 bg-error/10 px-4 py-2 text-sm font-medium text-error"
            >
              ⚠ {skill}
            </motion.div>
          ))
        ) : (
          <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-sm font-medium text-success">
            🎉 Great! No major missing skills detected.
          </div>
        )}
      </div>
    </motion.div>
  );
}