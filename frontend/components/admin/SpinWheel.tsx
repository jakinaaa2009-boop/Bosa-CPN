"use client";

import { useMemo, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import {
  spinDraw,
  type ApprovalDateRangeFilter,
  type DrawPoolItem,
  type Winner,
} from "@/lib/api";

type Props = {
  pool: DrawPoolItem[];
  selectedIds: Set<string>;
  prizeName: string;
  /** Same filter as pool fetch; omit or null = all approved (any day). */
  approvalFilter?: ApprovalDateRangeFilter | null;
  onWinnerSaved: (w: Winner) => void;
  /** Called when admin clears the winner panel (e.g. reload pool). */
  onRefreshPool?: () => void;
};

/** Matches backend `entryWeight` / pool JSON: at least one slice per submission. */
function segmentCount(p: DrawPoolItem): number {
  return Math.max(
    1,
    Math.floor(Number(p.lotteryEntries)) ||
      Math.floor(Number(p.productCount)) ||
      1
  );
}

/**
 * One wheel slice per lottery entry — e.g. 3 entries ⇒ 3 segments for that receipt.
 */
function expandPoolForWheel(items: DrawPoolItem[]): { item: DrawPoolItem; key: string }[] {
  const out: { item: DrawPoolItem; key: string }[] = [];
  for (const p of items) {
    const w = segmentCount(p);
    for (let i = 0; i < w; i++) {
      out.push({ item: p, key: `${p._id}:${i}` });
    }
  }
  return out;
}

function shortLabel(name: string, max = 14) {
  if (name.length <= max) return name;
  return `${name.slice(0, max)}…`;
}

export function SpinWheel({
  pool,
  selectedIds,
  prizeName,
  approvalFilter,
  onWinnerSaved,
  onRefreshPool,
}: Props) {
  const rotation = useMotionValue(0);
  const [spinning, setSpinning] = useState(false);
  const [lastWinner, setLastWinner] = useState<Winner | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredPool = useMemo(() => {
    if (selectedIds.size === 0) return pool;
    return pool.filter((p) => selectedIds.has(p._id));
  }, [pool, selectedIds]);

  const wheelSegments = useMemo(
    () => expandPoolForWheel(filteredPool),
    [filteredPool]
  );

  const n = wheelSegments.length;
  const segment = n > 0 ? 360 / n : 0;

  async function handleSpin() {
    setError(null);
    if (!prizeName.trim()) {
      setError("Эхлээд шагналаа сонгоно уу.");
      return;
    }
    if (n < 1) {
      setError("Дугуйнд харуулах оролцогч алга. Баталгаажсан илгээлт байгаа эсэхийг шалгана уу.");
      return;
    }

    setSpinning(true);
    setLastWinner(null);

    const idsArg =
      selectedIds.size > 0
        ? [...new Set(wheelSegments.map((s) => s.item._id))]
        : undefined;

    let winner: Winner;
    try {
      winner = await spinDraw(prizeName.trim(), idsArg, approvalFilter ?? null);
    } catch (e) {
      setSpinning(false);
      setError(e instanceof Error ? e.message : "Сугалаа ажиллуулахад алдаа гарлаа");
      return;
    }

    const winId = String(winner.submissionId ?? "");
    const matchingIdx = wheelSegments
      .map((s, i) => (String(s.item._id) === winId ? i : -1))
      .filter((i) => i >= 0);
    const targetIndex =
      matchingIdx.length > 0
        ? matchingIdx[Math.floor(Math.random() * matchingIdx.length)]
        : 0;

    const sliceCenterDeg = (targetIndex + 0.5) * segment;
    const goalRotation = -sliceCenterDeg;
    const goalNorm = ((goalRotation % 360) + 360) % 360;
    const current = rotation.get();
    const currentNorm = ((current % 360) + 360) % 360;
    let delta = goalNorm - currentNorm;
    if (delta < 0) delta += 360;
    const spins = 5 * 360 + delta;

    await animate(rotation, current + spins, {
      duration: 5.5,
      ease: [0.15, 0.85, 0.2, 1],
    });

    setLastWinner(winner);
    onWinnerSaved(winner);
    setSpinning(false);
  }

  if (n === 0) {
    return (
      <div className="rounded-2xl bg-amber-50 p-6 text-center font-bold text-amber-900">
        Сугалаанд оруулах баталгаажсан оролцогч олдсонгүй. Эсвэл бүгдийг сонгоогүй байна.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-72 w-72 sm:h-80 sm:w-80">
        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-2 text-4xl drop-shadow-lg">
          ▼
        </div>
        <motion.div
          className="relative h-full w-full rounded-full border-8 border-amber-300 shadow-glow"
          style={{
            rotate: rotation,
            background: `conic-gradient(${wheelSegments
              .map((_, i) => {
                const hues = [330, 280, 200, 140, 45, 15, 260, 320, 180];
                const h = hues[i % hues.length];
                return `hsl(${h} 85% 65%) ${(i / n) * 100}% ${((i + 1) / n) * 100}%`;
              })
              .join(", ")})`,
          }}
        >
          {wheelSegments.map((seg, i) => {
            const ang = (i + 0.5) * segment - 90;
            const rad = (ang * Math.PI) / 180;
            const r = 32;
            const x = 50 + r * Math.cos(rad);
            const y = 50 + r * Math.sin(rad);
            const p = seg.item;
            return (
              <span
                key={seg.key}
                className="pointer-events-none absolute text-[10px] font-black uppercase leading-tight text-white drop-shadow-md sm:text-xs"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%) rotate(0deg)",
                  maxWidth: "38%",
                  textAlign: "center",
                }}
              >
                {shortLabel(p.fullName)}
              </span>
            );
          })}
        </motion.div>
        <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.15)]" />
      </div>

      {error && (
        <p className="max-w-md rounded-xl bg-rose-100 px-4 py-2 text-center text-sm font-bold text-rose-800">
          {error}
        </p>
      )}

      <motion.button
        type="button"
        onClick={handleSpin}
        disabled={spinning}
        whileHover={{ scale: spinning ? 1 : 1.04 }}
        whileTap={{ scale: spinning ? 1 : 0.97 }}
        className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-10 py-4 text-lg font-extrabold text-slate-900 shadow-lg disabled:opacity-50"
      >
        {spinning ? "Эргэж байна..." : "🎡 Сугалаа татах"}
      </motion.button>

      {lastWinner && !spinning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full max-w-md flex-col gap-4"
        >
          <div className="rounded-2xl border-4 border-amber-400 bg-white p-6 text-center shadow-card">
            <p className="font-display text-xl font-black text-fuchsia-600">Ялагч тодорлоо!</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{lastWinner.winnerName}</p>
            <p className="mt-1 font-bold text-slate-600">{lastWinner.prizeName}</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">{lastWinner.phone}</p>
          </div>
          <motion.button
            type="button"
            onClick={() => {
              setLastWinner(null);
              setError(null);
              onRefreshPool?.();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-2xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-extrabold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            Шинэчлэх — ялагчийн мэдээллийг хаах
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
