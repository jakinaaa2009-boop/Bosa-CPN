"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SUBMIT_PAGE_HREF } from "@/lib/constants";
import { HeroCloudRainbow } from "./hero/HeroCloudRainbow";
import { HeroNavbar } from "./hero/HeroNavbar";
import { HeroPrizeShowcase } from "./hero/HeroPrizeShowcase";

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden border-b border-white/40 bg-gradient-to-b from-[#fef6ff] via-[#e8f4ff] to-[#fff5eb]"
    >
      {/* Sky layers */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(255,182,255,0.45),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_60%_at_80%_20%,rgba(147,197,253,0.4),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_10%_30%,rgba(196,181,253,0.35),transparent_48%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_100%,rgba(254,243,199,0.75),transparent_45%)]"
        aria-hidden
      />

      <HeroCloudRainbow />

      {/* Bottom clouds / fog — above rainbow for soft blend */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] h-[min(45%,320px)] bg-[linear-gradient(to_top,rgba(255,255,255,0.95),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-[-20%] z-[3] h-48 w-[70%] rounded-full bg-white/60 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 right-[-15%] z-[3] h-44 w-[65%] rounded-full bg-fuchsia-100/50 blur-3xl"
        aria-hidden
      />

      <HeroNavbar />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-2 md:px-6 md:pb-24 md:pt-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left — copy */}
          <div className="max-w-xl">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="mb-5 inline-flex items-center rounded-full border border-white/90 bg-white/75 px-4 py-2 text-sm font-extrabold text-fuchsia-700 shadow-[0_8px_28px_rgba(236,72,153,0.12)] backdrop-blur-md"
            >
              <span className="mr-2 text-base" aria-hidden>
                ✨
              </span>
              2026 оны томоохон урамшуулал!
            </motion.div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, type: "spring", stiffness: 200, damping: 22 }}
              className="font-display text-[clamp(2rem,6vw,3.75rem)] font-black leading-[1.12] tracking-tight"
            >
              <span className="block bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Азын сугалааны
              </span>
              <span className="mt-1 block bg-gradient-to-r from-fuchsia-500 via-amber-400 to-cyan-400 bg-clip-text text-transparent">
                кампанид
              </span>
              <span className="mt-1 block bg-gradient-to-r from-indigo-700 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                оролцоорой!
              </span>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, type: "spring", stiffness: 240, damping: 26 }}
              className="mt-6 text-base font-semibold leading-relaxed text-slate-700/95 md:text-lg"
            >
              Бүтээгдэхүүнээ аваад НӨАТ-ын баримтаа илгээнэ үү — PlayStation болон бусад супер
              шагналууд таныг хүлээж байна!
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, type: "spring", stiffness: 260, damping: 24 }}
              className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <motion.div
                whileHover={reduce ? undefined : { scale: 1.04 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
              >
                <Link
                  href={SUBMIT_PAGE_HREF}
                  className="idle-breathe relative inline-flex min-h-[52px] min-w-[200px] items-center justify-center rounded-[1.35rem] bg-gradient-to-r from-fuchsia-500 via-orange-400 to-amber-300 px-8 py-4 text-lg font-black text-white shadow-[0_8px_0_rgb(150,45,100),0_20px_48px_rgba(236,72,153,0.38)] ring-2 ring-white/50 transition hover:shadow-[0_8px_0_rgb(150,45,100),0_24px_56px_rgba(236,72,153,0.48),0_0_32px_rgba(250,204,21,0.45)]"
                >
                  Баримт оруулах
                </Link>
              </motion.div>
              <motion.div
                whileHover={reduce ? undefined : { scale: 1.03 }}
                whileTap={reduce ? undefined : { scale: 0.99 }}
              >
                <Link
                  href="/#how"
                  className="inline-flex min-h-[52px] min-w-[180px] items-center justify-center rounded-[1.35rem] border-[3px] border-white bg-white/75 px-8 py-4 text-lg font-black text-slate-800 shadow-[0_10px_36px_rgba(15,23,42,0.08),inset_0_2px_0_rgba(255,255,255,0.95)] backdrop-blur-md transition hover:border-fuchsia-200 hover:bg-white"
                >
                  Оролцох
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right — showcase */}
          <div className="min-h-[300px] lg:min-h-[440px]">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 22 }}
            >
              <HeroPrizeShowcase />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
