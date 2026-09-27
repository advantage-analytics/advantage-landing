import { Fragment, type ReactNode } from "react";
import {
  Calendar,
  Check,
  ChevronUp,
  CircleCheck,
  Ellipsis,
  GitCompareArrows,
  ScatterChart,
  Share,
  Swords,
  Table2,
  Video,
} from "lucide-react";
import { DH_W, Ico, RAIL_BOTTOM, RAIL_TOP } from "./dashboard-home";
import "./dashboard-home.css";
import "./mocks.css";

/* Match breakdown — the dashboard's single-match report on its Statistics
   view, ported from advantage-dashboard (`app/dashboard/matches/[matchId]`
   and `components/dashboard/matches/match-detail/`) at the same 1440 width
   the Home and Roster mocks use. Rail, header and cards are the app's own;
   the report's 300px rail (scoreboard, view switcher, share) and its pane
   (title and facts, the Advantage Intelligence insight, head to head beside
   the three point-derived charts) follow the settled design frame by frame.
   The real Statistics view has no KPI strip, so neither does this.

   The match is the one the film room plays: Quan v Gomez at Indian Wells,
   112 points. Every figure here is invented but internally consistent —
   the head-to-head totals sum to the score, the endings bars to the winner
   and error counts, the tracker to the final margin — so the two product
   shots read as one afternoon.

   Static markup, no state, renders on the server. Callers make it inert. */

// The pane grows to its content in the app; a fixed board cannot, so it is cut
// where the head-to-head card's bottom padding ends (measured: 944px at 1440
// wide), the way the roster board is.
export const MB_H = 944;

const YOU = "Quan";
const OPP = "Gomez";

// Blue is the viewer, slate the opponent — the dashboard's `--viz-you` and
// `--viz-opp` ramps, deep → base → mid → light.
const VIZ = {
  you: ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"],
  opp: ["#475569", "#64748B", "#94A3B8", "#CBD5E1"],
} as const;

/* ---------- head to head ---------- */
type H2HRow = { label: string; you: string; opp: string; leader: "you" | "opp" | null };
const H2H: readonly { title: string; rows: readonly H2HRow[] }[] = [
  {
    title: "Serve",
    rows: [
      { label: "Aces", you: "7", opp: "4", leader: "you" },
      { label: "Double faults", you: "2", opp: "5", leader: "you" },
      { label: "First serve in", you: "68%", opp: "61%", leader: "you" },
      { label: "First serve points won", you: "76%", opp: "69%", leader: "you" },
      { label: "Second serve points won", you: "52%", opp: "44%", leader: "you" },
      { label: "Break points saved", you: "5/7", opp: "3/6", leader: "you" },
      { label: "Service games won", you: "12/14", opp: "10/14", leader: "you" },
    ],
  },
  {
    title: "Return",
    rows: [
      { label: "First serve returns won", you: "31%", opp: "24%", leader: "you" },
      { label: "Second serve returns won", you: "56%", opp: "48%", leader: "you" },
      { label: "Break points converted", you: "3/6", opp: "2/7", leader: "you" },
      { label: "Return winners", you: "6", opp: "3", leader: "you" },
    ],
  },
  {
    title: "Points",
    rows: [
      { label: "Net points won", you: "9/12", opp: "5/9", leader: "you" },
      { label: "Winners", you: "28", opp: "22", leader: "you" },
      { label: "Unforced errors", you: "19", opp: "27", leader: "you" },
      { label: "Total points won", you: "61", opp: "51", leader: "you" },
    ],
  },
];

/* ---------- performance tracker ----------
   The running won-point differential from Quan's side, one sample per
   point. Set 1 to +2 (6-4), set 2 back under the line (3-6), set 3 pulling
   away to the final +10 (61–51). Seeded so the trace is the same every
   render and on the server. */
const SET_ENDS = [40, 77, 112];
const SERIES = (() => {
  const target = (i: number) => {
    if (i <= 40) return (i / 40) * 2;
    if (i <= 77) return 2 - ((i - 40) / 37) * 3.5;
    return -1.5 + ((i - 77) / 35) * 11.5;
  };
  const out: number[] = [0];
  let s = 11;
  let v = 0;
  for (let i = 1; i <= 112; i++) {
    s = (s * 9301 + 49297) % 233280;
    const noise = s / 233280 - 0.5;
    // Each point moves the margin by exactly one — nudge toward the target.
    v += target(i) + noise * 2.4 > v ? 1 : -1;
    out.push(v);
  }
  out[112] = 10;
  return out;
})();
const CH_W = 1000;
const CH_H = 96;
const CH_MID = CH_H / 2;
const CH_PAD = 6;
const TRACK = (() => {
  const max = Math.max(...SERIES.map((v) => Math.abs(v)), 1);
  const x = (i: number) => (i / 112) * CH_W;
  const y = (v: number) => CH_MID - (v / max) * (CH_MID - CH_PAD);
  const line = SERIES.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L ${CH_W} ${CH_MID} L 0 ${CH_MID} Z`;
  return { line, area, dividers: SET_ENDS.slice(0, -1).map(x) };
})();

/* ---------- rally length ---------- */
const BANDS = [
  { label: "Short", title: "1–4 shots", count: 58, you: 33 },
  { label: "Medium", title: "5–8 shots", count: 36, you: 17 },
  { label: "Long", title: "9+ shots", count: 18, you: 11 },
];
const BAND_TOTAL = BANDS.reduce((n, b) => n + b.count, 0);

/* ---------- how points ended ---------- */
const ENDINGS = [
  { key: "Winners", you: 28, opp: 22 },
  { key: "Aces", you: 7, opp: 4 },
  { key: "Unforced", you: 19, opp: 27 },
  { key: "Double faults", you: 2, opp: 5 },
];

const Num = ({ children }: { children: ReactNode }) => <span className="tn">{children}</span>;

function Eyebrow({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="dh-sh">
      <h2>{children}</h2>
      <div className="flex" />
      {aside ? <span className="mb-micro">{aside}</span> : null}
    </div>
  );
}

export function MatchBreakdown() {
  return (
    <div className="dh mb">
      <nav className="dh-rail">
        <div className="dh-ws">
          <span className="slot">
            <span className="ws">R</span>
          </span>
        </div>
        <div className="dh-rail-gap" />
        <div className="dh-rail-group">
          {RAIL_TOP.map((ic, i) => (
            <div className={`dh-rail-item${i === 1 ? " on" : ""}`} key={i}>
              <span className="slot"><Ico>{ic}</Ico></span>
            </div>
          ))}
        </div>
        <div className="flex" />
        <div className="dh-rail-group">
          {RAIL_BOTTOM.map((ic, i) => (
            <div className="dh-rail-item" key={i}>
              <span className="slot"><Ico>{ic}</Ico></span>
            </div>
          ))}
        </div>
        <div className="dh-rail-me">
          <span className="slot"><span className="av">RQ</span></span>
        </div>
      </nav>

      <div className="dh-main">
        <header className="dh-head">
          <span className="greet">
            <span className="g">Rudy Quan</span>
            <span className="d">Personal · Matches</span>
          </span>
          <div className="tools">
            <span className="search">
              <Ico size={14}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Ico>
              <span>Search</span>
            </span>
            <span className="ib">
              <Ico size={15}><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" /></Ico>
            </span>
            <span className="sep" />
            <span className="me">
              <span className="av">RQ</span>
              <Ico size={12} stroke="#AAAAAA"><path d="m6 9 6 6 6-6" /></Ico>
            </span>
          </div>
        </header>

        <div className="mb-frame">
          {/* The report rail: scoreboard in its final state, the three views,
              and the share action pinned to the bottom. */}
          <aside className="mb-rail">
            <div className="mb-score">
              <div className="hd">
                <span className="mb-micro">Final</span>
                <div className="flex" />
                <span className="clock">1:42:18</span>
              </div>
              <div className="rows">
                <div className="row">
                  <span className="nm">Rudy Quan</span>
                  <Check size={12} strokeWidth={2} className="win" aria-hidden="true" />
                  <div className="flex" />
                  <span className="sets"><b>6</b><b>3</b><b>6</b></span>
                </div>
                <div className="row is-lost">
                  <span className="nm">Federico Gomez</span>
                  <div className="flex" />
                  <span className="sets"><b>4</b><b>6</b><b>3</b></span>
                </div>
              </div>
              <span className="mb-micro tn">BNP Paribas Open · Round of 64</span>
            </div>
            <div className="mb-views">
              <span className="row on"><span className="slot"><Table2 size={16} strokeWidth={1.5} /></span>Statistics</span>
              <span className="row"><span className="slot"><ScatterChart size={16} strokeWidth={1.5} /></span>Visualizations</span>
              <span className="row"><span className="slot"><Video size={16} strokeWidth={1.5} /></span>Video</span>
            </div>
            <div className="flex" />
            <div className="mb-rail-foot">
              <span className="mb-btn ghost wide"><Share size={14} strokeWidth={1.6} />Share</span>
            </div>
          </aside>

          <main className="mb-pane">
            <div className="mb-title">
              <div>
                <h1>Statistics</h1>
                <div className="facts">
                  <span><Swords size={13} strokeWidth={1.5} /><Num>112</Num> points · <Num>28</Num> games</span>
                  <span><Calendar size={13} strokeWidth={1.5} /><Num>Mar 12</Num></span>
                  <span><img src="/assets/icons/tournament-icon.svg" alt="" />BNP Paribas Open</span>
                  <span><img src="/assets/icons/tennis-court-icon.svg" alt="" />Hard</span>
                  <span><CircleCheck size={13} strokeWidth={1.5} />Verified result</span>
                </div>
              </div>
              <div className="flex" />
              <div className="acts">
                <span className="mb-btn ghost"><GitCompareArrows size={14} strokeWidth={1.6} />Compare</span>
                <span className="mb-ib"><Ellipsis size={15} strokeWidth={1.6} /></span>
              </div>
            </div>

            <div className="dh-card dh-pad dh-ai mb-insight">
              <div className="bd">
                <span className="lead">Gomez’s second serve decided this one.</span>
                <span className="body">
                  You won <b>56%</b> of second-serve return points and all <b>3</b> breaks came on it. The long rallies were yours too:{" "}
                  <b>11</b> of <b>18</b> at nine shots or more, so keep extending the point when the first serve misses.
                </span>
              </div>
              <div className="dh-foot">
                <span className="hd">
                  <span className="mk"><img src="/assets/logos/logo3.svg" alt="" width={9} height={6} /></span>
                  <span className="nm">Advantage Intelligence</span>
                </span>
                <div className="flex" />
                <span className="lnk strong"><ChevronUp size={12} strokeWidth={1.6} />Collapse</span>
              </div>
            </div>

            <div className="mb-row">
              <section className="dh-card mb-h2h">
                <div className="dh-sh">
                  <h2>Head to head</h2>
                  <div className="flex" />
                  <span className="mb-micro tn">Whole match · 112 points</span>
                </div>
                <div className="cols">
                  <span className="flex" />
                  <span className="col you">{YOU}<Check size={11} strokeWidth={2} aria-hidden="true" /></span>
                  <span className="col">{OPP}</span>
                </div>
                {H2H.map((g) => (
                  <Fragment key={g.title}>
                    <span className="grp">{g.title}</span>
                    {g.rows.map((r) => (
                      <div className="r" key={r.label}>
                        <span className="l">{r.label}</span>
                        <span className={`v${r.leader === "you" ? " lead" : ""}`}>{r.you}</span>
                        <span className={`v${r.leader === "opp" ? " lead" : ""}`}>{r.opp}</span>
                      </div>
                    ))}
                  </Fragment>
                ))}
              </section>

              <div className="mb-col">
                <section className="dh-card mb-chart">
                  <Eyebrow aside="Points won, running margin">Performance tracker</Eyebrow>
                  <svg viewBox={`0 0 ${CH_W} ${CH_H}`} preserveAspectRatio="none" className="track" aria-hidden="true">
                    <defs>
                      <clipPath id="mb-above"><rect x="0" y="0" width={CH_W} height={CH_MID} /></clipPath>
                      <clipPath id="mb-below"><rect x="0" y={CH_MID} width={CH_W} height={CH_MID} /></clipPath>
                    </defs>
                    <line x1="0" x2={CH_W} y1={CH_MID} y2={CH_MID} stroke="#E5E5EA" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    {TRACK.dividers.map((x) => (
                      <line key={x} x1={x} x2={x} y1="0" y2={CH_H} stroke="#E5E5EA" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
                    ))}
                    <path d={TRACK.area} fill={VIZ.you[1]} opacity="0.16" clipPath="url(#mb-above)" />
                    <path d={TRACK.area} fill={VIZ.opp[1]} opacity="0.16" clipPath="url(#mb-below)" />
                    <path d={TRACK.line} fill="none" stroke={VIZ.you[1]} strokeWidth="1.5" clipPath="url(#mb-above)" vectorEffect="non-scaling-stroke" />
                    <path d={TRACK.line} fill="none" stroke={VIZ.opp[1]} strokeWidth="1.5" clipPath="url(#mb-below)" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <div className="legend">
                    <span><i style={{ background: VIZ.you[1] }} />{YOU}</span>
                    <span><i style={{ background: VIZ.opp[1] }} />{OPP}</span>
                    <div className="flex" />
                    <span className="mb-micro tn">Set 1 · 2 · 3</span>
                  </div>
                </section>

                <section className="dh-card mb-chart">
                  <Eyebrow aside={<><Num>5.1</Num> shots average</>}>Rally length</Eyebrow>
                  <div className="bands">
                    {BANDS.map((b) => (
                      <div className="band" key={b.label} style={{ width: `${(b.count / BAND_TOTAL) * 100}%` }}>
                        <i style={{ height: `${(b.you / b.count) * 100}%`, background: VIZ.you[2] }} />
                        <i style={{ flex: 1, background: VIZ.opp[3] }} />
                      </div>
                    ))}
                  </div>
                  <div className="bandl">
                    {BANDS.map((b) => (
                      <span key={b.label} style={{ width: `${(b.count / BAND_TOTAL) * 100}%` }}>
                        <b>{b.label}</b>
                        <span className="mb-micro tn">{b.count}</span>
                      </span>
                    ))}
                  </div>
                  <div className="legend">
                    <span><i style={{ background: VIZ.you[2] }} />{YOU} won</span>
                    <span><i style={{ background: VIZ.opp[3] }} />{OPP} won</span>
                  </div>
                </section>

                <section className="dh-card mb-chart">
                  <Eyebrow aside="Own outcomes">How points ended</Eyebrow>
                  <div className="ends">
                    {(["you", "opp"] as const).map((side) => {
                      const total = ENDINGS.reduce((n, e) => n + e[side], 0);
                      return (
                        <div className="end" key={side}>
                          <span className="nm">{side === "you" ? YOU : OPP}</span>
                          <span className="bar">
                            {ENDINGS.map((e, i) => (
                              <i key={e.key} style={{ width: `${(e[side] / total) * 100}%`, background: VIZ[side][i] }} />
                            ))}
                          </span>
                          <span className="mb-micro tn">{total}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="legend">
                    {ENDINGS.map((e, i) => (
                      <span key={e.key}><i style={{ background: VIZ.you[i] }} />{e.key}</span>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export { DH_W as MB_W };
