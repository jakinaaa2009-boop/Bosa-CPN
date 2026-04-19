"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { loginAdmin } from "@/lib/api";
import { AdminBrandLogo } from "@/components/admin/AdminBrandLogo";

export default function AdminPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await loginAdmin(username, password);
      localStorage.setItem("admin_token", token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нэвтрэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-violet-300 via-fuchsia-200 to-amber-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border-4 border-white bg-white/90 p-8 shadow-card backdrop-blur-md"
      >
        <div className="mb-6 flex justify-center">
          <AdminBrandLogo />
        </div>
        <h1 className="font-display text-center text-2xl font-black text-slate-900">
          Админ нэвтрэх
        </h1>
        <p className="mt-2 text-center text-sm font-semibold text-slate-600">
          Зөвхөн удирдлагын эрхтэй хэрэглэгчдэд
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Хэрэглэгчийн нэр</span>
            <input
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="kid-input mt-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Нууц үг</span>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="kid-input mt-2"
            />
          </label>
          {error && (
            <p className="rounded-xl bg-rose-100 px-3 py-2 text-center text-sm font-bold text-rose-800">
              {error}
            </p>
          )}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            className="kid-btn-primary w-full py-3 disabled:opacity-60"
          >
            {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
          </motion.button>
        </form>
        <Link
          href="/"
          className="mt-6 block text-center text-sm font-bold text-violet-700 hover:underline"
        >
          ← Нүүр хуудас руу буцах
        </Link>
      </motion.div>
    </div>
  );
}
