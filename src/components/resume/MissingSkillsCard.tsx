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
      className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-red-500/10 p-3">
          <TriangleAlert className="h-6 w-6 text-red-400" />
        </div>

        <div>

          <h2 className="text-xl font-bold text-white">
            Missing Skills
          </h2>

          <p className="text-sm text-slate-400">
            Skills recommended for better placements
          </p>

        </div>

      </div>

      <div className="mt-8 flex flex-wrap gap-3">

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
              className="rounded-full border border-red-500/20 bg-gradient-to-r from-red-500/10 to-orange-500/10 px-4 py-2 text-sm font-medium text-red-300"
            >
              ⚠ {skill}
            </motion.div>
          ))
        ) : (
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
            🎉 Great! No major missing skills detected.
          </div>
        )}

      </div>
    </motion.div>
  );
}