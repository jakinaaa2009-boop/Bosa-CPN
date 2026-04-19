"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  clearUserSession,
  fetchMySubmissions,
  mediaUrl,
  submitReceipt,
  type Submission,
  type UserProfile,
} from "@/lib/api";

type Props = {
  user: UserProfile;
  onLogout: () => void;
};

const RECEIPT_PLACEHOLDER = "AA00000000";

function formatReceiptInput(raw: string): string {
  const s = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const letters = (s.match(/^[A-Z]+/)?.[0] || "").slice(0, 2);
  const digits = s.slice(letters.length).replace(/\D/g, "").slice(0, 8);
  return letters + digits;
}

function isValidReceiptFormat(v: string): boolean {
  return /^[A-Za-z]{2}\d{8}$/.test(v);
}

function statusLabel(s: Submission["status"]): string {
  if (s === "approved") return "Баталгаажсан";
  if (s === "rejected") return "Татгалзсан";
  return "Хүлээгдэж буй";
}

export function SubmitReceiptForm({ user, onLogout }: Props) {
  const [receiptNumber, setReceiptNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const [mySubs, setMySubs] = useState<Submission[] | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [listErr, setListErr] = useState<string | null>(null);

  const loadMySubmissions = useCallback(async () => {
    setListLoading(true);
    setListErr(null);
    try {
      const data = await fetchMySubmissions();
      setMySubs(data);
    } catch (e) {
      setListErr(e instanceof Error ? e.message : "Алдаа");
      setMySubs([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  function toggleList() {
    if (!listOpen) {
      setListOpen(true);
      void loadMySubmissions();
    } else {
      setListOpen(false);
    }
  }

  function handleLogout() {
    clearUserSession();
    onLogout();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidReceiptFormat(receiptNumber)) {
      setStatus("error");
      setMessage(`Баримтын дугаар ${RECEIPT_PLACEHOLDER} хэлбэртэй байна (2 үсэг + 8 тоо).`);
      return;
    }
    if (!file) {
      setStatus("error");
      setMessage("Баримтын зургийг сонгоно уу.");
      return;
    }
    const amt = parseFloat(String(totalAmount).replace(/,/g, ""));
    if (Number.isNaN(amt) || amt <= 0) {
      setStatus("error");
      setMessage("Үнийн дүн зөв оруулна уу.");
      return;
    }
    setStatus("loading");
    setMessage("");
    const fd = new FormData();
    fd.append("receiptNumber", receiptNumber.toUpperCase());
    fd.append("totalAmount", String(amt));
    fd.append("receipt", file);
    try {
      const res = await submitReceipt(fd);
      setStatus("success");
      setMessage(res.message || "Амжилттай илгээгдлээ!");
      setReceiptNumber("");
      setTotalAmount("");
      setFile(null);
      if (listOpen) void loadMySubmissions();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Алдаа гарлаа.");
    }
  }

  return (
    <div className="mt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border-4 border-white bg-gradient-to-r from-cyan-100/80 to-fuchsia-100/80 p-4 shadow-md">
        <div className="text-sm font-bold text-slate-800">
          <p>
            <span className="text-fuchsia-700">Утас:</span> {user.phone}
          </p>
          {user.email ? (
            <p className="mt-1">
              <span className="text-fuchsia-700">И-мэйл:</span> {user.email}
            </p>
          ) : null}
          {user.age != null ? (
            <p className="mt-1">
              <span className="text-fuchsia-700">Нас:</span> {user.age}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            type="button"
            onClick={toggleList}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`rounded-full border-4 px-4 py-2 text-sm font-black shadow-sm ${
              listOpen
                ? "border-violet-400 bg-violet-100 text-violet-900"
                : "border-violet-200 bg-white text-violet-700 hover:bg-violet-50"
            }`}
          >
            Бүртгүүлсэн баримтууд
          </motion.button>
          <motion.button
            type="button"
            onClick={handleLogout}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full border-4 border-rose-200 bg-white px-4 py-2 text-sm font-black text-rose-600 shadow-sm hover:bg-rose-50"
          >
            Гарах
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {listOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden rounded-[1.5rem] border-4 border-violet-200 bg-white/95 shadow-md"
          >
            <div className="max-h-80 overflow-y-auto p-4">
              <p className="font-display text-lg font-black text-violet-800">
                Миний баримтууд
              </p>
              {listLoading && (
                <p className="mt-3 font-bold text-slate-600">Ачаалж байна...</p>
              )}
              {listErr && (
                <p className="mt-3 font-bold text-rose-600">{listErr}</p>
              )}
              {!listLoading && mySubs && mySubs.length === 0 && (
                <p className="mt-3 font-semibold text-slate-600">
                  Одоогоор бүртгэсэн баримт алга.
                </p>
              )}
              {!listLoading && mySubs && mySubs.length > 0 && (
                <ul className="mt-3 space-y-3">
                  {mySubs.map((s) => (
                    <li
                      key={s._id}
                      className="flex gap-3 rounded-2xl border-2 border-slate-100 bg-slate-50/80 p-3"
                    >
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                        <Image
                          src={mediaUrl(s.receiptImage)}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1 text-sm">
                        <p className="font-black text-slate-900">
                          {s.receiptNumber || "—"}
                        </p>
                        <p className="font-bold text-fuchsia-700">
                          {s.totalAmount != null
                            ? `${s.totalAmount.toLocaleString("mn-MN")}₮`
                            : "—"}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {statusLabel(s.status)} ·{" "}
                          {new Date(s.createdAt).toLocaleDateString("mn-MN")}
                        </p>
                        <a
                          href={mediaUrl(s.receiptImage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-xs font-bold text-violet-600 underline"
                        >
                          Зураг нээх
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onSubmit={handleSubmit}
        className="kid-card space-y-5 bg-gradient-to-br from-cyan-50 via-white to-pink-50 p-8 md:p-10"
      >
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Баримтын дугаар</span>
          <input
            required
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(formatReceiptInput(e.target.value))}
            className="kid-input mt-2 font-mono font-bold uppercase tracking-wider"
            placeholder={RECEIPT_PLACEHOLDER}
            maxLength={10}
            autoComplete="off"
          />
          <p className="mt-1.5 text-xs font-semibold text-slate-500">
            2 латин үсэг + 8 тоо, жишээ нь {RECEIPT_PLACEHOLDER}
          </p>
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Үнийн дүн (₮)</span>
          <input
            required
            type="number"
            min={1}
            step={1}
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="kid-input mt-2"
            placeholder="Жишээ: 25000"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-700">НӨАТ-ын баримтын зураг</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 w-full cursor-pointer rounded-2xl border-2 border-dashed border-fuchsia-300 bg-white/80 px-4 py-6 text-sm font-semibold file:mr-4 file:rounded-xl file:border-0 file:bg-fuchsia-500 file:px-4 file:py-2 file:font-bold file:text-white"
          />
        </label>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-2xl px-4 py-3 text-center font-bold ${
              status === "success"
                ? "bg-mint/30 text-emerald-800"
                : status === "error"
                  ? "bg-rose-100 text-rose-800"
                  : ""
            }`}
          >
            {message}
          </motion.p>
        )}

        <motion.button
          type="submit"
          disabled={status === "loading"}
          whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
          whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
          className="kid-btn-primary w-full py-4 text-lg disabled:opacity-60"
        >
          {status === "loading" ? "Илгээж байна..." : "Илгээх 🚀"}
        </motion.button>
      </motion.form>
    </div>
  );
}
