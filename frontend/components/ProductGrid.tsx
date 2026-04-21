"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PROMO_PRODUCTS } from "@/lib/constants";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

type Product = (typeof PROMO_PRODUCTS)[number];

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

function ProductCard({ p, index }: { p: Product; index: number }) {
  const showFeatured = Boolean((p as { featured?: boolean }).featured);
  const name = (p as { name?: string }).name ?? "Бүтээгдэхүүн";
  const category = (p as { category?: string }).category ?? "";
  const variants = (p as { variants?: string }).variants ?? "";
  const desc = (p as { desc?: string }).desc ?? "";
  const border = (p as { border?: string }).border ?? "border-slate-200";

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative h-full"
    >
      <div
        className={[
          "relative h-full overflow-hidden rounded-[1.85rem] border bg-white/70 p-1",
          border,
          "shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur",
          "transition-shadow duration-300 hover:shadow-[0_22px_75px_rgba(15,23,42,0.16)]",
        ].join(" ")}
      >
        <div
          className={[
            "relative flex h-full flex-col overflow-hidden rounded-[1.55rem] p-5",
            "bg-gradient-to-br from-white via-white to-slate-50/70",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            aria-hidden
            style={{
              background:
                "radial-gradient(700px 260px at 30% 0%, rgba(236,72,153,0.10), transparent 60%), radial-gradient(700px 260px at 85% 115%, rgba(56,189,248,0.10), transparent 60%)",
            }}
          />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              {showFeatured ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-black text-slate-800 ring-2 ring-amber-200 shadow-[0_12px_34px_rgba(15,23,42,0.10)]">
                  <span aria-hidden>✨</span> Шилдэг сонголт
                </div>
              ) : (
                <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1.5 text-xs font-extrabold text-slate-600 ring-1 ring-white/70">
                  #{String(index + 1).padStart(2, "0")}
                </span>
              )}

              <span
                className={[
                  "hidden h-2.5 w-2.5 rounded-full bg-gradient-to-r md:inline-block",
                  p.accent,
                ].join(" ")}
                aria-hidden
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.35 }}
              className={`relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br ${p.accent} p-[3px] shadow-[0_14px_40px_rgba(15,23,42,0.12)]`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-white">
                <Image
                  src={p.image}
                  alt={name}
                  fill
                  className="object-contain transition duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            </motion.div>
          </div>

          <div className="relative mt-5 flex flex-1 flex-col">
            <p className="font-display text-xl font-black text-slate-950">
              {name}
            </p>
            {category ? (
              <p className={`mt-1 text-sm font-extrabold text-slate-700`}>
                <span className={`bg-gradient-to-r ${p.accent} bg-clip-text text-transparent`}>
                  {category}
                </span>
              </p>
            ) : null}
            {variants ? (
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Variants: {variants}
              </p>
            ) : null}
            {desc ? (
              <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">
                {desc}
              </p>
            ) : null}

            <div className="mt-auto pt-5">
              <div
                className={`h-1.5 w-full rounded-full bg-gradient-to-r ${p.accent} opacity-70`}
                aria-hidden
              />
            </div>
          </div>

          <div
            className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/60 blur-[1px]"
            aria-hidden
          />
        </div>
      </div>
    </motion.article>
  );
}

export function ProductGrid() {
  return (
    <section
      id="products"
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

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-1.5 text-xs font-extrabold tracking-wide text-slate-800 shadow-[0_10px_30px_rgba(16,24,40,0.08)] backdrop-blur"
          >
            🎁 УРАМШУУЛАЛ
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="mt-5 font-display text-4xl font-black tracking-tight text-slate-950 md:text-5xl"
          >
            Урамшууллын бүтээгдэхүүнүүд
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="mx-auto mt-3 max-w-2xl text-base font-semibold text-slate-600 md:text-lg"
          >
            Эдгээр бүтээгдэхүүнээс сонгон худалдан авч урамшуулалд оролцоорой!
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PROMO_PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.06, duration: 0.45 }}
          className="mx-auto mt-10 max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-[1.85rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur md:p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_260px_at_30%_0%,rgba(56,189,248,0.18),transparent_65%),radial-gradient(700px_260px_at_80%_110%,rgba(236,72,153,0.16),transparent_65%)]"
            />
            <div className="relative flex items-start gap-4 md:items-center">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-200 to-amber-100 ring-1 ring-white/70 shadow-[0_14px_40px_rgba(15,23,42,0.10)]">
                <span className="text-2xl" role="img" aria-hidden>
                  🎁
                </span>
              </div>
              <p className="text-sm font-bold leading-relaxed text-slate-800 md:text-base">
                Эдгээр бүтээгдэхүүнээс худалдан авалт хийж, баримтаа бүртгүүлээд
                гайхалтай шагналуудын эзэн болоорой!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
