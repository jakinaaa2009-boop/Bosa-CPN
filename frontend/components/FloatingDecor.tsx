"use client";

import { motion } from "framer-motion";

const blobs = [
  { className: "left-[5%] top-[12%] h-20 w-20 bg-bubblegum/70", delay: 0 },
  {
    className: "right-[8%] top-[20%] h-16 w-16 rounded-2xl bg-brandSky/80 rotate-12",
    delay: 0.3,
  },
  {
    className: "left-[15%] bottom-[15%] h-14 w-14 rounded-full bg-mint/80",
    delay: 0.6,
  },
  {
    className: "right-[20%] bottom-[25%] h-24 w-24 bg-lemon/90 rounded-full",
    delay: 0.2,
  },
  { className: "left-1/2 top-[8%] h-10 w-10 bg-grape/70 rounded-lg", delay: 0.4 },
];

export function FloatingDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {blobs.map((b, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full blur-[1px] shadow-lg ${b.className}`}
          initial={{ opacity: 0.6, y: 0 }}
          animate={{ y: [0, -14, 0], rotate: [0, 6, -4, 0], opacity: [0.55, 1, 0.55] }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
        />
      ))}
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          className="absolute text-xl"
          style={{
            left: `${(i * 17 + 7) % 92}%`,
            top: `${(i * 23 + 5) % 85}%`,
          }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.5 + (i % 3), repeat: Infinity, delay: i * 0.15 }}
        >
          {i % 3 === 0 ? "✦" : i % 3 === 1 ? "★" : "✧"}
        </motion.span>
      ))}
    </div>
  );
}
