"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PROMO_PRODUCTS, SUBMIT_PAGE_HREF } from "@/lib/constants";
import { FloatingDecor } from "./FloatingDecor";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-pink-200 via-amber-100 to-cyan-200 px-4 pb-20 pt-10 md:pb-28 md:pt-16"
    >
      <FloatingDecor />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-3 inline-block rounded-full bg-white/70 px-4 py-1 text-sm font-bold text-fuchsia-600 shadow-md"
          >
            🎉 2026 оны томоохон урамшуулал!
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:text-6xl"
          >
            Азын{" "}
            <span className="text-gradient">сугалааны</span>
            <br />
            кампанид оролцоорой!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-5 max-w-xl text-lg font-semibold text-slate-700"
          >
            Бүтээгдэхүүнээ аваад НӨАТ-ын баримтаа илгээнэ үү — PlayStation болон бусад
            супер шагналууд таныг хүлээж байна!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={SUBMIT_PAGE_HREF}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-orange-400 px-8 py-4 text-lg font-extrabold text-white shadow-card hover:brightness-110"
              >
                Баримт оруулах
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/#how"
                className="inline-flex items-center justify-center rounded-2xl border-4 border-white bg-white/60 px-8 py-4 text-lg font-extrabold text-slate-800 shadow-md backdrop-blur"
              >
                Оролцох 🎈
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-3 sm:gap-4"
        >
          {PROMO_PRODUCTS.map((p) => (
            <motion.div
              key={p.id}
              variants={item}
              whileHover={{ y: -8, rotate: [0, -2, 2, 0], transition: { duration: 0.4 } }}
              className={`group relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br ${p.accent} p-1 shadow-card`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] bg-white">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 33vw, 200px"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
