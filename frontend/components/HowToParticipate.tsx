"use client";

import { motion } from "framer-motion";
import { HOW_STEPS } from "@/lib/constants";

/** Solid fills so step numbers always show (Tailwind may miss dynamic gradient strings). */
const STEP_BADGE_CLASS = [
  "bg-fuchsia-600 ring-2 ring-fuchsia-300/90 text-white shadow-md",
  "bg-sky-600 ring-2 ring-sky-300/90 text-white shadow-md",
  "bg-violet-600 ring-2 ring-violet-300/90 text-white shadow-md",
  "bg-amber-600 ring-2 ring-amber-400 text-white shadow-md",
] as const;

export function HowToParticipate() {
  return (
    <section id="how" className="relative px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-center text-3xl font-extrabold text-slate-900 md:text-4xl"
        >
          Хэрхэн оролцох вэ?
        </motion.h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-lg font-semibold text-slate-600">
          Дөрвөн хялбар алхам — илүү их инээмсэглэл, илүү олон шанс!
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
              whileHover={{ scale: 1.03, rotate: i % 2 === 0 ? 1.5 : -1.5 }}
              className={`rounded-3xl bg-gradient-to-br ${step.gradient} p-1 shadow-card ring-2 ring-white/80`}
            >
              <div className="relative h-full overflow-hidden rounded-[1.35rem] bg-white px-5 py-6">
                <span className="text-5xl" role="img" aria-hidden>
                  {step.emoji}
                </span>
                <div
                  className={`mt-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-black ${STEP_BADGE_CLASS[i]}`}
                >
                  {i + 1}
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold leading-snug text-slate-900">
                  {step.title}
                </h3>
                <div
                  className={`pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${step.gradient} opacity-15`}
                  aria-hidden
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
