"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PROMO_PRODUCTS } from "@/lib/constants";

const LOTTERY_NUMBERS = ["07", "13", "24"] as const;

function floatProps(duration: number, delay: number, y = 10) {
  return {
    animate: { y: [0, -y, 0] },
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  };
}

function rotateProps(duration: number, delay: number) {
  return {
    animate: { rotate: [0, 8, -6, 0] },
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  };
}

export function HeroPrizeShowcase() {
  const reduce = useReducedMotion() ?? false;
  const orbitProducts = PROMO_PRODUCTS.slice(0, 7);

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,440px)] lg:max-w-none">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(255,182,255,0.45),transparent_58%)] blur-2xl md:-inset-10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(147,197,253,0.35),transparent_70%)] blur-3xl"
        aria-hidden
      />

      <div className="relative aspect-square w-full max-w-[420px] mx-auto lg:max-w-[480px] lg:aspect-[1.05]">
        {/* Sparkles */}
        {[...Array(14)].map((_, i) => (
          <motion.span
            key={`sp-${i}`}
            className="pointer-events-none absolute text-lg text-amber-200/90 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]"
            style={{
              left: `${(i * 17 + 9) % 88}%`,
              top: `${(i * 23 + 7) % 82}%`,
            }}
            animate={
              reduce
                ? false
                : { opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }
            }
            transition={{
              duration: 2.2 + (i % 4) * 0.4,
              repeat: Infinity,
              delay: i * 0.12,
            }}
          >
            {i % 3 === 0 ? "✦" : i % 3 === 1 ? "★" : "✧"}
          </motion.span>
        ))}

        {/* Blue crystals */}
        {[
          { t: 12, l: 8, s: "h-10 w-7" },
          { t: 22, l: 86, s: "h-12 w-8" },
          { t: 72, l: 6, s: "h-9 w-6" },
          { t: 78, l: 88, s: "h-11 w-7" },
        ].map((c, i) => (
          <motion.div
            key={`cr-${i}`}
            className={`pointer-events-none absolute rounded-lg bg-gradient-to-br from-cyan-300/90 via-sky-400/80 to-indigo-500/90 opacity-80 shadow-[0_0_24px_rgba(56,189,248,0.55)] blur-[0.5px] ${c.s}`}
            style={{ top: `${c.t}%`, left: `${c.l}%` }}
            {...(reduce ? {} : floatProps(5 + i * 0.3, i * 0.2, 8))}
          />
        ))}

        {/* Lottery balls */}
        {LOTTERY_NUMBERS.map((num, i) => (
          <motion.div
            key={num}
            className="absolute flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-white to-rose-100 text-sm font-black text-rose-600 shadow-[0_6px_0_rgb(190,24,93),0_12px_24px_rgba(236,72,153,0.35)] ring-2 ring-white/90 md:h-12 md:w-12 md:text-base"
            style={{
              top: `${18 + i * 8}%`,
              left: `${i % 2 === 0 ? 4 : 88}%`,
            }}
            {...(reduce ? {} : floatProps(4.2 + i * 0.4, i * 0.35, 9))}
          >
            {num}
          </motion.div>
        ))}

        {/* Emoji prize accents */}
        <motion.span
          className="absolute right-[6%] top-[38%] text-3xl drop-shadow-lg md:text-4xl"
          {...(reduce ? {} : floatProps(5.5, 0.4, 7))}
          aria-hidden
        >
          📱
        </motion.span>
        <motion.span
          className="absolute left-[10%] top-[48%] text-3xl drop-shadow-lg md:text-4xl"
          {...(reduce ? {} : floatProps(4.8, 0.8, 8))}
          aria-hidden
        >
          🎧
        </motion.span>
        <motion.span
          className="absolute bottom-[28%] right-[12%] rounded-2xl border-2 border-white/90 bg-white/90 px-2 py-1 text-xl shadow-lg md:text-2xl"
          {...(reduce ? {} : rotateProps(7, 0.2))}
          aria-hidden
        >
          🧾
        </motion.span>

        {/* Gems */}
        {[
          { c: "from-fuchsia-400 to-pink-500", x: "14%", y: "62%" },
          { c: "from-amber-300 to-orange-400", x: "82%", y: "58%" },
          { c: "from-emerald-400 to-teal-500", x: "48%", y: "8%" },
        ].map((g, i) => (
          <motion.div
            key={`gem-${i}`}
            className={`pointer-events-none absolute h-5 w-5 rotate-45 rounded-md bg-gradient-to-br ${g.c} opacity-90 shadow-[0_0_18px_rgba(255,255,255,0.6)]`}
            style={{ left: g.x, top: g.y }}
            {...(reduce ? {} : floatProps(6.2, i * 0.25, 6))}
          />
        ))}

        {/* Orbiting product thumbnails */}
        {orbitProducts.map((p, i) => {
          const n = orbitProducts.length;
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
          const r = 41;
          const x = 50 + r * Math.cos(angle);
          const y = 50 + r * Math.sin(angle);
          return (
            <motion.div
              key={p.id}
              className="absolute h-[17%] w-[17%] min-h-[52px] min-w-[52px] max-h-[88px] max-w-[88px]"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              {...(reduce
                ? {}
                : floatProps(4.5 + (i % 3) * 0.35, i * 0.15, 11 + (i % 3)))}
            >
              <div
                className={`h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br ${p.accent} p-[2px] shadow-[0_12px_28px_rgba(0,0,0,0.15)] ring-2 ring-white/90`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[0.85rem] bg-white">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="88px"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Glass dome + main prize */}
        <div className="absolute left-1/2 top-1/2 z-10 w-[56%] max-w-[220px] -translate-x-1/2 -translate-y-1/2 md:w-[52%] md:max-w-[260px]">
          <motion.div
            className="relative aspect-square w-full"
            {...(reduce ? {} : floatProps(5, 0, 14))}
          >
            {/* Dome outer */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 via-white/15 to-cyan-100/20 shadow-[0_24px_60px_rgba(139,92,246,0.25),inset_0_8px_24px_rgba(255,255,255,0.55),inset_0_-12px_32px_rgba(59,130,246,0.12)] backdrop-blur-md ring-[3px] ring-white/70" />
            {/* Inner glass highlight */}
            <div className="pointer-events-none absolute inset-[6%] rounded-full bg-gradient-to-br from-white/50 via-transparent to-fuchsia-400/15" />
            <div className="pointer-events-none absolute inset-x-[12%] top-[10%] h-[22%] rounded-full bg-white/35 blur-md" />

            {/* Content inside dome */}
            <div className="absolute inset-[14%] flex flex-col items-center justify-center rounded-full bg-gradient-to-b from-slate-900/5 to-indigo-950/10">
              <div className="relative mb-1 h-[42%] w-[42%] overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/80 p-1.5 shadow-[0_12px_32px_rgba(99,102,241,0.35)] ring-2 ring-white/60">
                <Image
                  src="/prizes/playstation5.png"
                  alt="PlayStation 5"
                  fill
                  className="object-contain object-center drop-shadow-md"
                  sizes="(max-width: 768px) 28vw, 120px"
                  priority
                />
              </div>
              <p className="mt-1 text-center text-[10px] font-black uppercase tracking-wider text-slate-700/90 md:text-xs">
                PlayStation
              </p>
              <p className="text-[9px] font-bold text-fuchsia-700/90 md:text-[10px]">
                ба супер шагналууд
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
