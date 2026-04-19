"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fetchWinners, type Winner } from "@/lib/api";
import { formatMongolianDate } from "@/lib/formatMongolianDate";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

export function WinnersSection() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    fetchWinners()
      .then((data) => {
        if (!cancelled) {
          setWinners(data.filter((w) => !w.winnerName.startsWith("__dummy__")));
        }
      })
      .catch(() => {
        if (!cancelled) setError("Ялагчдыг ачаалахад алдаа гарлаа.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayWinners =
    winners.length > 0
      ? winners
      : [];

  return (
    <section
      id="winners"
      className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 px-4 py-16 text-white md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.25),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={viewportOnce}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="font-display text-center text-3xl font-extrabold md:text-4xl"
        >
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
            Ялагчид
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="mx-auto mt-3 max-w-2xl text-center text-lg font-semibold text-purple-100"
        >
          Баяр хүргэе! Шинэ ялагчид энд харагдана — та ч гэсэн дараагийн азтан болох боломжтой!
        </motion.p>

        {loading && (
          <motion.p
            className="mt-10 text-center font-bold text-purple-200"
            animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            Ачаалж байна...
          </motion.p>
        )}
        {error && (
          <p className="mt-10 text-center font-bold text-rose-300">{error}</p>
        )}

        {!loading && !error && displayWinners.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-12 max-w-md rounded-3xl border-2 border-amber-400/50 bg-white/10 p-8 text-center backdrop-blur-md"
          >
            <p className="text-4xl">🎰</p>
            <p className="mt-4 font-display text-xl font-bold">Удахгүй энд ялагчид гарна!</p>
            <p className="mt-2 text-purple-100">Оролцоод шансаа нэмэгээрэй.</p>
          </motion.div>
        )}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayWinners.map((w) => (
            <motion.article
              key={w._id}
              variants={staggerItem}
              whileHover={{ scale: 1.04, y: -6 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="relative rounded-[1.75rem] border-2 border-amber-300/60 bg-gradient-to-br from-white/15 to-white/5 p-6 shadow-glow backdrop-blur-md"
            >
              <div className="absolute -right-2 -top-2 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-900">
                🏆 ЯЛАГЧ
              </div>
              <p className="font-display text-2xl font-black text-amber-200">{w.winnerName}</p>
              <p className="mt-3 text-sm font-bold text-purple-100">Шагнал:</p>
              <p className="font-bold text-white">{w.prizeName}</p>
              <p className="mt-2 text-xs font-semibold text-purple-200">
                Бүтээгдэхүүн: {w.productName}
              </p>
              <p className="mt-4 text-sm font-bold text-amber-100/90">
                📅 {formatMongolianDate(w.drawDate)}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
