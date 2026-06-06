import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { DIcon } from "./icons";

/* Counts a numeric stat ("68%", "<60s") up from zero the first time it scrolls
   into view. Opt-in via KpiTile's `countUp` so only the landing's feature
   vizzes animate — the showcase dashboard renders its real values at rest.
   SSR-safe (initial render is the true value) and reduced-motion aware. */
function useCountUp(value: string, enabled: boolean) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const el = ref.current;
    const m = /^(\D*)([\d.]+)(.*)$/.exec(value);
    if (!enabled || !el || !m) {
      setDisplay(value);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix, num, suffix] = m;
    const target = parseFloat(num);
    const decimals = num.includes(".") ? 1 : 0;
    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting || started) return;
          started = true;
          io.unobserve(e.target);
          const t0 = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - t0) / 1000);
            const eased = 1 - Math.pow(1 - t, 4); // ease-out-quart
            setDisplay(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
            if (t < 1) raf = requestAnimationFrame(tick);
            else setDisplay(value);
          };
          raf = requestAnimationFrame(tick);
        }),
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, value]);
  return { ref, display };
}

/* ===========================================================
   AdvantageDashboard — faithful static render of the product's
   home view, ported from the design bundle's dash.jsx.
   Mirrors: kpi-tile · kpi-cards · recent-matches ·
   match-metadata-row · ai-insight-card · insight-stat-chip ·
   match-heatmap · half-court-svg (serve placement).
   =========================================================== */

// Sparkline — verbatim geometry from kpi-tile (80×28, gradient line + area)
function DSpark({ data, positive, mono = false }: { data: number[]; positive: boolean; mono?: boolean }) {
  const id = useId();
  const w = 80,
    h = 28,
    pad = 2;
  const min = Math.min(...data),
    max = Math.max(...data),
    r = max - min || 1;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / r) * (h - pad * 2),
  }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `M ${pts[0].x},${h} ${pts.map((p) => `L ${p.x},${p.y}`).join(" ")} L ${
    pts[pts.length - 1].x
  },${h} Z`;
  const c = mono ? "#3B82F6" : positive ? "#5DB955" : "#E51837";
  return (
    <svg className="adb-kpi-spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <defs>
        <linearGradient id={id + "l"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c} stopOpacity=".3" />
          <stop offset="100%" stopColor={c} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={id + "a"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity=".1" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id}a)`} />
      <polyline
        points={line}
        fill="none"
        stroke={`url(#${id}l)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Kpi = {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  spark?: number[];
  lowerIsBetter?: boolean;
};

// KPI tile — mirrors KpiTile: label 9px, value 28px light, value row
// [value][flex spacer max 48px][sparkline], trend arrow+change+label.
// `countUp` opts the value into a scroll-triggered count animation.
export function KpiTile({ label, value, spark, change, changeLabel, lowerIsBetter, countUp = false, mono = false }: Kpi & { countUp?: boolean; mono?: boolean }) {
  const neutral = change === 0;
  const good = lowerIsBetter ? change <= 0 : change >= 0;
  // mono: direction is carried by the arrow glyph, not by hue — the marketing
  // surface stays one-blue. Deep blue keeps the small trend text at AA contrast.
  const col = neutral ? "#888888" : mono ? "#2563EB" : good ? "#5DB955" : "#E51837";
  const arrow = neutral ? "→" : change > 0 ? "↑" : "↓";
  const sign = neutral ? "" : change > 0 ? "+" : "";
  const { ref, display } = useCountUp(value, countUp);
  return (
    <div className="adb-kpi">
      <p className="adb-kpi-label">{label}</p>
      <div className="adb-kpi-valrow">
        <span className="adb-kpi-value" ref={ref}>{display}</span>
        <span className="adb-kpi-spacer" aria-hidden="true" />
        {spark && <DSpark data={spark} positive={good} mono={mono} />}
      </div>
      <div className="adb-kpi-trend">
        <span className="ar" style={{ color: col }}>
          {arrow}
        </span>
        <span className="ch" style={{ color: col }}>
          {sign}
          {change}
        </span>
        <span className="lb">{changeLabel}</span>
      </div>
    </div>
  );
}

export const D_KPIS: Kpi[] = [
  { label: "1st Serve Percentage", value: "68%", change: 4.2, changeLabel: "last 30 days", spark: [60, 62, 61, 64, 63, 66, 68] },
  { label: "1st Serve Won", value: "74%", change: 3.1, changeLabel: "last 30 days", spark: [68, 70, 69, 71, 72, 73, 74] },
  { label: "2nd Serve Won", value: "48%", change: -5, changeLabel: "last 30 days", spark: [56, 54, 53, 52, 50, 49, 48] },
  { label: "Breakpoints Saved", value: "61%", change: 7, changeLabel: "last 30 days", spark: [52, 54, 53, 57, 58, 60, 61] },
  { label: "Return Games Won", value: "38%", change: 6, changeLabel: "last 30 days", spark: [30, 31, 33, 34, 35, 37, 38] },
];

// Recent match row — mirrors recent-matches MatchLink
type Match = {
  id: string;
  opponentName: string;
  score: string;
  won: boolean;
  meta?: string[];
  fs: string;
  we: string;
  bp: string;
};
const STAT_COLUMNS: { label: string; key: "fs" | "we" | "bp" }[] = [
  { label: "FIRST SERVE", key: "fs" },
  { label: "WINNERS / ERRORS", key: "we" },
  { label: "BREAKPOINTS", key: "bp" },
];
function MatchRow({ m }: { m: Match }) {
  return (
    <div className="adb-mrow">
      <div className="adb-mleft">
        <span className={"adb-mbar " + (m.won ? "win" : "loss")} />
        <div className="adb-mcol">
          <div className="adb-mtop">
            <span className="opp">{m.opponentName}</span>
            <span className="sc">{m.score}</span>
            <span className={"res " + (m.won ? "win" : "loss")}>{m.won ? "Won" : "Lost"}</span>
          </div>
          {m.meta && (
            <div className="adb-mmeta">
              {m.meta.map((x, i) => (
                <span key={i}>
                  {i > 0 && <span className="sep">·</span>}
                  {x}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="adb-mstats">
        {STAT_COLUMNS.map((c) => (
          <div className="adb-statcol" key={c.key}>
            <span className="sl">{c.label}</span>
            <span className="sv">{m[c.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const D_EVENT = {
  tournamentName: "Ojai Spring Open",
  date: "Apr 2026",
  court: "Hard",
  type: "Tournament",
  matches: [
    { id: "1", opponentName: "M. Nakamura", score: "6-4, 7-5", won: true, meta: ["RIGHT HANDED", "2-HANDED BACKHAND"], fs: "68%", we: "24/15", bp: "4/6" },
    { id: "2", opponentName: "K. Sato", score: "4-6, 6-3, 6-4", won: true, meta: ["LEFT HANDED", "1-HANDED BACKHAND"], fs: "71%", we: "31/22", bp: "5/9" },
    { id: "3", opponentName: "J. Whitmore", score: "3-6, 4-6", won: false, meta: ["RIGHT HANDED", "2-HANDED BACKHAND"], fs: "59%", we: "18/26", bp: "1/7" },
  ] as Match[],
};

function RecentMatchesCard() {
  return (
    <div className="adb-card adb-card-flush">
      <div className="adb-cardhead">
        <p className="adb-eyebrow">RECENT MATCHES</p>
        <span className="adb-viewall">VIEW ALL</span>
      </div>
      <div className="adb-card-body">
        <div className="adb-event">
          <p className="adb-event-name">{D_EVENT.tournamentName}</p>
          <div className="adb-metarow">
            <span className="adb-metaitem">
              <DIcon n="calendar" /> {D_EVENT.date}
            </span>
            <span className="adb-metaitem">
              <img src="/assets/icons/tournament-icon.svg" alt="" /> {D_EVENT.type}
            </span>
            <span className="adb-metaitem">
              <img src="/assets/icons/tennis-court-icon.svg" alt="" /> {D_EVENT.court}
            </span>
          </div>
          <div className="adb-mrows">
            {D_EVENT.matches.map((m) => (
              <MatchRow key={m.id} m={m} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// AI insight chip — mirrors InsightStatChip (gray fill, not pill)
export function InsightChip({
  label,
  value,
  change,
  lowerIsBetter,
}: {
  label: string;
  value: string;
  change?: number;
  lowerIsBetter?: boolean;
}) {
  const hasTrend = typeof change === "number" && change !== 0;
  const good = lowerIsBetter ? (change ?? 0) < 0 : (change ?? 0) > 0;
  const col = good ? "#5DB955" : "#E51837";
  const arrow = (change ?? 0) > 0 ? "↑" : "↓";
  const sign = (change ?? 0) > 0 ? "+" : "";
  return (
    <span className="adb-chip">
      <span className="cl">{label}</span>
      <span className="cv">{value}</span>
      {hasTrend && (
        <span className="ct" style={{ color: col }}>
          {arrow}
          {sign}
          {change}
        </span>
      )}
    </span>
  );
}

function AiInsightCard() {
  return (
    <div className="adb-card adb-card-flush">
      <div className="adb-cardhead">
        <p className="adb-eyebrow">AI Insight</p>
      </div>
      <div className="adb-card-body adb-ai">
        <p className="adb-ai-body">
          Your first-serve win rate is up 3 points over the last month, but second-serve points won
          dropped to 48%. Against deep returners like Nakamura, a heavier kick second serve is the
          pattern to drill this week.
        </p>
        <div className="adb-chips">
          <InsightChip label="1st Serve Won" value="74%" change={3} />
          <InsightChip label="2nd Serve Won" value="48%" change={-5} />
        </div>
        <div className="adb-ai-actions">
          <span className="adb-dismiss">Dismiss</span>
        </div>
      </div>
    </div>
  );
}

// Match heatmap — June 2026 starts on a Monday (Mon-first grid). Counts sum to 12.
const HM_CELL = (c: number) => (c === 0 ? "#F2F2F2" : c === 1 ? "#B8D4F9" : c === 2 ? "#6AABFF" : "#3B82F6");
const HM_LEGEND = ["#F2F2F2", "#B8D4F9", "#6AABFF", "#3B82F6"];
const HM_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const HM_COUNTS = [0, 1, 0, 1, 0, 2, 0, 0, 1, 0, 2, 0, 0, 0, 1, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const HM_TODAY = 2;
const HM_FORM = ["W", "W", "W", "L", "W"];
function HeatmapCard() {
  return (
    <div className="adb-card">
      <div className="adb-cardhead">
        <p className="adb-eyebrow">Match Activity</p>
        <span className="adb-hm-month">June 2026</span>
      </div>
      <div className="adb-hm-body">
        <div className="adb-hm-grid">
          {HM_DAYS.map((d, i) => (
            <div className="adb-hm-dow" key={"h" + i}>
              {d}
            </div>
          ))}
          {HM_COUNTS.map((c, i) => {
            const day = i + 1;
            return (
              <div
                className={"adb-hm-cell" + (day === HM_TODAY ? " today" : "")}
                key={i}
                style={{ background: HM_CELL(c), color: c > 0 ? "#fff" : "#BFBFBF" }}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="adb-hm-legendrow">
          <div className="adb-hm-legend">
            <span>Less</span>
            {HM_LEGEND.map((c, i) => (
              <span key={i} className="sw" style={{ background: c }} />
            ))}
            <span>More</span>
          </div>
          <span className="adb-hm-hint">Tap a match day for details</span>
        </div>
        <div className="adb-hm-divider" />
        <div className="adb-hm-summary">
          <div className="adb-hm-record">
            <span className="rk">12 matches</span>
            <span className="rv">8W – 4L</span>
          </div>
          <div className="adb-hm-form">
            <span className="fl">Form</span>
            {HM_FORM.map((r, i) => (
              <span key={i} className={"fc " + (r === "W" ? "w" : "l")}>
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================
// Serve Placement — verbatim court geometry from half-court-svg.
// ===========================================================
const COURT = {
  W: 447,
  H: 350,
  DL: 37.4,
  DR: 410.9,
  TOP: 0,
  SL: 84.2,
  SR: 362.4,
  SERVICE_Y: 155,
  BASELINE_Y: 331,
  get CX() {
    return (this.SL + this.SR) / 2;
  }, // 223.3
  FILL: "#EFF4FF",
  LINE: "#D6E4F9",
  LW: 1.5,
};
const BOX_HALF = (COURT.SR - COURT.SL) / 2; // 139.1
const ZONE_LINES_X = [
  COURT.SL + BOX_HALF / 3,
  COURT.SL + (BOX_HALF * 2) / 3,
  COURT.CX + BOX_HALF / 3,
  COURT.CX + (BOX_HALF * 2) / 3,
];
const ALLEY_LABEL_X = (COURT.DL + COURT.SL) / 2; // 60.8
const SP_ZONES = [
  { label: "Wide", x1: COURT.SL, x2: ZONE_LINES_X[0], pct: 18, count: 4 },
  { label: "Body", x1: ZONE_LINES_X[0], x2: ZONE_LINES_X[1], pct: 14, count: 3 },
  { label: "T", x1: ZONE_LINES_X[1], x2: COURT.CX, pct: 18, count: 4 },
  { label: "T", x1: COURT.CX, x2: ZONE_LINES_X[2], pct: 18, count: 4 },
  { label: "Body", x1: ZONE_LINES_X[2], x2: ZONE_LINES_X[3], pct: 14, count: 3 },
  { label: "Wide", x1: ZONE_LINES_X[3], x2: COURT.SR, pct: 18, count: 4 },
];
// Serve dots use two hues as a DATA-CATEGORICAL encoding (1st vs 2nd serve),
// not as brand color. The blue is the accent; the purple exists only to
// distinguish second serves and must never leak into page/UI chrome.
const FIRST_SERVE_COLOR = "rgba(59,130,246,0.65)";
const SECOND_SERVE_COLOR = "rgba(139,92,246,0.8)";

const SERVE_DOTS = [
  { x: 348, y: 182, t: "first" }, { x: 354, y: 202, t: "first" }, { x: 340, y: 173, t: "first" }, { x: 356, y: 168, t: "ace" },
  { x: 236, y: 168, t: "first" }, { x: 231, y: 187, t: "first" }, { x: 242, y: 200, t: "first" }, { x: 247, y: 176, t: "first" },
  { x: 290, y: 232, t: "second" }, { x: 302, y: 214, t: "second" }, { x: 276, y: 250, t: "second" },
  { x: 97, y: 186, t: "first" }, { x: 91, y: 206, t: "first" }, { x: 103, y: 172, t: "first" }, { x: 88, y: 178, t: "ace" },
  { x: 211, y: 170, t: "first" }, { x: 216, y: 190, t: "first" }, { x: 206, y: 203, t: "first" }, { x: 199, y: 178, t: "first" },
  { x: 150, y: 240, t: "second" }, { x: 166, y: 216, t: "second" }, { x: 134, y: 256, t: "second" },
];

function ServeDot({ d, i, first, second, r = 2.5 }: { d: { x: number; y: number; t: string }; i: number; first: string; second: string; r?: number }) {
  return (
    <circle
      cx={d.x}
      cy={d.y}
      r={r}
      fill={d.t === "second" ? second : first}
      stroke="rgba(255,255,255,0.4)"
      strokeWidth={1}
      style={{ "--di": i } as CSSProperties}
    />
  );
}

// `mono` keeps both serve types on the one accent blue (1st solid, 2nd faint)
// for the marketing surface; the live product keeps the blue/purple categorical
// encoding. The 1st-serve blue is already the brand accent either way.
export function CourtViz({ mono = false, labels = true, bare = false }: { mono?: boolean; labels?: boolean; bare?: boolean } = {}) {
  const firstColor = FIRST_SERVE_COLOR;
  const secondColor = mono ? "rgba(59,130,246,0.30)" : SECOND_SERVE_COLOR;
  // `bare` drops the filled court tile so the diagram sits airy on a neutral
  // surface (matching the other "What you get" visuals). Without the blue fill
  // behind them the lines need more presence, so they step up in both shade and
  // weight, and the serve dots grow — giving the court the same visual heft as
  // the trend chart's line and the activity grid's cells. The line color is a
  // tint of the signal blue (#3B82F6), so it sits in the same family as the
  // trend stroke and the activity ramp beside it rather than reading gray.
  const lineColor = bare ? "#9DC1FB" : COURT.LINE;
  const lineW = bare ? 2 : COURT.LW;
  const dashW = bare ? 1.4 : 1;
  const dotR = bare ? 3.4 : 2.5;
  const lp = { stroke: lineColor, strokeWidth: lineW, strokeLinecap: "round" as const };
  const F = "Inter, sans-serif";
  return (
    <svg
      className="adb-court"
      viewBox={`-1 -1 ${COURT.W + 2} ${COURT.H + 2}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Serve placement court diagram showing where serves landed"
    >
      <rect x="0" y="0" width={COURT.W} height={COURT.H} rx={bare ? 10 : 0} fill={bare ? "#FAFAFA" : COURT.FILL} />
      <line x1={COURT.DL} y1={COURT.TOP} x2={COURT.DR} y2={COURT.TOP} {...lp} />
      <line x1={COURT.DL} y1={COURT.TOP} x2={COURT.DL} y2={COURT.BASELINE_Y} {...lp} />
      <line x1={COURT.DR} y1={COURT.TOP} x2={COURT.DR} y2={COURT.BASELINE_Y} {...lp} />
      <line x1={COURT.SL} y1={COURT.TOP} x2={COURT.SL} y2={COURT.BASELINE_Y} {...lp} />
      <line x1={COURT.SR} y1={COURT.TOP} x2={COURT.SR} y2={COURT.BASELINE_Y} {...lp} />
      <line x1={COURT.SL} y1={COURT.SERVICE_Y} x2={COURT.SR} y2={COURT.SERVICE_Y} {...lp} />
      <line x1={0} y1={COURT.BASELINE_Y} x2={COURT.W} y2={COURT.BASELINE_Y} {...lp} />
      <line x1={COURT.CX} y1={COURT.SERVICE_Y} x2={COURT.CX} y2={COURT.BASELINE_Y} {...lp} />
      {ZONE_LINES_X.map((x, i) => (
        <line key={"zl" + i} x1={x} y1={COURT.SERVICE_Y} x2={x} y2={COURT.BASELINE_Y} stroke={lineColor} strokeWidth={dashW} strokeDasharray="5,5" />
      ))}
      {labels && SP_ZONES.map((z, i) => {
        const cx = (z.x1 + z.x2) / 2;
        return (
          <g key={"z" + i} style={{ pointerEvents: "none" }}>
            <text x={cx} y={COURT.SERVICE_Y - 10} textAnchor="middle" fill="#AAAAAA" fontSize={8} fontWeight={500} fontFamily={F} letterSpacing={1.5}>
              {z.label.toUpperCase()}
            </text>
            <text x={cx} y={COURT.BASELINE_Y - 25} textAnchor="middle" fill="#888888" fontSize={10} fontWeight={500} fontFamily={F} style={{ fontVariantNumeric: "tabular-nums" }}>
              {z.pct}%
            </text>
            <text x={cx} y={COURT.BASELINE_Y - 9} textAnchor="middle" fill="#AAAAAA" fontSize={6} fontWeight={400} fontFamily={F} style={{ fontVariantNumeric: "tabular-nums" }}>
              ({z.count})
            </text>
          </g>
        );
      })}
      {labels && (
        <g style={{ pointerEvents: "none" }}>
          <text x={ALLEY_LABEL_X} y={COURT.SERVICE_Y - 10} textAnchor="middle" fill="#AAAAAA" fontSize={7} fontWeight={500} fontFamily={F} letterSpacing={1}>
            ZONE
          </text>
          <text x={ALLEY_LABEL_X} y={COURT.BASELINE_Y - 25} textAnchor="middle" fill="#AAAAAA" fontSize={7} fontWeight={500} fontFamily={F} letterSpacing={1}>
            IN
          </text>
          <text x={ALLEY_LABEL_X} y={COURT.BASELINE_Y - 9} textAnchor="middle" fill="#AAAAAA" fontSize={7} fontWeight={500} fontFamily={F} letterSpacing={1}>
            COUNT
          </text>
        </g>
      )}
      {SERVE_DOTS.map((d, i) => (
        <ServeDot key={i} d={d} i={i} first={firstColor} second={secondColor} r={dotR} />
      ))}
    </svg>
  );
}

function ServePlacementCard() {
  return (
    <div className="adb-card adb-card-flush">
      <div className="adb-cardhead">
        <p className="adb-eyebrow">Serve Placement</p>
        <span className="adb-sp-ctx">Last 4 matches</span>
      </div>
      <div className="adb-sp-courtband">
        <div className="adb-court-wrap">
          <CourtViz />
        </div>
      </div>
      <div className="adb-sp-footer">
        <div className="adb-sp-legend">
          <span className="adb-sp-leg">
            <span className="sw" style={{ background: FIRST_SERVE_COLOR }} />
            First Serve
          </span>
          <span className="adb-sp-leg">
            <span className="sw" style={{ background: SECOND_SERVE_COLOR }} />
            Second Serve
          </span>
        </div>
        <button className="adb-sp-expand" aria-label="Expand serve placement to fullscreen">
          <DIcon n="maximize" s={12} /> Expand
        </button>
      </div>
    </div>
  );
}

export function AdvantageDashboard() {
  return (
    <div className="adb">
      <aside className="adb-side">
        <img className="adb-logo" src="/assets/logos/logo4.svg" alt="Advantage" />
        <div className="adb-seclabel">Menu</div>
        <div className="adb-nav">
          <div className="adb-navitem active">
            <DIcon n="home" /> Home
          </div>
          <div className="adb-navitem">
            <DIcon n="calendar" /> Matches
          </div>
          <div className="adb-navitem">
            <DIcon n="bar" /> Statistics
          </div>
        </div>
        <div className="adb-nav bottom">
          <div className="adb-seclabel" style={{ marginTop: 0 }}>
            Support
          </div>
          <div className="adb-navitem">
            <DIcon n="settings" /> Settings
          </div>
          <div className="adb-navitem">
            <DIcon n="help" /> Help Center
          </div>
        </div>
      </aside>
      <div className="adb-main">
        <div className="adb-header">
          <div className="adb-hicon">
            <DIcon n="panel" s={15} />
          </div>
          <div className="adb-hright">
            <span className="adb-search">
              <DIcon n="search" />
              <kbd>⌘K</kbd>
            </span>
            <span className="adb-avatar">MA</span>
          </div>
        </div>
        <div className="adb-body">
          <div className="adb-welcome">
            <div>
              <div className="adb-date">Monday, June 2</div>
              {/* Not a real <h1>: this dashboard renders only as a decorative
                  screenshot on the landing page, so it must not inject a second
                  top-level heading into the document outline. */}
              <div className="adb-greet">Good morning, Maria</div>
            </div>
            <button className="adb-upload">
              <DIcon n="plus" s={15} /> Upload Match<kbd className="adb-upload-kbd">⌘U</kbd>
            </button>
          </div>

          <div className="adb-kpistrip-wrap">
            <div className="adb-kpistrip">
              {D_KPIS.map((k) => (
                <KpiTile key={k.label} {...k} />
              ))}
            </div>
            <button className="adb-gear" aria-label="Customize KPI tiles">
              <DIcon n="settings2" />
            </button>
          </div>

          <div className="adb-grid">
            <div className="adb-leftcol">
              <RecentMatchesCard />
              <ServePlacementCard />
            </div>
            <div className="adb-rail">
              <AiInsightCard />
              <HeatmapCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
