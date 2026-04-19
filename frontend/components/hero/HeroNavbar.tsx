"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SUBMIT_PAGE_HREF } from "@/lib/constants";

const CENTER_LINKS = [
  { href: "/#how", label: "Хэрхэн оролцох вэ?" },
  { href: "/#prizes", label: "Шагналууд" },
  { href: "/#winners", label: "Ялагчид" },
  { href: "/#products", label: "Урамшууллын бүтээгдэхүүнүүд" },
] as const;

export function HeroNavbar() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <motion.nav
      initial={reduceMotion ? false : { opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-30 mx-auto w-full max-w-6xl px-3 pt-4 md:px-5 md:pt-6"
      aria-label="Үндсэн навигаци"
    >
      <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3 py-2.5 shadow-[0_8px_40px_rgba(139,92,246,0.12),0_2px_0_rgba(255,255,255,0.95)_inset,0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl md:gap-3 md:px-5 md:py-3">
        {/* Logo */}
        <Link
          href="/#home"
          className="group flex shrink-0 items-center gap-2 rounded-2xl bg-white/75 px-2 py-1.5 shadow-sm ring-1 ring-white/90 transition hover:bg-white md:gap-2.5 md:px-3"
        >
          <span className="relative h-8 w-[min(36vw,140px)] sm:h-9 md:h-10 md:w-[min(32vw,160px)]">
            <Image
              src="/logo1.png"
              alt="Лого"
              fill
              className="object-contain object-left"
              sizes="160px"
              priority
            />
          </span>
          <span className="relative hidden h-7 w-[min(20vw,80px)] sm:block md:h-8 md:w-[min(18vw,88px)]">
            <Image
              src="/logo2.png"
              alt="Кампанийн лого"
              fill
              className="object-contain object-left"
              sizes="88px"
              priority
            />
          </span>
        </Link>

        {/* Center — desktop */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1">
          {CENTER_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-2.5 py-2 text-[11px] font-extrabold text-slate-700/95 transition hover:bg-white/80 hover:text-fuchsia-700 xl:px-3.5 xl:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={SUBMIT_PAGE_HREF}
              className="relative block overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 via-orange-400 to-amber-300 px-4 py-2.5 text-center text-[11px] font-black text-white shadow-[0_4px_0_rgb(160,50,110),0_12px_32px_rgba(236,72,153,0.42)] ring-2 ring-white/45 transition hover:shadow-[0_4px_0_rgb(160,50,110),0_12px_36px_rgba(236,72,153,0.55),0_0_28px_rgba(250,204,21,0.55)] md:px-5 md:text-sm"
            >
              Баримт оруулах
            </Link>
          </motion.div>

          <button
            type="button"
            className="flex shrink-0 items-center rounded-full border border-white/80 bg-white/70 px-3 py-2 text-sm font-black text-fuchsia-800 shadow-sm lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Цэс"
          >
            ☰
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-lg backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 p-3">
              {CENTER_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-center text-sm font-extrabold text-slate-800 hover:bg-fuchsia-50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={SUBMIT_PAGE_HREF}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-orange-400 py-3 text-center text-sm font-black text-white"
                onClick={() => setOpen(false)}
              >
                Баримт оруулах
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
