"use client";

import { motion } from "framer-motion";
import { CAMPAIGN_FINE_PRINT, PRIZE_POOL_LINES } from "@/lib/constants";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

export function PrizeSection() {
  return (
    <section
      id="prizes"
      className="relative overflow-hidden bg-gradient-to-br from-violet-200/80 via-fuchsia-100 to-amber-100 px-4 py-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.65),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-80 [background-image:radial-gradient(rgba(255,255,255,0.55)_1.2px,transparent_1.3px)] [background-size:22px_22px]" />
      <div className="relative mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="font-display text-center text-3xl font-black tracking-tight text-slate-900 md:text-4xl"
        >
          Шагналын сан
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="kid-card mt-10 p-6 md:p-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border-4 border-white bg-gradient-to-r from-fuchsia-500 via-orange-400 to-amber-300 px-4 py-2 text-sm font-black text-white shadow-[0_10px_24px_rgba(236,72,153,0.25),0_4px_0_rgba(140,20,90,0.45)]">
              🏆 ШАГНАЛЫН САН
            </div>
            <div className="rounded-full bg-amber-50 px-4 py-2 text-xs font-extrabold text-amber-950 ring-2 ring-amber-200">
              ✨ Азтангууд бэлэн үү?
            </div>
          </div>

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-7 grid gap-3 sm:gap-4"
          >
            {PRIZE_POOL_LINES.map((line, i) => (
              <motion.li
                key={line}
                variants={staggerItem}
                className="group flex items-start gap-3 rounded-2xl border-2 border-slate-100 bg-gradient-to-br from-white via-white to-fuchsia-50/60 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:border-fuchsia-200"
              >
                <span
                  className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-orange-400 to-amber-300 text-lg font-black text-white shadow-[0_10px_22px_rgba(236,72,153,0.25),0_4px_0_rgba(140,20,90,0.45)] ring-2 ring-white/80"
                  aria-hidden
                >
                  {i === 0 ? "👑" : i === 1 ? "🎮" : i === 2 ? "🎁" : i === 3 ? "💳" : "🍪"}
                </span>
                <span className="pt-1 text-base font-extrabold text-slate-800 md:text-lg">
                  {line}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.12, type: "spring", stiffness: 200, damping: 22 }}
            className="mt-8 rounded-[1.75rem] border-4 border-white bg-gradient-to-br from-amber-50 via-white to-cyan-50 p-5 shadow-[0_12px_28px_rgba(0,0,0,0.06)] md:p-6"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-black text-slate-800 ring-2 ring-amber-200">
              📝 Санамж
            </div>
            <div className="space-y-3 text-sm font-semibold leading-relaxed text-slate-700 md:text-base">
            {CAMPAIGN_FINE_PRINT.map((t) => (
              <p key={t}>{t}</p>
            ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
