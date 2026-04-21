"use client";

import { motion } from "framer-motion";
import { HOW_STEPS } from "@/lib/constants";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

/** Solid fills so step numbers always show (Tailwind may miss dynamic class strings). */
const STEP_THEME = [
  {
    badge: "bg-rose-600 ring-2 ring-rose-300/90 text-white shadow-md",
    iconRing: "ring-rose-200/90",
    iconBg: "bg-gradient-to-br from-rose-200 to-orange-100",
    cardBg: "bg-gradient-to-br from-rose-50 via-white to-orange-50",
    accent: "from-rose-400 to-orange-400",
    connector: "stroke-rose-300/70",
  },
  {
    badge: "bg-sky-600 ring-2 ring-sky-300/90 text-white shadow-md",
    iconRing: "ring-sky-200/90",
    iconBg: "bg-gradient-to-br from-sky-200 to-cyan-100",
    cardBg: "bg-gradient-to-br from-sky-50 via-white to-cyan-50",
    accent: "from-sky-400 to-cyan-400",
    connector: "stroke-sky-300/70",
  },
  {
    badge: "bg-violet-600 ring-2 ring-violet-300/90 text-white shadow-md",
    iconRing: "ring-violet-200/90",
    iconBg: "bg-gradient-to-br from-violet-200 to-fuchsia-100",
    cardBg: "bg-gradient-to-br from-violet-50 via-white to-fuchsia-50",
    accent: "from-violet-400 to-fuchsia-400",
    connector: "stroke-violet-300/70",
  },
  {
    badge: "bg-amber-600 ring-2 ring-amber-300/90 text-white shadow-md",
    iconRing: "ring-amber-200/90",
    iconBg: "bg-gradient-to-br from-amber-200 to-yellow-100",
    cardBg: "bg-gradient-to-br from-amber-50 via-white to-yellow-50",
    accent: "from-amber-400 to-orange-400",
    connector: "stroke-amber-300/70",
  },
] as const;

function Sparkle({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={[
        "pointer-events-none absolute grid place-items-center rounded-full",
        "bg-white/70 shadow-[0_10px_30px_rgba(16,24,40,0.10)] ring-1 ring-white/60",
        className,
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rotate-45 rounded-sm bg-gradient-to-br from-fuchsia-500/80 to-amber-400/80" />
    </span>
  );
}

export function HowToParticipate() {
  return (
    <section
      id="how"
      className="relative overflow-hidden px-4 py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_50%_0%,rgba(236,72,153,0.14),transparent_60%),radial-gradient(1000px_520px_at_0%_35%,rgba(56,189,248,0.14),transparent_62%),radial-gradient(900px_520px_at_100%_45%,rgba(168,85,247,0.14),transparent_60%),radial-gradient(900px_520px_at_50%_105%,rgba(251,191,36,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] [background-size:18px_18px] opacity-35" />
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-gradient-to-br from-rose-200/70 to-amber-100/50 blur-2xl" />
        <div className="absolute -right-20 top-28 h-72 w-72 rounded-full bg-gradient-to-br from-sky-200/70 to-violet-100/50 blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-fuchsia-200/50 to-cyan-100/40 blur-2xl" />

        <Sparkle className="left-[12%] top-[18%] h-8 w-8" />
        <Sparkle className="left-[26%] top-[10%] h-6 w-6" />
        <Sparkle className="right-[20%] top-[16%] h-9 w-9" />
        <Sparkle className="right-[10%] top-[28%] h-7 w-7" />
        <Sparkle className="left-[18%] bottom-[18%] h-7 w-7" />
        <Sparkle className="right-[14%] bottom-[14%] h-8 w-8" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-1.5 text-xs font-extrabold tracking-wide text-slate-800 shadow-[0_10px_30px_rgba(16,24,40,0.08)] backdrop-blur"
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-amber-400" />
            Энгийн 4 алхам
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative mt-5 font-display text-4xl font-black tracking-tight text-slate-950 md:text-5xl"
          >
            Хэрхэн оролцох вэ?
            <span
              aria-hidden
              className="pointer-events-none absolute -left-6 -top-6 hidden h-12 w-12 rotate-12 rounded-2xl bg-gradient-to-br from-rose-200/70 to-amber-100/50 blur-[1px] md:block"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-3 hidden h-10 w-10 -rotate-6 rounded-full bg-gradient-to-br from-sky-200/70 to-violet-100/60 blur-[1px] md:block"
            />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="mx-auto mt-3 max-w-2xl text-base font-semibold text-slate-600 md:text-lg"
          >
            Дөрвөн хялбар алхам — илүү их инээмсэглэл, илүү олон шанс.
          </motion.p>
        </div>

        <div className="relative mt-12">
          <div
            className="pointer-events-none absolute left-0 right-0 top-14 hidden h-16 lg:block"
            aria-hidden
          >
            <svg
              viewBox="0 0 1000 140"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <defs>
                <filter id="softGlow" x="-10%" y="-50%" width="120%" height="200%">
                  <feGaussianBlur stdDeviation="2.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M150,70 C250,10 300,130 400,70"
                fill="none"
                strokeDasharray="2 10"
                strokeLinecap="round"
                strokeWidth="5"
                className={STEP_THEME[0].connector}
                filter="url(#softGlow)"
                opacity="0.95"
              />
              <path
                d="M400,70 C500,10 550,130 650,70"
                fill="none"
                strokeDasharray="2 10"
                strokeLinecap="round"
                strokeWidth="5"
                className={STEP_THEME[1].connector}
                filter="url(#softGlow)"
                opacity="0.95"
              />
              <path
                d="M650,70 C750,10 800,130 900,70"
                fill="none"
                strokeDasharray="2 10"
                strokeLinecap="round"
                strokeWidth="5"
                className={STEP_THEME[2].connector}
                filter="url(#softGlow)"
                opacity="0.95"
              />

              <path
                d="M395,66 l14,4 -12,10"
                fill="none"
                strokeLinecap="round"
                strokeWidth="5"
                className={STEP_THEME[0].connector}
                opacity="0.85"
              />
              <path
                d="M645,66 l14,4 -12,10"
                fill="none"
                strokeLinecap="round"
                strokeWidth="5"
                className={STEP_THEME[1].connector}
                opacity="0.85"
              />
              <path
                d="M895,66 l14,4 -12,10"
                fill="none"
                strokeLinecap="round"
                strokeWidth="5"
                className={STEP_THEME[2].connector}
                opacity="0.85"
              />
            </svg>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {HOW_STEPS.map((step, i) => {
              const theme = STEP_THEME[i] ?? STEP_THEME[0];
              return (
                <motion.div
                  key={step.title}
                  variants={staggerItem}
                  whileHover={{ y: -6, rotate: i % 2 === 0 ? 0.4 : -0.4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group h-full"
                >
                  <div className="relative h-full rounded-[1.75rem] bg-white/70 p-1 shadow-[0_18px_55px_rgba(15,23,42,0.12)] ring-1 ring-white/70 backdrop-blur">
                    <div
                      className={[
                        "relative flex h-full flex-col overflow-hidden rounded-[1.45rem] px-6 pb-6 pt-7",
                        theme.cardBg,
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "relative grid h-20 w-20 place-items-center rounded-full ring-4",
                          theme.iconBg,
                          theme.iconRing,
                          "shadow-[0_14px_40px_rgba(15,23,42,0.12)]",
                        ].join(" ")}
                      >
                        <span className="text-4xl" role="img" aria-hidden>
                          {step.emoji}
                        </span>
                        <span
                          className={[
                            "absolute -bottom-3 -right-3 grid h-10 w-10 place-items-center rounded-full text-base font-black",
                            theme.badge,
                            "transition-transform duration-300 group-hover:scale-[1.04]",
                          ].join(" ")}
                        >
                          {i + 1}
                        </span>
                      </div>

                      <h3 className="mt-5 font-display text-xl font-black leading-snug text-slate-950">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">
                        {"description" in step ? step.description : ""}
                      </p>

                      <div className="mt-auto pt-6">
                        <div
                          className={[
                            "h-1.5 w-full rounded-full bg-gradient-to-r opacity-80",
                            theme.accent,
                          ].join(" ")}
                          aria-hidden
                        />
                      </div>

                      <div
                        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/55 blur-[1px]"
                        aria-hidden
                      />
                      <div
                        className={[
                          "pointer-events-none absolute -left-10 bottom-12 h-24 w-24 rounded-full opacity-30 blur-2xl",
                          `bg-gradient-to-br ${step.gradient}`,
                        ].join(" ")}
                        aria-hidden
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.05, duration: 0.45 }}
          className="mx-auto mt-10 max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur md:p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_260px_at_30%_0%,rgba(56,189,248,0.18),transparent_65%),radial-gradient(700px_260px_at_80%_110%,rgba(236,72,153,0.16),transparent_65%)]"
            />
            <div className="relative flex items-start gap-4 md:items-center">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-200 to-cyan-100 ring-1 ring-white/70 shadow-[0_14px_40px_rgba(15,23,42,0.10)]">
                <span className="text-2xl" role="img" aria-hidden>
                  💫
                </span>
              </div>
              <p className="text-sm font-bold leading-relaxed text-slate-800 md:text-base">
                Бүтээгдэхүүн тус бүрт 1 эрх олгогдоно. Амжилт хүсье!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
