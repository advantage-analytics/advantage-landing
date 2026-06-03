"use client";

import { motion, useReducedMotion } from "framer-motion";

// Opponent weakness radar. Five axes; the values dip hard on "2nd serve return"
// to visualize an exploitable weakness.
const AXES = ["Serve", "Forehand", "Backhand", "2nd Serve", "Net"];
const VALUES = [0.82, 0.74, 0.68, 0.34, 0.6];
const CX = 130;
const CY = 124;
const R = 92;

function point(i: number, scale: number) {
  const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
  return [CX + Math.cos(angle) * R * scale, CY + Math.sin(angle) * R * scale];
}

const ring = (scale: number) =>
  AXES.map((_, i) => point(i, scale).join(",")).join(" ");
const shape = VALUES.map((v, i) => point(i, v).join(",")).join(" ");

export function RadarChart() {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 260 248"
      className="h-full w-full"
      role="img"
      aria-label="Opponent profile radar highlighting a weak second-serve return"
    >
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon
          key={s}
          points={ring(s)}
          fill="none"
          stroke="var(--color-ink-100)"
          strokeWidth="1"
        />
      ))}
      {AXES.map((_, i) => {
        const [x, y] = point(i, 1);
        return (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke="var(--color-ink-100)"
            strokeWidth="1"
          />
        );
      })}
      <motion.polygon
        points={shape}
        fill="var(--color-blue-tint-12)"
        stroke="var(--color-blue)"
        strokeWidth="2"
        strokeLinejoin="round"
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Weakness marker on the 2nd-serve axis (index 3) */}
      {(() => {
        const [x, y] = point(3, VALUES[3]);
        return (
          <motion.circle
            cx={x}
            cy={y}
            r="5"
            fill="var(--color-blue)"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          />
        );
      })()}
      {AXES.map((label, i) => {
        const [x, y] = point(i, 1.16);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-mono"
            fontSize="9"
            fill={i === 3 ? "var(--color-blue)" : "var(--color-ink-400)"}
            fontWeight={i === 3 ? 600 : 400}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
