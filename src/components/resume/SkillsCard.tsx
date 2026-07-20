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
      className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-cyan-500/10 p-3">
          <Code2 className="h-6 w-6 text-cyan-400" />
        </div>

        <div>

          <h2 className="text-xl font-bold text-white">
            Technical Skills
          </h2>

          <p className="text-sm text-slate-400">
            Skills detected from your resume
          </p>

        </div>

      </div>

      <div className="mt-8 flex flex-wrap gap-3">

        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: .8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="rounded-full border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 px-4 py-2 text-sm font-medium text-cyan-300"
            >
              🚀 {skill}
            </motion.div>
          ))
        ) : (
          <p className="text-slate-500">
            No skills detected.
          </p>
        )}

      </div>
    </motion.div>
  );
}