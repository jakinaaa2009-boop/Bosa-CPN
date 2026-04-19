"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ApiAuthError,
  loginUser,
  registerUser,
  setUserToken,
  type AccountType,
  type UserProfile,
} from "@/lib/api";

type Tab = "login" | "register";

type Props = {
  onAuthenticated: (user: UserProfile) => void;
};

export function UserAuthPanel({ onAuthenticated }: Props) {
  const [tab, setTab] = useState<Tab>("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await loginUser(phone, password);
      setUserToken(token);
      onAuthenticated(user);
    } catch (err) {
      if (err instanceof ApiAuthError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Алдаа гарлаа");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (accountType === "company" && companyName.trim().length < 2) {
      setError("Компанийн нэрийг оруулна уу (хамгийн багадаа 2 тэмдэгт).");
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await registerUser({
        phone,
        password,
        email: email.trim() || undefined,
        age: age.trim() || undefined,
        accountType,
        companyName:
          accountType === "company" ? companyName.trim() : undefined,
      });
      setUserToken(token);
      onAuthenticated(user);
    } catch (err) {
      if (err instanceof ApiAuthError && err.status === 409) {
        setTab("login");
        setError(
          "Энэ утасны дугаар аль хэдийн бүртгэлтэй. «Нэвтрэх» таб дээр нууц үгээ оруулж орно уу."
        );
      } else if (err instanceof ApiAuthError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Алдаа гарлаа");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "kid-input mt-2 px-4 py-3.5 font-bold";
  const labelClass = "text-sm font-extrabold text-slate-800";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="kid-card mx-auto mt-8 max-w-lg overflow-hidden bg-gradient-to-br from-pink-50 via-white to-amber-50 p-6 md:p-8"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border-4 border-amber-200 bg-white/90 px-4 py-2 text-sm font-extrabold text-fuchsia-700 shadow-sm transition hover:bg-amber-100"
      >
        ← Нүүр хуудас
      </Link>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-[1.5rem] bg-white/70 p-1.5 shadow-inner ring-2 ring-fuchsia-100">
        <button
          type="button"
          onClick={() => {
            setTab("login");
            setError(null);
          }}
          className={`relative rounded-2xl py-3 text-sm font-black transition md:text-base ${
            tab === "login"
              ? "bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white shadow-md"
              : "text-slate-600 hover:bg-white/80"
          }`}
        >
          Нэвтрэх
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("register");
            setError(null);
          }}
          className={`relative rounded-2xl py-3 text-sm font-black transition md:text-base ${
            tab === "register"
              ? "bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-md"
              : "text-slate-600 hover:bg-white/80"
          }`}
        >
          Бүртгүүлэх
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === "login" ? (
          <motion.form
            key="login"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >
            <label className="block">
              <span className={labelClass}>Утасны дугаар</span>
              <input
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="99119999"
              />
            </label>
            <label className="block">
              <span className={labelClass}>Нууц үг</span>
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </label>
            {error && (
              <p className="rounded-2xl bg-rose-100 px-4 py-3 text-center text-sm font-bold text-rose-800">
                {error}
              </p>
            )}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="kid-btn-primary w-full py-4 text-lg disabled:opacity-60"
            >
              {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх 🎉"}
            </motion.button>
          </motion.form>
        ) : (
          <motion.form
            key="register"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleRegister}
            className="mt-8 space-y-4"
          >
            <div>
              <span className={labelClass}>Бүртгэлийн төрөл</span>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-[1.25rem] bg-white/70 p-1.5 shadow-inner ring-2 ring-fuchsia-100">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("individual");
                    setCompanyName("");
                    setError(null);
                  }}
                  className={`rounded-2xl py-3 text-sm font-black transition md:text-base ${
                    accountType === "individual"
                      ? "bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white shadow-md"
                      : "text-slate-600 hover:bg-white/80"
                  }`}
                >
                  Хэрэглэгч
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("company");
                    setError(null);
                  }}
                  className={`rounded-2xl py-3 text-sm font-black transition md:text-base ${
                    accountType === "company"
                      ? "bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-md"
                      : "text-slate-600 hover:bg-white/80"
                  }`}
                >
                  Компани
                </button>
              </div>
            </div>
            {accountType === "company" && (
              <label className="block">
                <span className={labelClass}>Компанийн нэр</span>
                <input
                  required
                  type="text"
                  autoComplete="organization"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputClass}
                  placeholder="Жишээ: Монгол ХХК"
                />
              </label>
            )}
            <label className="block">
              <span className={labelClass}>Утасны дугаар (хэрэглэгчийн нэр)</span>
              <input
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="99119999"
              />
            </label>
            <label className="block">
              <span className={labelClass}>И-мэйл</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Нас</span>
              <input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={inputClass}
                placeholder="Жишээ: 25"
              />
            </label>
            <label className="block">
              <span className={labelClass}>Нууц үг</span>
              <input
                required
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
              <p className="mt-1.5 text-xs font-bold text-slate-500">Хамгийн багадаа 6 тэмдэгт</p>
            </label>
            {error && (
              <p className="rounded-2xl bg-rose-100 px-4 py-3 text-center text-sm font-bold text-rose-800">
                {error}
              </p>
            )}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="kid-btn-primary w-full py-4 text-lg disabled:opacity-60"
            >
              {loading ? "Түр хүлээнэ үү..." : "Бүртгүүлэх ✨"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
