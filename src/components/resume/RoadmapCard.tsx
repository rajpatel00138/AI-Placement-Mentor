"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

interface RoadmapCardProps {
  suggestions: string[];
}

export default function RoadmapCard({
  suggestions,
}: RoadmapCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-cyan-500/10 p-3">
          <Rocket className="h-6 w-6 text-cyan-400" />
        </div>

        <div>

          <h2 className="text-xl font-bold text-white">
            AI Career Roadmap
          </h2>

          <p className="text-sm text-slate-400">
            Follow these steps to become placement ready
          </p>

        </div>

      </div>

      <div className="relative mt-10">

        {/* Vertical Line */}

        <div className="absolute left-5 top-0 h-full w-1 rounded-full bg-gradient-to-b from-cyan-500 via-indigo-500 to-purple-500" />

        <div className="space-y-8">

          {suggestions.length > 0 ? (

            suggestions.map((item, index) => (

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
                className="relative flex gap-5"
              >

                <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 font-bold text-white shadow-lg">

                  {index + 1}

                </div>

                <div className="flex-1 rounded-2xl border border-slate-700 bg-slate-800/70 p-5">

                  <h3 className="font-semibold text-white">
                    Step {index + 1}
                  </h3>

                  <p className="mt-2 leading-7 text-slate-300">
                    {item}
                  </p>

                </div>

              </motion.div>

            ))

          ) : (

            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-green-400">

              🎉 Congratulations! Your roadmap is complete.

            </div>

          )}

        </div>

      </div>

    </motion.div>
  );
}