"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  clearUserSession,
  fetchUserMe,
  getUserToken,
  type UserProfile,
} from "@/lib/api";
import { UserAuthPanel } from "./UserAuthPanel";
import { SubmitReceiptForm } from "./SubmitReceiptForm";

export function SubmitReceiptSection() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getUserToken();
    if (!t) {
      setLoading(false);
      return;
    }
    fetchUserMe()
      .then(setUser)
      .catch(() => {
        clearUserSession();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="barimt" className="relative scroll-mt-24 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-center text-3xl font-extrabold text-slate-900 md:text-4xl"
        >
          Баримт оруулах
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-3 text-center text-lg font-semibold text-slate-600"
        >
          {user
            ? "Мэдээллээ бөглөөд НӨАТ-ын баримтын зургаа хавсаргана уу."
            : "Эхлээд нэвтэрнэ эсвэл шинээр бүртгүүлээд дараа нь баримтаа илгээнэ үү."}
        </motion.p>

        {loading ? (
          <p className="mt-12 text-center font-display text-lg font-bold text-fuchsia-600">
            Ачаалж байна...
          </p>
        ) : user ? (
          <SubmitReceiptForm user={user} onLogout={() => setUser(null)} />
        ) : (
          <UserAuthPanel onAuthenticated={setUser} />
        )}
      </div>
    </section>
  );
}
