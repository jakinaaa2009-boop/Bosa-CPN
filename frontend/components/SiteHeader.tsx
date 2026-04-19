"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { NAV_LINKS, SUBMIT_PAGE_HREF } from "@/lib/constants";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const mainLinks = NAV_LINKS.filter((l) => l.href !== SUBMIT_PAGE_HREF);
  const cta = NAV_LINKS.find((l) => l.href === SUBMIT_PAGE_HREF);

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] border-4 border-white/90 bg-gradient-to-r from-pink-200/95 via-amber-100/95 to-cyan-200/95 backdrop-blur-md md:rounded-[2rem] [box-shadow:0_12px_40px_rgba(236,72,153,0.2),inset_0_2px_0_rgba(255,255,255,0.9),0_4px_0_rgba(255,255,255,0.5)]">
        <div className="flex items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 md:px-5">
          {/* Logos — shared height, proportional widths */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2 rounded-2xl bg-white/70 px-2.5 py-1.5 shadow-md ring-2 ring-white/90 transition hover:bg-white hover:shadow-lg sm:gap-3 sm:px-3 sm:py-2"
          >
            <motion.span
              className="relative h-9 w-[min(38vw,150px)] sm:h-11 sm:w-[min(34vw,170px)]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src="/logo1.png"
                alt="Лого"
                fill
                className="object-contain object-left"
                sizes="170px"
                priority
              />
            </motion.span>
            <span
              className="hidden h-8 w-px shrink-0 bg-gradient-to-b from-fuchsia-300 to-amber-300 sm:block"
              aria-hidden
            />
            <motion.span
              className="relative h-8 w-[min(22vw,88px)] sm:h-10 sm:w-[min(20vw,96px)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src="/logo2.png"
                alt="Кампанийн лого"
                fill
                className="object-contain object-left"
                sizes="96px"
                priority
              />
            </motion.span>
          </Link>

          {/* Desktop nav — one row: scroll if narrow, never wrap */}
          <nav
            className="ml-auto hidden min-h-[44px] min-w-0 flex-1 items-center justify-end gap-1 lg:flex"
            aria-label="Үндсэн цэс"
          >
            <div className="flex max-w-full flex-nowrap items-center justify-end gap-1 overflow-x-auto overscroll-x-contain py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden xl:gap-1.5">
              {mainLinks.map((item) => (
                <motion.div
                  key={item.href}
                  className="shrink-0"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.href}
                    className="block whitespace-nowrap rounded-full bg-white/45 px-2.5 py-2 text-[11px] font-extrabold text-slate-800 shadow-[0_2px_0_rgba(255,255,255,0.65)] ring-1 ring-white/80 transition hover:bg-white hover:text-fuchsia-700 hover:shadow-md hover:ring-fuchsia-200/60 xl:px-3.5 xl:text-sm"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            {cta && (
              <motion.div
                className="ml-2 shrink-0"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97, y: 0 }}
              >
                <Link
                  href={cta.href}
                  className="idle-float block whitespace-nowrap rounded-full bg-gradient-to-r from-fuchsia-500 via-orange-400 to-amber-400 px-4 py-2.5 text-center text-[11px] font-black text-white shadow-[0_4px_0_rgb(180,50,120),0_8px_24px_rgba(236,72,153,0.45)] ring-2 ring-white/50 transition hover:brightness-110 xl:px-5 xl:text-sm"
                >
                  📸 {cta.label}
                </Link>
              </motion.div>
            )}
          </nav>

          <button
            type="button"
            className="ml-auto flex shrink-0 items-center gap-2 rounded-2xl border-2 border-white/90 bg-white/60 px-3 py-2 text-sm font-black text-fuchsia-800 shadow-md lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Цэс нээх"
          >
            <span className="text-lg">☰</span>
            <span>Цэс</span>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t-2 border-white/70 bg-gradient-to-b from-white/50 to-amber-50/80 lg:hidden"
            >
              <div className="flex flex-col gap-2 px-4 py-4">
                {mainLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl bg-white/80 px-4 py-3 text-center text-sm font-extrabold text-slate-800 shadow-sm ring-2 ring-fuchsia-100 hover:bg-fuchsia-50"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {cta && (
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      href={cta.href}
                      className="block rounded-2xl bg-gradient-to-r from-fuchsia-500 to-orange-400 px-4 py-4 text-center text-base font-black text-white shadow-lg"
                      onClick={() => setOpen(false)}
                    >
                      📸 {cta.label}
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
