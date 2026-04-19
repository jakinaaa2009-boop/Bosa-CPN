"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { AdminStats } from "@/lib/api";

type Props = {
  stats: AdminStats;
};

export function AdminStatsCharts({ stats }: Props) {
  const regData = stats.registrationsByDay.map((d) => ({
    date: d.date.slice(5),
    count: d.count,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border-4 border-white bg-white/95 p-4 shadow-card md:p-6">
        <h3 className="font-display text-lg font-black text-slate-900">
          Бүртгэл (сүүлийн 30 хоног)
        </h3>
        <p className="mt-1 text-xs font-semibold text-slate-500">Өдөр тутмын шинэ хэрэглэгчид</p>
        <div className="mt-4 h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={regData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#a78bfa", r: 3 }}
                name="Бүртгэл"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border-4 border-white bg-white/95 p-4 shadow-card md:p-6">
        <h3 className="font-display text-lg font-black text-slate-900">Насны хуваарилалт</h3>
        <p className="mt-1 text-xs font-semibold text-slate-500">Нас оруулсан хэрэглэгчид</p>
        <div className="mt-4 h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Bar dataKey="count" fill="#34d399" radius={[8, 8, 0, 0]} name="Тоо" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
