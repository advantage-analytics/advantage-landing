"use client";

import { motion, useReducedMotion } from "framer-motion";

// Top-down tennis court with a ball-landing density heatmap. Hot zones cluster
// deep in the corners — the signature of a player who targets the lines.
const ZONES = [
  { cx: 64, cy: 40, r: 30, o: 0.85 },
  { cx: 196, cy: 46, r: 26, o: 0.7 },
  { cx: 80, cy: 70, r: 20, o: 0.5 },
  { cx: 180, cy: 96, r: 22, o: 0.55 },
  { cx: 130, cy: 60, r: 16, o: 0.35 },
];

export function CourtHeatmap() {
  const reduce = useReducedMotion();
  const line = { stroke: "rgba(255,255,255,0.55)", strokeWidth: 1.5, fill: "none" };
  return (
    <svg
      viewBox="0 0 260 300"
      className="h-full w-full"
      role="img"
      aria-label="Court heatmap showing ball-landing density concentrated deep in the corners"
    >
      <defs>
        <radialGradient id="heat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="55%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </radialGradient>
      </defs>

      {/* court surface */}
      <rect x="20" y="14" width="220" height="272" rx="4" fill="var(--color-blue-ink-deep)" />

      {/* heat blobs */}
      <g style={{ mixBlendMode: "screen" }}>
        {ZONES.map((z, i) => (
          <motion.circle
            key={i}
            cx={z.cx + 20}
            cy={z.cy + 14}
            r={z.r}
            fill="url(#heat)"
            initial={reduce ? false : { opacity: 0, scale: 0.4 }}
            whileInView={reduce ? undefined : { opacity: z.o, scale: 1 }}
            style={{ transformOrigin: `${z.cx + 20}px ${z.cy + 14}px` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </g>

      {/* court lines */}
      <rect x="20" y="14" width="220" height="272" rx="4" {...line} />
      {/* singles sidelines */}
      <line x1="42" y1="14" x2="42" y2="286" {...line} />
      <line x1="218" y1="14" x2="218" y2="286" {...line} />
      {/* service line + center */}
      <line x1="42" y1="100" x2="218" y2="100" {...line} />
      <line x1="42" y1="200" x2="218" y2="200" {...line} />
      <line x1="130" y1="100" x2="130" y2="200" {...line} />
      {/* net */}
      <line x1="20" y1="150" x2="240" y2="150" stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
    </svg>
  );
}
