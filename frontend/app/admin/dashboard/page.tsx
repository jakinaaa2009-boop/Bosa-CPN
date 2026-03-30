"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  getAdminToken,
  mediaUrl,
  type Submission,
} from "@/lib/api";
import { AdminBrandLogo } from "@/components/admin/AdminBrandLogo";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [subs, setSubs] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [preview, setPreview] = useState<Submission | null>(null);

  const load = useCallback(async () => {
    if (!getAdminToken()) {
      router.replace("/admin");
      return;
    }
    setErr(null);
    try {
      const data = await fetchSubmissions(filter || undefined);
      setSubs(data);
    } catch {
      setErr("Өгөгдөл татаж чадсангүй. Дахин нэвтэрнэ үү.");
    } finally {
      setLoading(false);
    }
  }, [filter, router]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!preview) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPreview(null);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [preview]);

  function logout() {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  }

  async function setStatus(id: string, status: Submission["status"]) {
    await updateSubmissionStatus(id, status);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Устгахдаа итгэлтэй байна уу?")) return;
    await deleteSubmission(id);
    load();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-violet-50 to-amber-50">
      <header className="sticky top-0 z-10 border-b-2 border-white/80 bg-white/90 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 max-w-full flex-1 items-center gap-3 md:gap-4">
            <AdminBrandLogo />
            <h1 className="min-w-0 font-display text-xl font-black text-slate-900 md:text-2xl">
              Админ — Илгээлтүүд
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
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
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-700">Шүүлт:</span>
          {["", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f || "all"}
              type="button"
              onClick={() => {
                setLoading(true);
                setFilter(f);
              }}
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                filter === f
                  ? "bg-violet-600 text-white shadow"
                  : "bg-white text-slate-700 border-2 border-slate-200"
              }`}
            >
              {f === ""
                ? "Бүгд"
                : f === "pending"
                  ? "Хүлээгдэж буй"
                  : f === "approved"
                    ? "Баталгаажсан"
                    : "Татгалзсан"}
            </button>
          ))}
        </div>

        {loading && <p className="font-bold text-slate-600">Ачаалж байна...</p>}
        {err && <p className="font-bold text-rose-600">{err}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          {!loading &&
            subs.map((s) => (
              <motion.article
                key={s._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border-4 border-white bg-white p-4 shadow-card"
              >
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPreview(s)}
                    className="group relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 text-left ring-2 ring-transparent transition hover:ring-violet-400 focus:outline-none focus:ring-violet-500"
                    title="Зураг томоор харах"
                  >
                    <Image
                      src={mediaUrl(s.receiptImage)}
                      alt="Баримт"
                      fill
                      className="object-cover transition group-hover:brightness-95"
                      unoptimized={
                        s.receiptImage.startsWith("http") ||
                        process.env.NODE_ENV === "development"
                      }
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent py-1 text-center text-[10px] font-bold text-white">
                      Томруулах
                    </span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-bold text-slate-900">
                      {s.receiptNumber ||
                        (s.fullName?.trim() ? s.fullName : null) ||
                        "—"}
                    </p>
                    <p className="text-sm font-semibold text-slate-600">{s.phone}</p>
                    {s.email && (
                      <p className="truncate text-xs text-slate-500">{s.email}</p>
                    )}
                    <p className="mt-1 text-sm font-bold text-fuchsia-700">
                      {s.totalAmount != null
                        ? `${s.totalAmount.toLocaleString("mn-MN")}₮`
                        : s.productName || "—"}
                    </p>
                    <p
                      className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-black ${
                        s.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : s.status === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {s.status}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPreview(s)}
                    className={`rounded-xl px-3 py-2 text-xs font-extrabold shadow-sm ${
                      s.status === "pending"
                        ? "bg-amber-400 text-amber-950 ring-2 ring-amber-600/30 hover:bg-amber-300"
                        : "border-2 border-violet-200 bg-violet-50 text-violet-900 hover:bg-violet-100"
                    }`}
                  >
                    {s.status === "pending"
                      ? "🔍 Зураг шалгах"
                      : "Зураг харах"}
                  </button>
                  {s.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => setStatus(s._id, "approved")}
                      className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-extrabold text-white"
                    >
                      Батлах
                    </button>
                  )}
                  {s.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => setStatus(s._id, "rejected")}
                      className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-extrabold text-white"
                    >
                      Татгалзах
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(s._id)}
                    className="rounded-xl border-2 border-slate-300 px-3 py-2 text-xs font-extrabold text-slate-700"
                  >
                    Устгах
                  </button>
                </div>
              </motion.article>
            ))}
        </div>
      </main>

      <AnimatePresence>
        {preview && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="receipt-preview-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 sm:p-6"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                  <h2
                    id="receipt-preview-title"
                    className="font-display text-lg font-black text-slate-900"
                  >
                    Баримтын зураг
                  </h2>
                  <p className="text-sm font-semibold text-slate-600">
                    {preview.receiptNumber || "—"} ·{" "}
                    {preview.totalAmount != null
                      ? `${preview.totalAmount.toLocaleString("mn-MN")}₮`
                      : "—"}{" "}
                    · {preview.phone}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="shrink-0 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-100"
                >
                  Хаах ✕
                </button>
              </div>

              {preview.status === "pending" && (
                <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950">
                  <span className="mr-1">⚠️</span>
                  Хүлээгдэж буй: зургийг томоор үзээд НӨАТ-ын баримт, дүн, дугаар зөв эсэхийг
                  шалгана уу. Зөв бол «Батлах», буруу бол «Татгалзах» дарна уу.
                </div>
              )}

              <div className="relative h-[min(72vh,720px)] w-full bg-slate-900/5">
                <Image
                  src={mediaUrl(preview.receiptImage)}
                  alt="Баримтын бүтэн зураг"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 896px) 100vw, 896px"
                  unoptimized={
                    preview.receiptImage.startsWith("http") ||
                    process.env.NODE_ENV === "development"
                  }
                />
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3">
                {preview.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatus(preview._id, "approved");
                      setPreview(null);
                    }}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-extrabold text-white"
                  >
                    Батлах
                  </button>
                )}
                {preview.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatus(preview._id, "rejected");
                      setPreview(null);
                    }}
                    className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-extrabold text-white"
                  >
                    Татгалзах
                  </button>
                )}
                <a
                  href={mediaUrl(preview.receiptImage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-extrabold text-slate-800"
                >
                  Шинэ цонхонд нээх
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
