"use client";

import { motion } from "framer-motion";
import { CAMPAIGN_FINE_PRINT, PRIZE_POOL_LINES } from "@/lib/constants";

export function PrizeSection() {
  return (
    <section
      id="prizes"
      className="relative overflow-hidden bg-gradient-to-br from-violet-200/80 via-fuchsia-100 to-amber-100 px-4 py-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_50%)]" />
      <div className="relative mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="font-display text-center text-3xl font-extrabold text-slate-900 md:text-4xl"
        >
          Шагналын сан
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-[2rem] border-4 border-white bg-white/90 p-8 shadow-card backdrop-blur-md md:p-10"
        >
          <h3 className="font-display text-xl font-black text-fuchsia-600 md:text-2xl">
            ШАГНАЛЫН САН:
          </h3>
          <ul className="mt-6 space-y-4">
            {PRIZE_POOL_LINES.map((line, i) => (
              <motion.li
                key={line}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-3 text-base font-bold text-slate-800 md:text-lg"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-amber-500" />
                <span>{line}</span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-8 space-y-3 rounded-2xl bg-amber-50 p-5 text-sm font-semibold leading-relaxed text-slate-700 md:text-base">
            {CAMPAIGN_FINE_PRINT.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
