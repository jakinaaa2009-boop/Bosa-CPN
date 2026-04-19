"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { deleteWinner, fetchWinners, getAdminToken, type Winner } from "@/lib/api";
import { formatMongolianDateTime } from "@/lib/formatMongolianDate";
import { AdminBrandLogo } from "@/components/admin/AdminBrandLogo";

export default function AdminWinnersPage() {
  const router = useRouter();
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!getAdminToken()) {
      router.replace("/admin");
      return;
    }
    setErr(null);
    try {
      const data = await fetchWinners();
      setWinners(data);
    } catch {
      setErr("Ялагчдын жагсаалт татаагүй. Дахин нэвтэрнэ үү.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  function logout() {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  }

  async function removeWinner(w: Winner) {
    if (
      !confirm(
        `Энэ ялагчийн бүртгэлийг устгах уу?\n${w.winnerName} · ${w.prizeName}\n(Нийтийн хуудаснаас хасагдана.)`
      )
    ) {
      return;
    }
    try {
      await deleteWinner(w._id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Алдаа");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900">
      <header className="sticky top-0 z-10 border-b-2 border-amber-400/30 bg-slate-900/95 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 max-w-full flex-1 items-center gap-3 md:gap-4">
            <AdminBrandLogo variant="dark" />
            <h1 className="min-w-0 font-display text-xl font-black text-amber-200 md:text-2xl">
              Админ — Ялагчдын жагсаалт
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/stats"
              className="rounded-xl border-2 border-sky-500/50 bg-sky-950/80 px-4 py-2 text-sm font-extrabold text-sky-200"
            >
              График
            </Link>
            <Link
              href="/admin/dashboard"
              className="rounded-xl border-2 border-slate-600 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-100"
            >
              Баримтууд
            </Link>
            <Link
              href="/admin/users"
              className="rounded-xl border-2 border-violet-500/50 bg-violet-950 px-4 py-2 text-sm font-bold text-violet-200"
            >
              Хэрэглэгчид
            </Link>
            <Link
              href="/admin/draw"
              className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-extrabold text-slate-900 shadow"
            >
              Сугалаа 🎡
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border-2 border-slate-600 px-4 py-2 text-sm font-bold text-slate-300"
            >
              Гарах
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm font-semibold text-purple-200/90">
          Сугалаагаар тодорсон бүх ялагчид (нийтэд харагдах хэсэгтэй ижил өгөгдөл).
        </p>
        <p className="mt-2 font-display text-2xl font-black text-amber-300">
          Нийт: {loading ? "…" : winners.length}
        </p>

        {loading && (
          <p className="mt-6 font-bold text-purple-200">Ачаалж байна...</p>
        )}
        {err && <p className="mt-6 font-bold text-rose-400">{err}</p>}

        {!loading && winners.length === 0 && (
          <p className="mt-8 rounded-2xl border-2 border-amber-500/40 bg-slate-800/50 p-6 text-center font-bold text-amber-100">
            Одоогоор бүртгэгдсэн ялагч алга. Сугалаа татсаны дараа энд харагдана.
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            winners.map((w, i) => (
              <motion.article
                key={w._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.35) }}
                className="rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-slate-800/90 to-violet-950/90 p-5 shadow-[0_0_24px_rgba(250,204,21,0.12)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-900">
                    🏆 ЯЛАГЧ
                  </span>
                  <span className="text-xs font-semibold text-purple-300">
                    {formatMongolianDateTime(w.drawDate)}
                  </span>
                </div>
                <p className="mt-4 font-display text-xl font-black text-amber-100">
                  {w.winnerName}
                </p>
                <p className="mt-1 text-sm font-bold text-purple-200">{w.phone}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-amber-400/90">
                  Шагнал
                </p>
                <p className="font-bold text-white">{w.prizeName}</p>
                <p className="mt-2 text-xs font-bold text-purple-300/90">
                  Бүтээгдэхүүн / дүн: {w.productName || "—"}
                </p>
                <button
                  type="button"
                  onClick={() => removeWinner(w)}
                  className="mt-4 w-full rounded-xl border-2 border-rose-500/60 bg-rose-950/50 py-2.5 text-sm font-extrabold text-rose-200 transition hover:bg-rose-900/60"
                >
                  Устгах
                </button>
              </motion.article>
            ))}
        </div>
      </main>
    </div>
  );
}
