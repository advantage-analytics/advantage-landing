import { Fragment, type ReactNode } from "react";
import { Calendar, ChevronRight, Flag, MapPin } from "lucide-react";
import { DH_W, Ico, RAIL_BOTTOM, RAIL_TOP, spark } from "./dashboard-home";
import "./dashboard-home.css";
import "./mocks.css";

/* Team Home — the program workspace's landing page, ported from
   advantage-dashboard (`app/dashboard/team/page.tsx`, the frame in
   `loading/team-home-skeleton.tsx`, the cards in `components/dashboard/team/`)
   at the same 1440 width the personal Home and the match report use. Same
   shell, same title row and program-summary strip, then the coach's own
   cards: this weekend's dual sheet and the top movers on the left, the
   insight, the court record and the dual history on the right, the team's
   usage footer under it all.

   It is the one product shot that speaks to a coach rather than a player,
   in college tennis's own words — duals, courts, lineups. The program is the
   roster mock's Meridian State, the lineup its six players, so every team
   surface on the site is one program. Static markup, no state, renders on
   the server. Callers make it inert. */

// The team rail, in the dashboard's TEAM_NAV order: Team Home, Schedule,
// Matches, Roster, Opponents, Statistics, Ask. Home, Matches, Statistics and
// Ask share their glyphs with the personal rail.
const TEAM_RAIL: ReactNode[] = [
  RAIL_TOP[0],
  <Fragment key="cal"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></Fragment>,
  RAIL_TOP[1],
  <Fragment key="roster"><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" /></Fragment>,
  RAIL_TOP[3],
  RAIL_TOP[2],
  RAIL_TOP[4],
];

// The page grows to its content in the app; a fixed board cannot, so it is
// cut where the usage footer's bottom padding ends (measured at 1440 wide),
// the way the match report board is.
export const TH_H = 1170;

const GOOD = "#5DB955";
const BAD = "#E51837";

const KPIS = (
  [
    ["Record", "9–2", 2, [5, 5, 6, 7, 7, 8, 9]],
    ["1st serve percentage", "66%", 3.1, [61, 62, 62, 64, 63, 65, 66]],
    ["1st serve won", "72%", 2.4, [68, 69, 70, 70, 71, 71, 72]],
    ["Break points saved", "58%", 6, [50, 52, 51, 54, 55, 57, 58]],
    ["Return games won", "36%", 4.5, [30, 31, 32, 33, 34, 35, 36]],
  ] as const
).map(([label, value, ch, d]) => ({
  label,
  value,
  change: Math.abs(ch),
  up: ch >= 0,
  color: ch >= 0 ? GOOD : BAD,
  ...spark([...d]),
}));

type Form = "w" | "l";
const LINES = [
  { slot: "S1", won: true, us: "Elena Vargas", them: "A. Novak", score: ["6-3", "6-4"], note: "" },
  { slot: "S3", won: true, us: "Maya Chen", them: "S. Patel", score: ["6-2", "6-3"], note: "Report ready" },
  { slot: "S4", won: true, us: "Luca Bianchi", them: "J. Moreau", score: ["7-5", "6-4"], note: "" },
  { slot: "S2", won: false, us: "Rafael Ortiz", them: "K. Brandt", score: ["4-6", "6-7"], note: "Analyzing" },
] as const;
const SINGLES: readonly (Form | "-")[] = ["w", "l", "w", "w", "l", "-"];
const DOUBLES: readonly (Form | "-")[] = ["w", "-", "-"];

const MOVERS = [
  { ini: "MC", name: "Maya Chen", form: ["w", "w", "w", "l", "w"], metric: "1st serve won", value: 74, delta: 6.2 },
  { ini: "PN", name: "Priya Nair", form: ["w", "l", "l", "w", "w"], metric: "Break pts saved", value: 61, delta: 9 },
  { ini: "EV", name: "Elena Vargas", form: ["w", "w", "l", "w", "w"], metric: "Return games won", value: 41, delta: 4.5 },
  { ini: "LB", name: "Luca Bianchi", form: ["l", "w", "w", "l", "w"], metric: "1st serve %", value: 66, delta: 3.1 },
  { ini: "SO", name: "Sam Okafor", form: ["l", "l", "w", "w", "l"], metric: "2nd serve won", value: 47, delta: -5 },
  { ini: "AK", name: "Ava Kim", form: ["w", "l", "w"], metric: "1st serve won", value: 69, delta: 2.8 },
  { ini: "NF", name: "Noah Fischer", form: ["l", "l", "w", "l"], metric: "Break pts saved", value: 44, delta: -3.5 },
] as const;

// The season's eleven duals per court on the dashboard's ramp: won, lost,
// did not play. Seeded so the record is the same every render, weighted
// toward wins on the lower courts — the pattern the insight card names.
const RAMP = { w: "#3B82F6", l: "#B8D4F9", "-": "#F2F2F2" } as const;
type Cell = keyof typeof RAMP;
const RECORD = (() => {
  const rows: Cell[][] = [];
  let s = 3;
  for (let r = 0; r < 6; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < 11; c++) {
      s = (s * 9301 + 49297) % 233280;
      const v = s / 233280;
      const winBias = r >= 3 ? 0.68 : 0.54;
      row.push(v > 0.94 ? "-" : v < winBias ? "w" : "l");
    }
    rows.push(row);
  }
  return rows;
})();

const HISTORY = [
  { ini: "CS", opp: "Coastal State", site: "Meridian", date: "Sep 19", us: 4, them: 3 },
  { ini: "BR", opp: "Bay Ridge", site: "Away", date: "Sep 12", us: 5, them: 2 },
  { ini: "WM", opp: "Westmont", site: "Away", date: "Sep 5", us: 3, them: 4 },
  { ini: "ST", opp: "Sierra Tech", site: "Meridian", date: "Aug 29", us: 6, them: 1 },
];
const SEASON_FORM: readonly Form[] = ["w", "w", "l", "w", "w", "w", "w", "l", "w", "w", "w"];

const Num = ({ children }: { children: ReactNode }) => <span className="tn">{children}</span>;

const Mark = ({ won, size = 14 }: { won: boolean; size?: number }) => (
  <Ico size={size} stroke={won ? GOOD : BAD}>
    <circle cx="12" cy="12" r="10" />
    {won ? <path d="m9 12 2 2 4-4" /> : <><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>}
  </Ico>
);

const Ticks = ({ form }: { form: readonly (Form | "-")[] }) => (
  <span className="th-ticks">
    {form.map((f, i) => (
      <i key={i} className={f === "w" ? "is-w" : f === "l" ? "is-l" : ""} />
    ))}
  </span>
);

export function TeamHome() {
  return (
    <div className="dh th">
      <nav className="dh-rail">
        <div className="dh-ws">
          <span className="slot">
            <span className="ws">MS</span>
          </span>
        </div>
        <div className="dh-rail-gap" />
        <div className="dh-rail-group">
          {TEAM_RAIL.map((ic, i) => (
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
          <span className="slot"><span className="av">DW</span></span>
        </div>
      </nav>

      <div className="dh-main">
        <header className="dh-head">
          <span className="greet">
            <span className="g">Meridian State</span>
            <span className="d">Women · Saturday, Sep 26</span>
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
              <span className="av">DW</span>
              <Ico size={12} stroke="#AAAAAA"><path d="m6 9 6 6 6-6" /></Ico>
            </span>
          </div>
        </header>

        <main className="dh-body">
          <div className="dh-title">
            <div>
              <h1>Team season</h1>
              <div className="sub">
                <span className="meta">
                  <Num>34</Num> matches analyzed · <Num>31</Num> h left this month
                </span>
                <span className="lnk">4 new results since Friday →</span>
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
                  <span className="per">last 5 duals</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dh-grid">
            <div className="dh-col">
              {/* This weekend's dual: who is on each court and where it stands. */}
              <section className="dh-card dh-pad th-dual">
                <div className="dh-sh">
                  <h2>This weekend</h2>
                  <div className="flex" />
                  <span className="lnk strong">Full dual sheet</span>
                </div>
                <div className="head">
                  <div>
                    <span className="opp">Pacific Coast</span>
                    <div className="facts">
                      <span><MapPin size={12} strokeWidth={1.5} />Meridian Tennis Center · Hard</span>
                      <span><Calendar size={12} strokeWidth={1.5} /><Num>Saturday, Sep 26</Num></span>
                      <span><Flag size={12} strokeWidth={1.5} />Clinched at <Num>4–2</Num></span>
                    </div>
                  </div>
                  <div className="flex" />
                  <div className="tally">
                    <span className="score"><b>4</b><i>–</i><span>2</span></span>
                    <span className="strips">
                      <Ticks form={SINGLES} />
                      <em />
                      <Ticks form={DOUBLES} />
                    </span>
                  </div>
                </div>
                <div className="lines">
                  {LINES.map((l) => (
                    <div className="line" key={l.slot}>
                      <span className="slot">{l.slot}</span>
                      <Mark won={l.won} />
                      <span className="us">{l.us}</span>
                      <span className="them">{l.them}</span>
                      <span className="sc">{l.score.join("  ")}</span>
                      <span className="tr">{l.note ? <span className={`chip${l.note === "Analyzing" ? " is-live" : ""}`}>{l.note}</span> : null}</span>
                      <ChevronRight size={13} strokeWidth={1.5} className="chev" />
                    </div>
                  ))}
                </div>
                <div className="dh-foot">
                  <span>Showing <Num>4</Num> of <Num>9</Num> · doubles are score only</span>
                  <div className="flex" />
                  <span><Num>9</Num> matches</span>
                </div>
              </section>

              {/* Who changed the most, and in what. */}
              <section className="dh-card dh-pad th-movers">
                <div className="dh-sh">
                  <h2>Top movers</h2>
                  <div className="flex" />
                  <span className="lnk">Roster</span>
                </div>
                <div className="rows">
                  {MOVERS.map((m) => (
                    <div className="mv" key={m.name}>
                      <span className="av">{m.ini}</span>
                      <span className="nm">{m.name}</span>
                      <Ticks form={m.form} />
                      <span className="k">{m.metric}</span>
                      <span className="v">{m.value}%</span>
                      <span className="d" style={{ color: m.delta >= 0 ? GOOD : BAD }}>
                        {m.delta >= 0 ? "+" : "−"}{Math.abs(m.delta)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="dh-foot">
                  <span>Biggest change in serve and pressure numbers, against everything earlier</span>
                  <div className="flex" />
                  <span><Num>9</Num> players</span>
                </div>
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
                  <span className="lead">Courts 4 through 6 are deciding your duals.</span>
                  <span className="body">
                    Over the last <b>5</b> duals the bottom three courts went <b>11–4</b> while the top three went <b>8–7</b>. Nair’s break points saved is up <b>9</b> since the Coastal dual.
                  </span>
                </div>
                <div className="dh-foot">
                  <span>Court record · break points saved</span>
                  <div className="flex" />
                  <span>5 duals</span>
                </div>
              </div>

              {/* The season's singles results, court by court. */}
              <section className="dh-card dh-pad th-court">
                <div className="dh-sh">
                  <h2>Court record</h2>
                </div>
                <div className="mosaic">
                  {RECORD.map((row, r) => {
                    const wins = row.filter((c) => c === "w").length;
                    const losses = row.filter((c) => c === "l").length;
                    return (
                      <div className="rw" key={r}>
                        <span className="lb">S{r + 1}</span>
                        {row.map((c, i) => (
                          <i key={i} style={{ background: RAMP[c] }} />
                        ))}
                        <i style={{ background: RAMP["-"] }} />
                        <span className="rec">{wins}–{losses}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="dh-foot">
                  <span><Num>11</Num> duals · singles only</span>
                  <div className="flex" />
                  <span>Won · lost, by court</span>
                </div>
              </section>

              {/* The season's decided duals, newest first. */}
              <section className="dh-card dh-pad th-history">
                <div className="dh-sh">
                  <h2>Dual match history</h2>
                  <div className="flex" />
                  <span className="lnk">All duals</span>
                </div>
                <div className="rows">
                  {HISTORY.map((h) => {
                    const won = h.us > h.them;
                    return (
                      <div className="hr" key={h.opp}>
                        <span className="ev">{h.ini}</span>
                        <span className="tx">
                          <span className="o">{h.opp}</span>
                          <span className="s">{h.site} · <span className="mono">{h.date}</span></span>
                        </span>
                        <Mark won={won} size={15} />
                        <span className="sc">
                          <b style={{ color: won ? "#0D0D0D" : "#888888" }}>{h.us}</b>
                          <i>–</i>
                          <b style={{ color: won ? "#888888" : "#0D0D0D" }}>{h.them}</b>
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="dh-foot">
                  <span className="frm"><span className="k">Meridian form</span><Ticks form={SEASON_FORM} /></span>
                  <div className="flex" />
                  <span><Num>9–2</Num> this season</span>
                </div>
              </section>
            </div>
          </div>

          <div className="dh-usage">
            <Ico size={13} stroke="#888888"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></Ico>
            <p>
              <Num>31</Num> of <Num>75</Num> hours left this month · <Num>3</Num> dual weekends left · free through Dec 31, 2026
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

export { DH_W as TH_W };
