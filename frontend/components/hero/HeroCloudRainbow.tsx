"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Dreamy cloud + rainbow backdrop for the campaign hero.
 * Sits behind content; decorative only.
 */
export function HeroCloudRainbow() {
  const reduce = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      aria-hidden
    >
      {/* Soft rainbow arc — SVG for smooth gradient stroke */}
      <svg
        className="absolute bottom-[-6%] left-1/2 w-[min(135%,920px)] max-w-none -translate-x-1/2 md:bottom-[-4%] md:w-[min(125%,1000px)]"
        viewBox="0 0 800 340"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="heroRainbowArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.85" />
            <stop offset="18%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="36%" stopColor="#bef264" stopOpacity="0.85" />
            <stop offset="54%" stopColor="#5eead4" stopOpacity="0.88" />
            <stop offset="72%" stopColor="#93c5fd" stopOpacity="0.9" />
            <stop offset="88%" stopColor="#c4b5fd" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f0abfc" stopOpacity="0.9" />
          </linearGradient>
          <filter id="heroRainbowArcBlur" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" />
          </filter>
        </defs>
        {/* Outer soft band */}
        <path
          d="M 30 310 Q 400 -40 770 310"
          fill="none"
          stroke="url(#heroRainbowArcGrad)"
          strokeWidth="72"
          strokeLinecap="round"
          opacity="0.28"
          filter="url(#heroRainbowArcBlur)"
        />
        {/* Inner brighter band */}
        <path
          d="M 70 295 Q 400 20 730 295"
          fill="none"
          stroke="url(#heroRainbowArcGrad)"
          strokeWidth="38"
          strokeLinecap="round"
          opacity="0.38"
        />
      </svg>

      {/* Ambient rainbow wash (extra dreamy depth) */}
      <div className="absolute -bottom-[25%] left-1/2 h-[min(75vmin,520px)] w-[min(130%,880px)] -translate-x-1/2 rounded-[100%] bg-gradient-to-r from-rose-200/25 via-amber-200/20 via-cyan-200/22 via-violet-200/25 to-fuchsia-200/25 blur-[48px] md:blur-[56px]" />

      {/* Fluffy clouds — layered puffs */}
      <motion.div
        className="absolute bottom-[2%] left-[-5%] h-28 w-44 rounded-full bg-white/55 blur-2xl md:bottom-[4%] md:h-36 md:w-56"
        animate={reduce ? undefined : { x: [0, 6, 0], opacity: [0.45, 0.6, 0.45] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[6%] left-[18%] h-20 w-36 rounded-full bg-white/50 blur-xl md:h-24 md:w-44"
        animate={reduce ? undefined : { x: [0, -5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[0%] left-[38%] h-24 w-40 rounded-full bg-gradient-to-r from-white/60 to-fuchsia-50/40 blur-2xl md:h-32 md:w-52"
        animate={reduce ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[4%] right-[12%] h-32 w-48 rounded-full bg-white/55 blur-2xl md:h-40 md:w-64"
        animate={reduce ? undefined : { x: [0, -8, 0], opacity: [0.5, 0.65, 0.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[8%] right-[-4%] h-24 w-40 rounded-full bg-sky-100/50 blur-xl md:h-28 md:w-48"
        animate={reduce ? undefined : { x: [0, 5, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Small cloud accents near rainbow */}
      <div className="absolute bottom-[18%] left-[28%] h-14 w-24 rounded-full bg-white/35 blur-lg" />
      <div className="absolute bottom-[20%] right-[30%] h-12 w-20 rounded-full bg-white/30 blur-lg" />
    </div>
  );
}
