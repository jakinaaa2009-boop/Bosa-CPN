"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CAMPAIGN_FINE_PRINT, PROMO_PRODUCTS } from "@/lib/constants";
import { viewportOnce } from "@/lib/motion";

type Prize = {
  title: string;
  priceLine: string;
  price: string;
  winners: string;
  image?: string;
  icon?: string;
  glow: string;
};

const PRIZES: Prize[] = [
  {
    title: "PlayStation 5",
    priceLine: "PlayStation – 2,500,000₮ (1 азтан)",
    price: "2,500,000₮",
    winners: "1 азтан",
    image: "/prizes/playstation5.png",
    glow: "from-fuchsia-400/35 via-amber-300/25 to-cyan-300/30",
  },
  {
    title: "Gremix эрх",
    priceLine: "Gremix эрх – 250,000₮ (1 азтан)",
    price: "250,000₮",
    winners: "1 азтан",
    image: "/prizes/prize2.png",
    glow: "from-sky-400/30 via-indigo-400/20 to-fuchsia-400/25",
  },
  {
    title: "Нэрийн барааны багц",
    priceLine: "Нэрийн барааны багц – 500,000₮ (5 азтан)",
    price: "500,000₮",
    winners: "5 азтан",
    image: "/prizes/prize3.png",
    glow: "from-violet-400/30 via-fuchsia-400/20 to-amber-300/20",
  },
  {
    title: "STEAM эрх",
    priceLine: "STEAM эрх – $150 (10 азтан)",
    price: "$150",
    winners: "10 азтан",
    image: "/prizes/prize4.jpg",
    glow: "from-amber-400/28 via-rose-400/16 to-sky-400/18",
  },
  {
    title: "Honor Choice брэндийн чихэвч",
    priceLine: "Honor Choice чихэвч – 400,000₮ (2 азтан)",
    price: "400,000₮",
    winners: "2 азтан",
    image: "/prizes/prize5.png",
    glow: "from-emerald-400/25 via-cyan-400/18 to-violet-400/22",
  },
] as const;

function floatKeyframes(reduce: boolean, y = 14) {
  if (reduce) return {};
  return {
    animate: { y: [0, -y, 0] },
    transition: { duration: 5.2, repeat: Infinity, ease: "easeInOut" as const },
  };
}

export function PrizeSection() {
  const reduce = useReducedMotion() ?? false;
  const float = floatKeyframes(reduce, 12);
  const snacks = [PROMO_PRODUCTS[0], PROMO_PRODUCTS[4], PROMO_PRODUCTS[8]].filter(
    Boolean
  );

  return (
    <section
      id="prizes"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#14031f] via-[#0b1636] to-[#0a0b18] px-4 py-16 md:py-24"
    >
      {/* Nebula + star field */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_10%,rgba(168,85,247,0.38),transparent_62%),radial-gradient(820px_520px_at_85%_18%,rgba(236,72,153,0.30),transparent_65%),radial-gradient(980px_620px_at_50%_105%,rgba(59,130,246,0.32),transparent_62%)]" />
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:20px_20px]" />
        <motion.div
          className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-500/25 via-violet-500/15 to-transparent blur-3xl"
          {...(reduce ? {} : { animate: { y: [0, -18, 0] }, transition: { duration: 10, repeat: Infinity, ease: "easeInOut" } })}
        />
        <motion.div
          className="absolute -right-40 top-24 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400/18 via-indigo-500/12 to-transparent blur-3xl"
          {...(reduce ? {} : { animate: { y: [0, 16, 0] }, transition: { duration: 11, repeat: Infinity, ease: "easeInOut" } })}
        />
        <div className="absolute inset-0 bg-[radial-gradient(800px_420px_at_50%_0%,rgba(250,204,21,0.12),transparent_60%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,0.10),transparent_30%,transparent_70%,rgba(255,255,255,0.08))] rotate-[-10deg]" />
      </div>

      {/* Floating snack products around edges */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {snacks.map((p, i) => {
          const pos =
            i === 0
              ? { left: "6%", top: "22%", r: -10, s: "h-20 w-20 md:h-28 md:w-28" }
              : i === 1
                ? { left: "10%", bottom: "14%", r: 8, s: "h-24 w-24 md:h-32 md:w-32" }
                : { right: "7%", top: "18%", r: 10, s: "h-24 w-24 md:h-32 md:w-32" };
          return (
            <motion.div
              key={p.id}
              className={`absolute ${pos.s} drop-shadow-[0_18px_55px_rgba(0,0,0,0.45)] hidden sm:block`}
              style={pos as never}
              {...(reduce
                ? {}
                : {
                    animate: { y: [0, -12 - i * 2, 0], rotate: [pos.r, pos.r + 4, pos.r] },
                    transition: { duration: 6.2 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 },
                  })}
            >
              <div className={`relative h-full w-full rounded-3xl bg-gradient-to-br ${p.accent} p-[2px]`}>
                <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-white/90">
                  <Image src={p.image} alt="" fill className="object-contain" sizes="160px" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-extrabold tracking-[0.18em] text-white/80 backdrop-blur">
            ✦ GRAND PRIZE REVEAL ✦
          </div>
          <h2 className="mt-5 font-display text-4xl font-black tracking-tight text-white md:text-6xl">
            <span className="bg-gradient-to-r from-white via-fuchsia-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(236,72,153,0.35)]">
              Шагналын сан
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-relaxed text-white/75 md:text-base">
            Кино мэт гялалзсан мөч — супер шагнал хүртэл нэг алхам.
          </p>
        </motion.div>

        {/* Center stage */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.06, type: "spring", stiffness: 200, damping: 22 }}
          className="relative mx-auto mt-12"
        >
          {/* Gold/purple light streaks */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-10 h-40 w-[min(920px,92%)] -translate-x-1/2">
            <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(250,204,21,0.0),rgba(250,204,21,0.22),rgba(236,72,153,0.18),rgba(59,130,246,0.14),rgba(250,204,21,0.0))] blur-2xl opacity-80" />
          </div>

          {/* Crystal / glass platform */}
          <motion.div
            className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2.75rem] border border-white/15 bg-white/5 p-5 shadow-[0_32px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-7"
            {...(reduce
              ? {}
              : {
                  animate: { boxShadow: ["0 32px 120px rgba(0,0,0,0.55)", "0 36px 140px rgba(168,85,247,0.40)"] },
                  transition: { duration: 3.6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                })}
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_0%,rgba(255,255,255,0.10),transparent_55%),radial-gradient(700px_420px_at_15%_80%,rgba(236,72,153,0.18),transparent_60%),radial-gradient(700px_420px_at_90%_80%,rgba(59,130,246,0.18),transparent_60%)]"
            />
            {/* Soft golden swirl */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_90deg,rgba(250,204,21,0.0),rgba(250,204,21,0.20),rgba(250,204,21,0.0),rgba(236,72,153,0.12),rgba(59,130,246,0.12),rgba(250,204,21,0.0))] blur-2xl"
              {...(reduce ? {} : { animate: { rotate: 360 }, transition: { duration: 16, repeat: Infinity, ease: "linear" } })}
            />

            <div className="relative">
              {/* Prize row */}
              <div className="grid gap-4 md:grid-cols-5">
                {PRIZES.map((p, i) => (
                  <motion.div
                    key={p.title}
                    className="relative"
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.06 + i * 0.05, type: "spring", stiffness: 220, damping: 22 }}
                  >
                    {/* glow halo */}
                    <div
                      aria-hidden
                      className={`absolute -inset-6 rounded-[2rem] bg-gradient-to-br ${p.glow} blur-2xl opacity-70`}
                    />

                    <motion.div
                      className="relative mx-auto grid aspect-square w-full max-w-[220px] place-items-center rounded-[2rem] border border-white/18 bg-white/6 shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-md"
                      {...(reduce
                        ? {}
                        : {
                            animate: { y: [0, -10, 0] },
                            transition: { duration: 4.8 + (i % 3) * 0.35, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                          })}
                    >
                      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(120px_120px_at_35%_25%,rgba(255,255,255,0.22),transparent_55%)]" />
                      <div className="absolute inset-x-6 top-6 h-10 rounded-full bg-white/10 blur-md" />

                      <div className="relative h-[58%] w-[58%] overflow-hidden rounded-2xl bg-gradient-to-br from-white/70 via-white/30 to-white/10 p-[2px] ring-1 ring-white/15">
                        <div className="relative h-full w-full overflow-hidden rounded-[0.95rem] bg-white/90">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              className="object-contain drop-shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
                              sizes="220px"
                              priority={i === 0}
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-slate-50 to-white">
                              <span className="text-4xl" aria-hidden>
                                {p.icon ?? "🎁"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Label card */}
                    <div className="mt-3 rounded-2xl border border-white/18 bg-white/10 px-3 py-3 text-center shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
                      <p className="text-xs font-black text-white md:text-[13px]">{p.title}</p>
                      <p className="mt-1 text-[11px] font-semibold text-white/80">{p.price}</p>
                      <p className="mt-1 text-[11px] font-extrabold text-amber-200/95">
                        {p.winners}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile stacked (keep readability) */}
              <div className="mt-5 grid gap-3 md:hidden">
                {PRIZES.map((p) => (
                  <div
                    key={`${p.title}-line`}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 backdrop-blur"
                  >
                    {p.priceLine}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom info box */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.12, type: "spring", stiffness: 220, damping: 24 }}
            className="mx-auto mt-8 max-w-5xl"
          >
            <div className="relative overflow-hidden rounded-[1.85rem] border border-amber-200/30 bg-gradient-to-br from-amber-200/18 via-amber-100/10 to-fuchsia-200/10 p-5 shadow-[0_26px_90px_rgba(0,0,0,0.50)] backdrop-blur md:p-6">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(700px_260px_at_30%_0%,rgba(250,204,21,0.18),transparent_65%),radial-gradient(700px_260px_at_85%_115%,rgba(236,72,153,0.14),transparent_65%)]" />
              <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-200/20 px-3 py-1.5 text-xs font-black text-amber-100 ring-1 ring-amber-200/30">
                    ✦ Campaign info
                  </div>
                  <ul className="mt-3 space-y-2 text-sm font-semibold leading-relaxed text-white/85">
                    {CAMPAIGN_FINE_PRINT.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="mt-0.5 text-amber-200" aria-hidden>
                          ✦
                        </span>
                        <span className="min-w-0">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="shrink-0 rounded-3xl border border-white/15 bg-white/6 p-4 text-center backdrop-blur">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-amber-200/35 to-fuchsia-200/15 ring-1 ring-white/15 shadow-[0_18px_55px_rgba(0,0,0,0.35)]">
                    <span className="text-2xl" aria-hidden>
                      🏆
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-extrabold text-white/85">
                    Бэлэг дүүрэн супер аз!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
