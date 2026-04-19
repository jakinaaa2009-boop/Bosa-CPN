"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchAdminStats, getAdminToken, type AdminStats } from "@/lib/api";
import { AdminBrandLogo } from "@/components/admin/AdminBrandLogo";
import { AdminStatsCharts } from "@/components/admin/AdminStatsCharts";

export default function AdminStatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!getAdminToken()) {
      router.replace("/admin");
      return;
    }
    setErr(null);
    try {
      const data = await fetchAdminStats();
      setStats(data);
    } catch {
      setErr("Статистик татаж чадсангүй. Дахин нэвтэрнэ үү.");
      setStats(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-violet-50 to-amber-50">
      <header className="sticky top-0 z-10 border-b-2 border-white/80 bg-white/90 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 max-w-full flex-1 items-center gap-3 md:gap-4">
            <AdminBrandLogo />
            <h1 className="min-w-0 font-display text-xl font-black text-slate-900 md:text-2xl">
              Админ — График
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/dashboard"
              className="rounded-xl border-2 border-slate-300 px-4 py-2 text-sm font-bold text-slate-800"
            >
              Баримтууд
            </Link>
            <Link
              href="/admin/users"
              className="rounded-xl border-2 border-violet-300 bg-violet-50 px-4 py-2 text-sm font-extrabold text-violet-900"
            >
              Хэрэглэгчид
            </Link>
            <Link
              href="/admin/winners"
              className="rounded-xl border-2 border-amber-400/80 bg-amber-50 px-4 py-2 text-sm font-extrabold text-amber-950"
            >
              Ялагчид
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
              className="rounded-xl border-2 border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"
            >
              Гарах
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 text-center text-sm font-semibold text-slate-600"
        >
          Бүртгэлийн тренд болон насны хуваарилалт — сүүлийн өгөгдлөөр шинэчлэгдэнэ.
        </motion.p>

        {loading && <p className="font-bold text-slate-600">Ачаалж байна...</p>}
        {err && <p className="font-bold text-rose-600">{err}</p>}

        {!loading && stats && <AdminStatsCharts stats={stats} />}
      </main>
    </div>
  );
}
