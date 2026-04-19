"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PROMO_PRODUCTS } from "@/lib/constants";
import { viewportOnce } from "@/lib/motion";

export function ProductGrid() {
  return (
    <section id="products" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
          className="font-display text-center text-3xl font-extrabold text-slate-900 md:text-4xl"
        >
          Урамшууллын бүтээгдэхүүнүүд
        </motion.h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROMO_PRODUCTS.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 28, rotate: -1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 6) * 0.06, type: "spring", stiffness: 210, damping: 22 }}
              whileHover={{ y: -10, rotate: i % 2 === 0 ? 1.2 : -1.2 }}
              className={`group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${p.accent} p-[3px] shadow-card`}
            >
              <div className="flex h-full flex-col rounded-[1.65rem] bg-white p-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110 group-hover:rotate-1"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
