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
  const [exporting, setExporting] = useState(false);

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

  async function downloadExcel() {
    if (!stats || exporting) return;
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();

      const summaryRows = [
        { metric: "Total users", value: stats.totalUsers },
        { metric: "Total companies", value: stats.totalCompanies },
        { metric: "Total individuals", value: stats.totalIndividuals },
        { metric: "Generated at", value: new Date().toISOString() },
      ];
      const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

      const wsRegs = XLSX.utils.json_to_sheet(stats.registrationsByDay, {
        header: ["date", "count"],
      });
      XLSX.utils.book_append_sheet(wb, wsRegs, "RegistrationsByDay");

      const wsAge = XLSX.utils.json_to_sheet(stats.ageDistribution, {
        header: ["label", "count"],
      });
      XLSX.utils.book_append_sheet(wb, wsAge, "AgeDistribution");

      const pad2 = (n: number) => String(n).padStart(2, "0");
      const d = new Date();
      const fileName = `stats-${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (e) {
      console.error(e);
      setErr("Excel файл үүсгэж чадсангүй. Дахин оролдоно уу.");
    } finally {
      setExporting(false);
    }
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
            <button
              type="button"
              onClick={downloadExcel}
              disabled={!stats || loading || exporting}
              className="rounded-xl border-2 border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-extrabold text-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
              title="Excel татах"
            >
              {exporting ? "Excel бэлдэж байна..." : "Excel татах"}
            </button>
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
