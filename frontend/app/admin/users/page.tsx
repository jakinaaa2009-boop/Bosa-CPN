"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  deleteAdminUser,
  fetchAdminUsers,
  getAdminToken,
  type PublicUser,
} from "@/lib/api";
import { AdminBrandLogo } from "@/components/admin/AdminBrandLogo";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!getAdminToken()) {
      router.replace("/admin");
      return;
    }
    setErr(null);
    try {
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch {
      setErr("Хэрэглэгчдийн жагсаалт татаагүй. Дахин нэвтэрнэ үү.");
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

  async function removeUser(u: PublicUser) {
    if (
      !confirm(
        `${u.phone} хэрэглэгчийг устгах уу? Түүний бүх баримтын илгээлт мөн устгагдана.`
      )
    ) {
      return;
    }
    try {
      await deleteAdminUser(u._id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Алдаа");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-violet-50">
      <header className="sticky top-0 z-10 border-b-2 border-white/80 bg-white/90 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 max-w-full flex-1 items-center gap-3 md:gap-4">
            <AdminBrandLogo />
            <h1 className="min-w-0 font-display text-xl font-black text-slate-900 md:text-2xl">
              Админ — Хэрэглэгчид
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
        <p className="text-sm font-semibold text-slate-600">
          Кампанид бүртгүүлсэн хэрэглэгчид (нууц үг харагдахгүй).
        </p>
        <p className="mt-1 font-display text-2xl font-black text-violet-800">
          Нийт: {loading ? "…" : users.length}
        </p>

        {loading && <p className="mt-6 font-bold text-slate-600">Ачаалж байна...</p>}
        {err && <p className="mt-6 font-bold text-rose-600">{err}</p>}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            users.map((u, i) => (
              <motion.article
                key={u._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="rounded-2xl border-4 border-white bg-white p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-xl"
                    aria-hidden
                  >
                    👤
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {new Date(u.createdAt).toLocaleString("mn-MN")}
                  </span>
                </div>
                <p className="mt-3 font-display text-lg font-black text-slate-900">
                  {u.phone}
                </p>
                {u.email ? (
                  <p className="mt-1 truncate text-sm font-semibold text-slate-600">
                    {u.email}
                  </p>
                ) : (
                  <p className="mt-1 text-sm font-semibold text-slate-400">И-мэйл байхгүй</p>
                )}
                <p className="mt-2 text-sm font-bold text-fuchsia-700">
                  Нас: {u.age != null ? u.age : "—"}
                </p>
                <p className="mt-2 font-mono text-[10px] text-slate-400">{u._id}</p>
                <button
                  type="button"
                  onClick={() => removeUser(u)}
                  className="mt-4 w-full rounded-xl border-2 border-rose-200 bg-rose-50 py-2.5 text-sm font-extrabold text-rose-700 transition hover:bg-rose-100"
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
