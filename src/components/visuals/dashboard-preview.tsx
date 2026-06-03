"use client";

import { Home, LayoutGrid, BarChart3, Activity, Sparkles } from "lucide-react";
import { RadarChart } from "./radar-chart";
import { TrendChart } from "./trend-chart";

const kpis = [
  { label: "1st serve in", value: "68%", delta: "+4", spark: [10, 12, 9, 14, 13, 16] },
  { label: "Break pts won", value: "54%", delta: "+9", spark: [6, 8, 7, 9, 11, 12] },
  { label: "Winners", value: "22", delta: "+5", spark: [8, 10, 9, 12, 11, 14] },
  { label: "Win rate", value: "71%", delta: "+12", spark: [9, 8, 11, 10, 13, 15] },
];

function Spark({ points }: { points: number[] }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 48;
      const y = 16 - ((p - min) / (max - min || 1)) * 14;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 48 18" className="h-4 w-12" aria-hidden>
      <path d={d} fill="none" stroke="var(--color-blue)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// High-fidelity recreation of the Advantage dashboard, built from the product's
// real metrics and components (KPI strip, momentum tracker, performance radar).
export function DashboardPreview() {
  return (
    <div className="flex h-full w-full bg-[var(--color-surface-muted)] text-left">
      {/* sidebar */}
      <aside className="hidden w-[148px] shrink-0 flex-col gap-1 border-r border-[var(--color-ink-100)] bg-white p-3 sm:flex">
        <div className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-400)]">
          Advantage
        </div>
        {[
          { icon: Home, label: "Home", active: true },
          { icon: LayoutGrid, label: "Matches", active: false },
          { icon: BarChart3, label: "Statistics", active: false },
        ].map((it) => (
          <div
            key={it.label}
            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium ${
              it.active
                ? "bg-[var(--color-blue-tint-08)] text-[var(--color-blue)]"
                : "text-[var(--color-ink-500)]"
            }`}
          >
            <it.icon className="size-3.5" />
            {it.label}
          </div>
        ))}
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] font-semibold text-[var(--color-ink-900)]">Overview</div>
            <div className="font-mono text-[10px] text-[var(--color-ink-400)]">
              vs. Stanford · Singles
            </div>
          </div>
          <span className="rounded-full bg-[var(--color-success-tint-12)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--color-success)]">
            Win 6-4, 6-3
          </span>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-lg border border-[var(--color-ink-100)] bg-white p-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--color-ink-400)]">
                  {k.label}
                </span>
                <Spark points={k.spark} />
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-semibold text-[var(--color-ink-900)]">
                  {k.value}
                </span>
                <span className="font-mono text-[10px] text-[var(--color-success)]">{k.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* charts */}
        <div className="grid flex-1 grid-cols-1 gap-2 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col rounded-lg border border-[var(--color-ink-100)] bg-white p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-ink-700)]">
              <Activity className="size-3.5 text-[var(--color-blue)]" />
              Momentum
            </div>
            <div className="mt-2 min-h-0 flex-1">
              <TrendChart />
            </div>
          </div>
          <div className="hidden flex-col rounded-lg border border-[var(--color-ink-100)] bg-white p-3 lg:flex">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-ink-700)]">
              <Sparkles className="size-3.5 text-[var(--color-blue)]" />
              Performance profile
            </div>
            <div className="mt-1 min-h-0 flex-1">
              <RadarChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
