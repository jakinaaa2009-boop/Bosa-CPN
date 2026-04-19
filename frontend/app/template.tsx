"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/lib/motion";

/** Runs on every client navigation — subtle page enter without layout shift. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="w-full"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : 0.4,
        ease: easeOut,
      }}
    >
      {children}
    </motion.div>
  );
}
