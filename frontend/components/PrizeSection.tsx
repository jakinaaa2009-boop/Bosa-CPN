"use client";

import { motion } from "framer-motion";
import { CAMPAIGN_FINE_PRINT } from "@/lib/constants";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { HeroPrizeShowcase } from "./hero/HeroPrizeShowcase";

type Prize = {
  title: string;
  desc: string;
  price: string;
  winners: string;
  icon: string;
  accent: {
    leftBorder: string;
    iconBg: string;
    pricePill: string;
    winnersPill: string;
    glow: string;
  };
};

const PRIZES: Prize[] = [
  {
    title: "PlayStation 5",
    desc: "Хамгийн сүүлийн үеийн тоглоомын консол",
    price: "2,500,000₮",
    winners: "1 азтан",
    icon: "🎮",
    accent: {
      leftBorder: "border-rose-400",
      iconBg: "from-rose-200 to-orange-100",
      pricePill: "from-rose-500 to-orange-400",
      winnersPill: "from-rose-100 to-orange-50 text-rose-900 ring-rose-200/80",
      glow: "hover:shadow-[0_22px_70px_rgba(244,63,94,0.20)]",
    },
  },
  {
    title: "Gremix тоглоомын дэлгүүрийн эрх",
    desc: "Дээд зэрэглэлийн геймерийн туршлага",
    price: "250,000₮",
    winners: "1 азтан",
    icon: "🕹️",
    accent: {
      leftBorder: "border-sky-400",
      iconBg: "from-sky-200 to-cyan-100",
      pricePill: "from-sky-500 to-cyan-400",
      winnersPill: "from-sky-100 to-cyan-50 text-sky-900 ring-sky-200/80",
      glow: "hover:shadow-[0_22px_70px_rgba(56,189,248,0.20)]",
    },
  },
  {
    title: "Нэрийн барааны багц бэлэг",
    desc: "Чанартай, стильтэй сонголт",
    price: "500,000₮",
    winners: "5 азтан",
    icon: "🎁",
    accent: {
      leftBorder: "border-violet-400",
      iconBg: "from-violet-200 to-fuchsia-100",
      pricePill: "from-violet-500 to-fuchsia-400",
      winnersPill:
        "from-violet-100 to-fuchsia-50 text-violet-950 ring-violet-200/80",
      glow: "hover:shadow-[0_22px_70px_rgba(168,85,247,0.18)]",
    },
  },
  {
    title: "STEAM платформын эрх",
    desc: "Таны дуртай тоглоомуудыг нээх эрх",
    price: "$150",
    winners: "10 азтан",
    icon: "💳",
    accent: {
      leftBorder: "border-orange-400",
      iconBg: "from-amber-200 to-orange-100",
      pricePill: "from-amber-500 to-orange-400",
      winnersPill:
        "from-amber-100 to-orange-50 text-amber-950 ring-amber-200/80",
      glow: "hover:shadow-[0_22px_70px_rgba(249,115,22,0.18)]",
    },
  },
  {
    title: "Honor Choice брэндийн чихэвч",
    desc: "Хөгжимтэй хамт хаана ч, хэзээ ч",
    price: "400,000₮",
    winners: "2 азтан",
    icon: "🎧",
    accent: {
      leftBorder: "border-emerald-400",
      iconBg: "from-emerald-200 to-lime-100",
      pricePill: "from-emerald-500 to-lime-400",
      winnersPill:
        "from-emerald-100 to-lime-50 text-emerald-950 ring-emerald-200/80",
      glow: "hover:shadow-[0_22px_70px_rgba(16,185,129,0.18)]",
    },
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

function PrizeCard({ prize }: { prize: Prize }) {
  return (
    <motion.li
      variants={staggerItem}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={[
        "group relative flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/70 p-3 shadow-[0_12px_34px_rgba(15,23,42,0.10)] backdrop-blur",
        "md:flex-row md:items-center",
        "transition-shadow duration-300",
        prize.accent.glow,
      ].join(" ")}
    >
      <div
        aria-hidden
        className={[
          "absolute left-0 top-5 h-[calc(100%-40px)] w-1.5 rounded-full border-l-4",
          prize.accent.leftBorder,
        ].join(" ")}
      />

      <div className="flex items-start gap-3 md:items-center">
        <div
          className={[
            "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ring-1 ring-white/70 shadow-[0_8px_22px_rgba(15,23,42,0.10)]",
            prize.accent.iconBg,
          ].join(" ")}
        >
          <span className="text-xl" role="img" aria-hidden>
            {prize.icon}
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1 md:pl-2">
        <p className="text-sm font-black text-slate-950 md:text-base">
          {prize.title}
        </p>
        <p className="mt-0.5 text-xs font-semibold text-slate-600 md:text-sm">
          {prize.desc}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:justify-end">
        <span
          className={[
            "inline-flex items-center justify-center rounded-full bg-gradient-to-r px-3 py-1 text-xs font-black text-white shadow-[0_10px_22px_rgba(15,23,42,0.10)]",
            prize.accent.pricePill,
          ].join(" ")}
        >
          {prize.price}
        </span>
        <span
          className={[
            "inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-extrabold ring-2",
            prize.accent.winnersPill,
          ].join(" ")}
        >
          <span aria-hidden>🎁</span>
          {prize.winners}
        </span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/65 blur-[1px]"
      />
    </motion.li>
  );
}

export function PrizeSection() {
  return (
    <section
      id="prizes"
      className="relative overflow-hidden bg-gradient-to-br from-rose-200/70 via-violet-100/70 to-amber-100/70 px-4 py-16 md:py-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_50%_0%,rgba(236,72,153,0.16),transparent_60%),radial-gradient(1000px_520px_at_0%_40%,rgba(168,85,247,0.16),transparent_62%),radial-gradient(900px_520px_at_100%_45%,rgba(251,191,36,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] [background-size:18px_18px] opacity-30" />
        <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-gradient-to-br from-rose-200/70 to-amber-100/50 blur-2xl" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet-200/70 to-sky-100/50 blur-2xl" />

        <Sparkle className="left-[10%] top-[18%] h-8 w-8" />
        <Sparkle className="left-[24%] top-[10%] h-6 w-6" />
        <Sparkle className="right-[16%] top-[14%] h-9 w-9" />
        <Sparkle className="right-[10%] top-[30%] h-7 w-7" />
        <Sparkle className="left-[16%] bottom-[18%] h-7 w-7" />
        <Sparkle className="right-[14%] bottom-[14%] h-8 w-8" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-10">
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="mx-auto w-full max-w-[520px]"
            >
              <HeroPrizeShowcase />
            </motion.div>

            <div className="mt-4 text-center lg:mt-6 lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.4 }}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-1.5 text-xs font-extrabold tracking-wide text-slate-800 shadow-[0_10px_30px_rgba(16,24,40,0.08)] backdrop-blur"
              >
                🎁 ШАГНАЛУУД
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: 0.08, duration: 0.45 }}
                className="mx-auto mt-3 max-w-md text-base font-semibold text-slate-600 md:text-lg lg:mx-0"
              >
                Өдөр бүрийн баяр хөөр — супер шагнал хүртэл нэг алхам.
              </motion.p>
            </div>
          </div>

          <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-[0_16px_46px_rgba(15,23,42,0.14)] backdrop-blur md:p-7 lg:max-h-[720px] lg:overflow-hidden"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-amber-400 px-4 py-2 text-xs font-black tracking-wide text-white shadow-[0_14px_34px_rgba(168,85,247,0.22)] ring-2 ring-white/80">
              🏆 Шагналуудын жагсаалт
            </div>
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/70 px-5 py-2 text-sm font-extrabold text-slate-900 shadow-[0_14px_34px_rgba(15,23,42,0.10)] ring-1 ring-white/70 backdrop-blur transition hover:bg-white/85"
            >
              ✨ Азтангууд бэлэн үү?
            </motion.button>
          </div>

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
              className="mt-5 grid gap-3 lg:max-h-[430px] lg:overflow-y-auto lg:pr-1"
          >
            {PRIZES.map((p) => (
              <PrizeCard key={p.title} prize={p} />
            ))}
          </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: 0.08, type: "spring", stiffness: 210, damping: 22 }}
              className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/75 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur"
            >
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-xs font-black text-slate-800 ring-2 ring-amber-200">
                    📝 Санамж
                  </span>
                  <span className="text-xs font-extrabold text-slate-600 group-open:rotate-180 transition">
                    ▼
                  </span>
                </summary>
                <div className="border-t border-white/70 px-5 pb-5">
                  <ul className="space-y-2 text-xs font-semibold leading-relaxed text-slate-700 md:text-sm">
                    {CAMPAIGN_FINE_PRINT.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="mt-0.5 text-emerald-600" aria-hidden>
                          ✔
                        </span>
                        <span className="min-w-0">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </motion.div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
