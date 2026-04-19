"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { DRAW_PRIZE_OPTIONS } from "@/lib/constants";
import {
  fetchDrawPool,
  getAdminToken,
  type ApprovalTimeFilter,
  type DrawPoolItem,
  type Winner,
} from "@/lib/api";
import { AdminBrandLogo } from "@/components/admin/AdminBrandLogo";
import { SpinWheel } from "@/components/admin/SpinWheel";

function wheelSliceCount(p: DrawPoolItem): number {
  return Math.max(
    1,
    Math.floor(Number(p.lotteryEntries)) ||
      Math.floor(Number(p.productCount)) ||
      1
  );
}

export default function AdminDrawPage() {
  const router = useRouter();
  const [pool, setPool] = useState<DrawPoolItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [prizeName, setPrizeName] = useState<string>(DRAW_PRIZE_OPTIONS[0]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  const [timeFilterEnabled, setTimeFilterEnabled] = useState(false);
  const [filterDate, setFilterDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [filterFrom, setFilterFrom] = useState("04:20");
  const [filterTo, setFilterTo] = useState("04:30");

  const approvalFilter = useMemo((): ApprovalTimeFilter | null => {
    if (!timeFilterEnabled) return null;
    return { date: filterDate, from: filterFrom, to: filterTo };
  }, [timeFilterEnabled, filterDate, filterFrom, filterTo]);

  const loadPool = useCallback(async () => {
    if (!getAdminToken()) {
      router.replace("/admin");
      return;
    }
    setLoading(true);
    setBanner(null);
    try {
      const data = await fetchDrawPool(approvalFilter);
      setPool(data);
    } catch {
      setBanner("Сугалааны жагсаалт татаагүй байна.");
    } finally {
      setLoading(false);
    }
  }, [router, approvalFilter]);

  useEffect(() => {
    loadPool();
  }, [loadPool]);

  useEffect(() => {
    setSelected(new Set());
  }, [approvalFilter]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(pool.map((p) => p._id)));
  }

  function clearSel() {
    setSelected(new Set());
  }

  function onWinnerSaved(_w: Winner) {
    setBanner("Ялагч амжилттай бүртгэгдлээ. Нийтэд харагдах хэсэгт харагдана.");
    loadPool();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-fuchsia-50 to-amber-100">
      <header className="border-b-4 border-white bg-white/80 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 max-w-full flex-1 items-center gap-3 md:gap-4">
            <AdminBrandLogo />
            <h1 className="min-w-0 font-display text-xl font-black text-slate-900 md:text-2xl">
              Азын дугуй
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/users"
              className="rounded-xl border-2 border-violet-300 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-900"
            >
              Хэрэглэгчид
            </Link>
            <Link
              href="/admin/dashboard"
              className="rounded-xl border-2 border-slate-300 px-4 py-2 text-sm font-bold text-slate-800"
            >
              Баримтууд
            </Link>
            <Link
              href="/admin/winners"
              className="rounded-xl border-2 border-amber-400/80 bg-amber-50 px-4 py-2 text-sm font-extrabold text-amber-950"
            >
              Ялагчид
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white"
            >
              Сайт
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm font-semibold text-slate-600"
        >
          Зөвхөн баталгаажсан, мөн өмнө нь сугалаанд ялагч болоогүй оролцогчид харагдана. Нэг баримтын
          сугалааны эрх хэд байна, тэр хэмжээгээр дугуй дээр тусдаа хэсэг гарна (жишээ нь 3 эрх = 3
          хэсэг). Доорх цагийн завсраар зөвхөн тухайн хугацаанд баталгаажсан баримтуудыг сугалаанд
          оруулж болно. Хоосон бол дугуй ажиллахгүй.
        </motion.p>

        <div className="mt-6 rounded-2xl border-4 border-white bg-white/90 p-5 shadow-card backdrop-blur-md">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={timeFilterEnabled}
              onChange={(e) => setTimeFilterEnabled(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0"
            />
            <span>
              <span className="font-display text-base font-black text-slate-900">
                Баталгаажсан цагийн завсраар шүүх
              </span>
              <span className="mt-1 block text-sm font-semibold text-slate-600">
                Зөвхөн сонгосон өдөр, цагийн хооронд баталгаажсан баримтууд оролцоно. Цаг нь серверийн
                тохиргоонд байгаа завсарт (өгөгдмөлөөр UTC+8,{" "}
                <code className="rounded bg-slate-100 px-1 text-xs">DRAW_APPROVAL_TZ_OFFSET</code>
                ).
              </span>
            </span>
          </label>
          {timeFilterEnabled && (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="text-xs font-extrabold uppercase text-slate-500">Өдөр</span>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 font-bold text-slate-900"
                />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold uppercase text-slate-500">Эхлэх (цаг)</span>
                <input
                  type="time"
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 font-bold text-slate-900"
                />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold uppercase text-slate-500">Дуусах (цаг)</span>
                <input
                  type="time"
                  value={filterTo}
                  onChange={(e) => setFilterTo(e.target.value)}
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 font-bold text-slate-900"
                />
              </label>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl bg-white/80 p-6 shadow-card backdrop-blur-md">
          <label className="block font-bold text-slate-800">
            Шагнал
            <select
              value={prizeName}
              onChange={(e) => setPrizeName(e.target.value)}
              className="mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-semibold"
            >
              {DRAW_PRIZE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>

        {banner && (
          <p className="mt-4 rounded-xl bg-mint/40 px-4 py-3 text-center font-bold text-emerald-900">
            {banner}
          </p>
        )}

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="rounded-xl bg-violet-100 px-3 py-2 text-xs font-extrabold text-violet-900"
              >
                Бүгдийг сонгох
              </button>
              <button
                type="button"
                onClick={clearSel}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-extrabold text-slate-800"
              >
                Цэвэрлэх
              </button>
              <span className="text-xs font-bold text-slate-600 self-center">
                Сонгогдсон: {selected.size || "бүх баталгаажсан"}
              </span>
            </div>
            {loading ? (
              <p className="font-bold">Ачаалж байна...</p>
            ) : (
              <ul className="max-h-[420px] space-y-2 overflow-y-auto rounded-2xl border-4 border-white bg-white/70 p-3">
                {pool.map((p) => (
                  <li key={p._id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl p-2 hover:bg-amber-50">
                      <input
                        type="checkbox"
                        checked={selected.has(p._id)}
                        onChange={() => toggle(p._id)}
                        className="mt-1 h-4 w-4"
                      />
                      <span>
                        <span className="font-bold text-slate-900">{p.fullName}</span>
                        <span className="block text-xs font-semibold text-slate-600">
                          {p.phone} · {p.productName} · дугуй дээр{" "}
                          <span className="font-extrabold text-violet-700">
                            {wheelSliceCount(p)} эрх
                          </span>
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
                {pool.length === 0 && (
                  <li className="p-4 text-center font-bold text-slate-500">
                    {timeFilterEnabled
                      ? "Энэ цагийн завсарт баталгаажсан, мөн ялагч болоогүй оролцогч алга."
                      : "Оролцогч алга. Эхлээд хүсэлтүүдийг батална уу."}
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className="flex flex-col items-center rounded-3xl border-4 border-amber-200 bg-gradient-to-br from-white to-amber-50 p-6 shadow-card">
            <SpinWheel
              pool={pool}
              selectedIds={selected}
              prizeName={prizeName}
              approvalFilter={approvalFilter}
              onWinnerSaved={onWinnerSaved}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
