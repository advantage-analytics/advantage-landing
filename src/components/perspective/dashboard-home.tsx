import { Fragment, type ReactNode } from "react";
import "./dashboard-home.css";

/* The personal Home from the dashboard app — rail, header, season title, KPI
   strip, recent matches, activity year, the Advantage Intelligence insight,
   serve placement and the usage footer — ported from the design project's
   "Dashboard Home" board (itself rebuilt from advantage-dashboard's Home).

   A fixed 1440×900 artboard: the hero tilts it in perspective and the
   dashboard showcase scales it to width, so everything inside is in native
   pixels. Static markup with no state or handlers, so it renders on the server
   and ships no client JS of its own. Callers make it inert — it is a picture
   of the product, not the product. */

export const DH_W = 1440;
export const DH_H = 900;

export function Ico({ children, size = 16, sw = 1.5, stroke = "currentColor" }: { children: ReactNode; size?: number; sw?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export const RAIL_TOP: ReactNode[] = [
  <Fragment key="i1"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></Fragment>,
  <Fragment key="i2"><path d="M2 7v10" /><path d="M6 5v14" /><rect width="12" height="18" x="10" y="3" rx="2" /></Fragment>,
  <Fragment key="i3"><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m19 9-5 5-4-4-3 3" /></Fragment>,
  <Fragment key="i4"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /><path d="M17.599 6.5a3 3 0 0 0 .399-1.375" /><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" /><path d="M3.477 10.896a4 4 0 0 1 .585-.396" /><path d="M19.938 10.5a4 4 0 0 1 .585.396" /><path d="M6 18a4 4 0 0 1-1.967-.516" /><path d="M19.967 17.484A4 4 0 0 1 18 18" /></Fragment>,
  <path key="msg" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
];
export const RAIL_BOTTOM: ReactNode[] = [
  <Fragment key="i5"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></Fragment>,
  <Fragment key="i6"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></Fragment>,
  <Fragment key="i7"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /><path d="m14 9 3 3-3 3" /></Fragment>,
];

export function spark(d: number[]) {
  const w = 80, h = 28, p = 2;
  const min = Math.min(...d), max = Math.max(...d), r = max - min || 1;
  const pts = d.map((v, i) => [p + (i / (d.length - 1)) * (w - p * 2), h - p - ((v - min) / r) * (h - p * 2)]);
  return {
    line: pts.map((q) => q.join(",")).join(" "),
    area: `M ${pts[0][0]},${h} ` + pts.map((q) => `L ${q[0]},${q[1]}`).join(" ") + ` L ${pts[pts.length - 1][0]},${h} Z`,
  };
}

const KPIS = (
  [
    ["1st serve percentage", "68%", 4.2, [60, 62, 61, 64, 63, 66, 68]],
    ["1st serve won", "74%", 3.1, [68, 70, 69, 71, 72, 73, 74]],
    ["2nd serve won", "48%", -5, [56, 54, 53, 52, 50, 49, 48]],
    ["Break points saved", "61%", 7, [52, 54, 53, 57, 58, 60, 61]],
    ["Return games won", "38%", 6, [30, 31, 33, 34, 35, 37, 38]],
  ] as const
).map(([label, value, ch, d]) => ({
  label,
  value,
  change: Math.abs(ch),
  up: ch >= 0,
  color: ch >= 0 ? "#5DB955" : "#E51837",
  ...spark([...d]),
}));

const MATCHES = [
  { opp: "M. Nakamura", score: "6-4, 7-5", won: true, fs: "68%", w: "24", e: "15" },
  { opp: "K. Sato", score: "4-6, 6-3, 6-4", won: true, fs: "71%", w: "31", e: "22" },
  { opp: "J. Whitmore", score: "3-6, 4-6", won: false, fs: "59%", w: "18", e: "26" },
];

// A year of match days on the dashboard's blue ramp — the board's own seeded
// generator, so the pattern is the design's, cell for cell.
const CELLS = (() => {
  const ramp = ["#F2F2F2", "#B8D4F9", "#6AABFF", "#3B82F6"];
  const out: string[] = [];
  let s = 7;
  for (let i = 0; i < 364; i++) {
    s = (s * 9301 + 49297) % 233280;
    const v = s / 233280;
    out.push(ramp[v > 0.965 ? 3 : v > 0.93 ? 2 : v > 0.88 ? 1 : 0]);
  }
  return out;
})();
const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

const PLACEMENT = [
  { court: "Deuce court", n: 46, t: 43, b: 22, w: 35 },
  { court: "Ad court", n: 43, t: 40, b: 28, w: 32 },
];

const Num = ({ children }: { children: ReactNode }) => <span className="tn">{children}</span>;

export function DashboardHome() {
  return (
    <div className="dh">
      <nav className="dh-rail">
        <div className="dh-ws">
          <span className="slot">
            <span className="ws">J</span>
          </span>
        </div>
        <div className="dh-rail-gap" />
        <div className="dh-rail-group">
          {RAIL_TOP.map((ic, i) => (
            <div className={`dh-rail-item${i === 0 ? " on" : ""}`} key={i}>
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
          <span className="slot"><span className="av">JW</span></span>
        </div>
      </nav>

      <div className="dh-main">
        <header className="dh-head">
          <span className="greet">
            <span className="g">Good morning, Jordan</span>
            <span className="d">Personal · Friday, Sep 25</span>
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
              <span className="av">JW</span>
              <Ico size={12} stroke="#AAAAAA"><path d="m6 9 6 6 6-6" /></Ico>
            </span>
          </div>
        </header>

        <main className="dh-body">
          <div className="dh-title">
            <div>
              <h1>Your season</h1>
              <div className="sub">
                <span className="meta">
                  <Num>12</Num> matches analyzed · <Num>1.4</Num> h left this month
                </span>
                <span className="lnk">1 new report →</span>
              </div>
            </div>
            <div className="flex" />
            <span className="dh-new">New match</span>
          </div>

          <div className="dh-card dh-kpis">
            {KPIS.map((k) => (
              <div className="kpi" key={k.label}>
                <p className="l">{k.label}</p>
                <div className="vr">
                  <span className="v">{k.value}</span>
                  <div className="flex" />
                  <svg width="80" height="28" viewBox="0 0 80 28" aria-hidden="true">
                    <path d={k.area} fill={k.color} opacity="0.08" />
                    <polyline points={k.line} fill="none" stroke={k.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="ch" style={{ color: k.color }}>
                  <span>{k.up ? "↑" : "↓"}</span>
                  <span className="tn">{k.change}</span>
                  <span className="per">last 30 days</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dh-grid">
            <div className="dh-col">
              <section className="dh-card dh-pad">
                <div className="dh-sh">
                  <h2>Recent matches</h2>
                  <div className="flex" />
                  <span className="lnk">All matches</span>
                </div>
                <div className="dh-matches">
                  <div className="ev">
                    <p>Ojai Fall Invitational</p>
                    <div className="evm">
                      <span>
                        <Ico size={13} stroke="#AAAAAA"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></Ico>
                        <span className="tn">Sep 20</span>
                      </span>
                      <span>
                        <img src="/assets/icons/tournament-icon.svg" alt="" />
                        <span>Tournament</span>
                      </span>
                      <span>
                        <img src="/assets/icons/tennis-court-icon.svg" alt="" />
                        <span>Hard</span>
                      </span>
                    </div>
                  </div>
                  {MATCHES.map((m) => (
                    <div className="row" key={m.opp}>
                      <Ico size={14} stroke={m.won ? "#5DB955" : "#E51837"}>
                        <circle cx="12" cy="12" r="10" />
                        <path d={m.won ? "m9 12 2 2 4-4" : "m15 9-6 6M9 9l6 6"} />
                      </Ico>
                      <span className="opp">
                        <span className="vb">{m.won ? "def. " : "l. "}</span>
                        {m.opp}
                      </span>
                      <span className="sc">{m.score}</span>
                      <div className="flex" />
                      <div className="stats">
                        <span className="st w64"><span className="k">1st serve</span><span className="n">{m.fs}</span></span>
                        <span className="st w56"><span className="k">Winners</span><span className="n">{m.w}</span></span>
                        <span className="st w52"><span className="k">Errors</span><span className="n">{m.e}</span></span>
                      </div>
                      <Ico size={13} stroke="#CCCCCC"><path d="m9 18 6-6-6-6" /></Ico>
                    </div>
                  ))}
                  <div className="dh-foot">
                    <span>Latest <Num>3</Num> shown</span>
                    <div className="flex" />
                    <span><Num>12</Num> matches · <Num>8</Num> won</span>
                  </div>
                </div>
              </section>

              <section className="dh-card dh-pad dh-activity">
                <div className="dh-sh">
                  <h2>Activity</h2>
                  <div className="flex" />
                  <span className="lnk">Session log</span>
                </div>
                <div className="months">
                  {MONTHS.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
                <div className="cal">
                  {CELLS.map((c, i) => (
                    <div key={i} style={{ background: c }} />
                  ))}
                </div>
                <span className="tot"><Num>14</Num> sessions · <Num>12</Num> months</span>
              </section>
            </div>

            <div className="dh-col">
              <div className="dh-card dh-pad dh-ai">
                <div className="hd">
                  <span className="mk"><img src="/assets/logos/logo3.svg" alt="" width={9} height={6} /></span>
                  <span className="nm">Advantage Intelligence</span>
                  <div className="flex" />
                  <span className="lnk strong">Open Statistics</span>
                </div>
                <div className="bd">
                  <span className="lead">Your serve is winning matches; your second serve is giving points back.</span>
                  <span className="body">
                    Across <b>12</b> matches, 1st serve won sits at <b>74%</b> (<b>+3.1</b> last 30 days) and 2nd serve won at <b>48%</b> (<b>-5</b>).
                  </span>
                </div>
                <div className="dh-foot">
                  <span>1st serve won · 2nd serve won</span>
                  <div className="flex" />
                  <span>12 matches</span>
                </div>
              </div>

              <section className="dh-card dh-pad dh-place">
                <div className="dh-sh">
                  <h2>Serve placement</h2>
                  <div className="flex" />
                  <span className="lnk">Placement view</span>
                </div>
                <span className="lead">First serves go to the T.</span>
                <div className="courts">
                  {PLACEMENT.map((p) => (
                    <div className="court" key={p.court}>
                      <div className="ct">
                        <span className="nm">{p.court}</span>
                        <div className="flex" />
                        <span className="n">{p.n} serves</span>
                      </div>
                      <div className="bar">
                        <div style={{ width: `${p.t}%`, background: "#3B82F6", borderRadius: "4px 0 0 4px" }} />
                        <div style={{ width: `${p.b}%`, background: "#60A5FA" }} />
                        <div style={{ width: `${p.w}%`, background: "#93C5FD", borderRadius: "0 4px 4px 0" }} />
                      </div>
                      <div className="pc">
                        <span>T {p.t}%</span>
                        <span>Body {p.b}%</span>
                        <span>Wide {p.w}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dh-foot legend">
                  <span className="keys">
                    <span><i style={{ background: "#3B82F6" }} />T</span>
                    <span><i style={{ background: "#60A5FA" }} />Body</span>
                    <span><i style={{ background: "#93C5FD" }} />Wide</span>
                  </span>
                  <div className="flex" />
                  <span>Last <Num>4</Num> · <Num>89</Num> serves</span>
                </div>
                <span className="note">
                  Down the T on both sides, with the wide serve as the change-up — the ad-court body serve is the one you lean on under pressure.
                </span>
              </section>
            </div>
          </div>

          <div className="dh-usage">
            <Ico size={13} stroke="#888888"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></Ico>
            <p>
              <Num>1.4</Num> of <Num>2</Num> hours left this month · free through Dec 31, 2026
            </p>
            <span className="rs">Resets Oct 1</span>
            <span className="sep" />
            <span className="lnk strong">Usage</span>
          </div>
        </main>
      </div>
    </div>
  );
}
