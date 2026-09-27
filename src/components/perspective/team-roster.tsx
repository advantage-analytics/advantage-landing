import { Fragment, type ReactNode } from "react";
import { BandHead } from "./band-parts";
import { MockFrame } from "./mock-frame";
import { DH_W, Ico, RAIL_BOTTOM, RAIL_TOP } from "./dashboard-home";
import "./dashboard-home.css";

/* Team roster — the program workspace's Roster page, ported from
   advantage-dashboard (`app/dashboard/team/roster` and
   `components/dashboard/team/roster-table.tsx`) at the same 1440×900 the
   personal Home mock uses, so the two product shots on the page read as one
   app. The rail is the team workspace's (Team Home, Schedule, Matches,
   Roster, Opponents, Statistics, Ask); the header carries the workspace
   title and squad the way the app does on a top-level team route.

   It is the one product shot that speaks to a coach rather than a player:
   the squad in lineup order, who is coach-managed, who is still an invite,
   and the footer's rule about who sends the video. Values are the
   dashboard's tokens in design pixels; the frame scales the whole board. */

type Form = "w" | "l" | "-";
type Player = {
  spot?: number;
  ini: string;
  name: string;
  managed?: boolean;
  wins: number;
  losses: number;
  form: readonly Form[];
  last?: { won: boolean; vs: string; on: string };
};

// Six lineup spots, then the players out of the lineup. Data as the "Roster —
// managed pill & seats" design canvas has it.
const LINEUP: readonly Player[] = [
  { spot: 1, ini: "EV", name: "Elena Vargas", wins: 9, losses: 2, form: ["w", "w", "l", "w", "w"], last: { won: true, vs: "A. Novak", on: "Sep 14" } },
  { spot: 2, ini: "RO", name: "Rafael Ortiz", wins: 8, losses: 3, form: ["w", "l", "w", "w", "l"], last: { won: false, vs: "K. Brandt", on: "Sep 14" } },
  { spot: 3, ini: "MC", name: "Maya Chen", managed: true, wins: 7, losses: 3, form: ["w", "w", "w", "l", "w"], last: { won: true, vs: "S. Patel", on: "Sep 13" } },
  { spot: 4, ini: "LB", name: "Luca Bianchi", managed: true, wins: 6, losses: 4, form: ["l", "w", "w", "l", "w"], last: { won: true, vs: "J. Moreau", on: "Sep 13" } },
  { spot: 5, ini: "PN", name: "Priya Nair", managed: true, wins: 5, losses: 4, form: ["w", "l", "l", "w", "w"], last: { won: true, vs: "H. Ito", on: "Sep 12" } },
  { spot: 6, ini: "SO", name: "Sam Okafor", managed: true, wins: 4, losses: 5, form: ["l", "l", "w", "w", "l"], last: { won: false, vs: "D. Silva", on: "Sep 12" } },
];
const BENCH: readonly Player[] = [
  { ini: "AK", name: "Ava Kim", managed: true, wins: 3, losses: 2, form: ["w", "l", "w"], last: { won: true, vs: "R. Lind", on: "Sep 10" } },
  { ini: "NF", name: "Noah Fischer", managed: true, wins: 1, losses: 3, form: ["l", "l", "w", "l"], last: { won: false, vs: "T. Grant", on: "Sep 8" } },
  { ini: "IM", name: "Isla Moreno", managed: true, wins: 0, losses: 0, form: [] },
];

// The team rail, in the dashboard's TEAM_NAV order. Home, Matches, Opponents,
// Statistics and Ask share their glyphs with the personal rail.
const TEAM_RAIL: ReactNode[] = [
  RAIL_TOP[0],
  <Fragment key="cal"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></Fragment>,
  RAIL_TOP[1],
  <Fragment key="roster"><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" /></Fragment>,
  RAIL_TOP[3],
  RAIL_TOP[2],
  RAIL_TOP[4],
];
const ROSTER_INDEX = 3;

// The dashboard's page grows to its content; a fixed board can't, so it is
// cut where the roster's footer padding ends (measured: 876px at 1440 wide)
// rather than carrying the Home mock's 900 and a dead strip under the footer.
const ROSTER_H = 876;

const Dash = () => <span className="empty" aria-hidden="true">—</span>;

const Mark = ({ won }: { won: boolean }) => (
  <Ico size={14} stroke={won ? "#5DB955" : "#E51837"}>
    <circle cx="12" cy="12" r="10" />
    {won ? <path d="m9 12 2 2 4-4" /> : <><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>}
  </Ico>
);

function Row({ p }: { p: Player }) {
  const played = p.wins + p.losses > 0;
  return (
    <li className="tr-row">
      <span className={`c-spot${p.spot ? "" : " none"}`}>{p.spot ?? "—"}</span>
      <span className="c-player">
        <span className="av">{p.ini}</span>
        <span className="nm">{p.name}</span>
        {p.managed ? <span className="pill">Coach-managed</span> : null}
      </span>
      <span className="flex" />
      <span className="c-record">{played ? `${p.wins}–${p.losses}` : <Dash />}</span>
      <span className="c-form">
        {p.form.map((f, i) => (
          <i key={i} className={f === "w" ? "is-w" : "is-l"} />
        ))}
        {Array.from({ length: 5 - p.form.length }, (_, i) => (
          <i key={`g${i}`} />
        ))}
      </span>
      {p.last ? (
        <span className="c-last">
          <span className="mk"><Mark won={p.last.won} /></span>
          <span className="vs">{p.last.vs}</span>
          <span className="on">{p.last.on}</span>
        </span>
      ) : (
        <span className="c-last"><Dash /></span>
      )}
    </li>
  );
}

function RosterMock() {
  return (
    <div className="dh tr">
      <nav className="dh-rail">
        <div className="dh-ws">
          <span className="slot">
            <span className="ws team">MS</span>
          </span>
        </div>
        <div className="dh-rail-gap" />
        <div className="dh-rail-group">
          {TEAM_RAIL.map((ic, i) => (
            <div className={`dh-rail-item${i === ROSTER_INDEX ? " on" : ""}`} key={i}>
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
            <span className="d">Women</span>
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

        <main className="tr-body">
          <div className="tr-title">
            <div>
              <h1>Roster</h1>
              <div className="sub">
                Women · <span className="tn">9 players</span> · <span className="tn">7 coach-managed</span> ·{" "}
                <span className="tn">1 invite pending</span> · <span className="tn">15 of 25 seats free</span>
              </div>
            </div>
            <div className="tr-actions">
              <span className="btn ghost">Invite</span>
              <span className="btn primary">Add player</span>
            </div>
          </div>

          <div className="tr-card">
            <div className="tr-head">
              <span className="c-spot">#</span>
              <span className="c-player">Player</span>
              <span className="flex" />
              <span className="c-record">Record</span>
              <span className="c-form">Form</span>
              <span className="c-last">
                Last match
                <span className="set">
                  <Ico size={12} stroke="currentColor">
                    <circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" />
                    <circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />
                  </Ico>
                  Set lineup
                </span>
              </span>
            </div>
            <ul>
              {LINEUP.map((p) => <Row p={p} key={p.name} />)}
              <li className="tr-bench">Not in the lineup</li>
              {BENCH.map((p) => <Row p={p} key={p.name} />)}
              <li className="tr-invited">Invited</li>
              <li className="tr-row is-invite">
                <span className="c-spot none">—</span>
                <span className="c-player">
                  {/* The app draws this as a 1px dashed CSS border. Scaled to the
                      band it rasterizes as a faint solid ring, so here the dashes
                      are an SVG stroke with an explicit pattern. */}
                  <svg className="inv-ring" width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                    <circle cx="13" cy="13" r="12.5" fill="none" stroke="#CCCCCC" strokeWidth="1.2" strokeDasharray="3.5 2.6" />
                  </svg>
                  <span className="em">jules.hart@meridian.edu</span>
                </span>
                <span className="by">Invited <span className="mono">Sep 16</span> by you · player role</span>
                <span className="flex" />
                <span className="acts">
                  <span className="lnk strong">Resend</span>
                  <span className="rev">Revoke</span>
                </span>
              </li>
            </ul>
          </div>

          <div className="tr-foot">
            <p>
              Coached by Dana Whitfield and Chris Alvarez. <span className="lnk strong">Manage staff →</span>
            </p>
            <p className="dim">The owner and coaches can upload for any player — analysis time resets Oct 1.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export function TeamRoster() {
  return (
    <section className="band alt" id="team">
      <div className="wrap">
        <BandHead
          eyebrow="Team workspace"
          title="The whole roster, in one place."
          aside="Every player’s record, form and last match on one page. Coaches send the video, and the team shares the hours."
        />
        <div
          role="img"
          aria-label="The Advantage team workspace roster: nine players in lineup order with their record, recent form and last match, a pending invitation, and the coaching staff."
        >
          <MockFrame className="is-team" width={DH_W} height={ROSTER_H}>
            <div inert className="film-inert">
              <RosterMock />
            </div>
          </MockFrame>
        </div>
      </div>
    </section>
  );
}
