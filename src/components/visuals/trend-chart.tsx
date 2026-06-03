"use client";

import { motion, useReducedMotion } from "framer-motion";

// Aggregated multi-match trend: an upward line that draws itself on reveal.
// Five match data points merging into one season trend.
const POINTS = [
  [0, 116],
  [60, 104],
  [120, 110],
  [180, 86],
  [240, 78],
  [300, 60],
  [360, 44],
];

const path = POINTS.reduce(
  (acc, [x, y], i) => acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`),
  ""
);
const area = `${path} L 360 160 L 0 160 Z`;

export function TrendChart() {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 360 160"
      className="h-full w-full"
      role="img"
      aria-label="Serve depth trend rising across five matches"
    >
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(59,130,246,0.18)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </linearGradient>
      </defs>
      {[40, 80, 120].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="360"
          y2={y}
          stroke="var(--color-ink-100)"
          strokeWidth="1"
        />
      ))}
      <motion.path
        d={area}
        fill="url(#trendFill)"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={reduce ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="var(--color-blue)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={reduce ? undefined : { pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {POINTS.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i === POINTS.length - 1 ? 4.5 : 2.5}
          fill={i === POINTS.length - 1 ? "var(--color-blue)" : "white"}
          stroke="var(--color-blue)"
          strokeWidth="2"
          initial={reduce ? false : { opacity: 0, scale: 0 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
        />
      ))}
    </svg>
  );
}
