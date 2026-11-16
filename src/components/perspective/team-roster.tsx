import type { CSSProperties, ReactNode, Ref } from "react";
import { Ico, RAIL_BOTTOM } from "./dashboard-home";
import { Mark, Num, TEAM_RAIL, Ticks, type Form } from "./team-home";
import "./dashboard-home.css";
import "./mocks.css";

/* The team workspace's Roster page, as a board: everyone who plays for the
   program and the order they play in. It follows the dashboard's roster table
   (roster-table.tsx there): #, Player, Record, Form, Last match, with the
   lineup first and the rest under "Not in the lineup". Column positions,
   the heading line and the two closing lines were checked against the live
   roster page at 1440 wide. Same shell, team and
   people as the Team Home board (team-home.tsx), so the two read as one
   workspace. Every name, record and score here is invented. */

// What the Last match cell says, as the dashboard's roster row does: a result
// against an opponent on a date, or a match still being worked on with its
// analysis status in place of the date.
export type Last =
  | { won: boolean; them: string; when: string }
  | { status: string; working: boolean; them: string };
export type Player = {
  name: string;
  wins: number;
  losses: number;
  form: readonly Form[];
  last: Last;
  // No login of their own yet: staff upload their matches.
  coachManaged?: boolean;
};

export const LINEUP: readonly Player[] = [
  { name: "Elena Vargas", wins: 9, losses: 2, form: ["w", "w", "l", "w", "w"], last: { won: true, them: "A. Novak", when: "Sep 26" } },
  { name: "Rafael Ortiz", wins: 7, losses: 4, form: ["w", "l", "w", "w", "l"], last: { status: "Analyzing", working: true, them: "K. Brandt" } },
  { name: "Maya Chen", wins: 10, losses: 1, form: ["w", "w", "w", "l", "w"], last: { won: true, them: "S. Patel", when: "Sep 26" } },
  { name: "Luca Bianchi", wins: 6, losses: 5, form: ["l", "w", "w", "l", "w"], last: { won: true, them: "J. Moreau", when: "Sep 26" } },
  { name: "Priya Nair", wins: 8, losses: 3, form: ["w", "l", "l", "w", "w"], last: { status: "Uploading 62%", working: true, them: "T. Lindqvist" } },
  { name: "Sam Okafor", wins: 5, losses: 6, form: ["l", "l", "w", "w", "l"], last: { won: false, them: "D. Arce", when: "Sep 26" } },
];

const BENCH: readonly Player[] = [
  { name: "Ava Kim", wins: 3, losses: 1, form: ["w", "l", "w"], last: { won: true, them: "R. Haldane", when: "Sep 19" } },
  { name: "Noah Fischer", wins: 1, losses: 3, form: ["l", "l", "w", "l"], last: { status: "Queued", working: false, them: "M. Oyelaran" } },
  { name: "Jules Tanaka", wins: 2, losses: 2, form: ["w", "l", "l", "w"], last: { won: true, them: "P. Castellan", when: "Sep 12" }, coachManaged: true },
];

const ROSTER_RAIL_INDEX = 3;
const FORM_SLOTS = 5;

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

// The form strip always draws five slots; a player with fewer matches gets
// empty ticks for the rest, as the dashboard's FormStrip does.
const padded = (form: readonly Form[]): (Form | "-")[] => [...form, ...Array<"-">(Math.max(0, FORM_SLOTS - form.length)).fill("-")];

function LastMatch({ last }: { last: Last }) {
  if ("status" in last) {
    return (
      <span className="tr-last">
        <span className="tr-mark">
          <i className="dot" />
        </span>
        <span className="them">{last.them}</span>
        <span className={`tr-status${last.working ? " is-now" : ""}`}>
          <i className="step" />
          <Num>{last.status}</Num>
        </span>
      </span>
    );
  }
  return (
    <span className="tr-last">
      <span className="tr-mark">
        <Mark won={last.won} size={14} />
      </span>
      <span className="them">{last.them}</span>
      <span className="when">
        <Num>{last.when}</Num>
      </span>
    </span>
  );
}

function Row({ p, spot, style, className }: { p: Player; spot?: number; style?: CSSProperties; className?: string }) {
  return (
    <li className={`tr-row${className ? ` ${className}` : ""}`} style={style}>
      <span className="tr-spot">{spot ?? "—"}</span>
      <span className="tr-player">
        {/* The dashboard's avatar: a photo when the player has one, their
            initials when not. These invented players have no photos. */}
        <span className="tr-av">{initials(p.name)}</span>
        <span className="nm">{p.name}</span>
        {p.coachManaged ? (
          <span className="tr-managed">
            <Ico size={14} stroke="#AAAAAA">
              <path d="M2 21a8 8 0 0 1 10.434-7.62" />
              <circle cx="10" cy="8" r="5" />
              <circle cx="18" cy="18" r="3" />
              <path d="m19.5 14.3-.4.9" />
              <path d="m16.9 20.8-.4.9" />
              <path d="m21.7 19.5-.9-.4" />
              <path d="m15.2 16.9-.9-.4" />
              <path d="m21.7 16.5-.9.4" />
              <path d="m15.2 19.1-.9.4" />
              <path d="m19.5 21.7-.4-.9" />
              <path d="m16.9 15.2-.4-.9" />
            </Ico>
          </span>
        ) : null}
      </span>
      <span className="tr-record">
        <Num>
          {p.wins}–{p.losses}
        </Num>
      </span>
      <span className="tr-form">
        <Ticks form={padded(p.form)} />
      </span>
      <LastMatch last={p.last} />
    </li>
  );
}

/* The board takes a few optional hooks so the roster tour (roster-tour.tsx)
   can drive it: the lineup's order, a style or class per lineup row (for the
   drag), what a row's Last match cell says (for a match turning ready), a
   ref to the table card and an overlay drawn inside it (the cursor and the
   tooltips). With none of them it is the still board. */
export function TeamRoster({
  lineup = LINEUP,
  rowStyle,
  rowClass,
  lastFor,
  cardRef,
  overlay,
  drawer,
}: {
  lineup?: readonly Player[];
  rowStyle?: (p: Player, i: number) => CSSProperties | undefined;
  rowClass?: (p: Player, i: number) => string | undefined;
  lastFor?: (p: Player) => Last;
  cardRef?: Ref<HTMLDivElement>;
  overlay?: ReactNode;
  // Drawn over the whole board, for the player drawer the tour opens.
  drawer?: ReactNode;
} = {}) {
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
            <div className={`dh-rail-item${i === ROSTER_RAIL_INDEX ? " on" : ""}`} key={i}>
              <span className="slot">
                <Ico>{ic}</Ico>
              </span>
            </div>
          ))}
        </div>
        <div className="flex" />
        <div className="dh-rail-group">
          {RAIL_BOTTOM.map((ic, i) => (
            <div className="dh-rail-item" key={i}>
              <span className="slot">
                <Ico>{ic}</Ico>
              </span>
            </div>
          ))}
        </div>
        <div className="dh-rail-me">
          <span className="slot">
            <span className="av">DW</span>
          </span>
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
              <Ico size={14}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </Ico>
              <span>Search</span>
            </span>
            <span className="sep" />
            <span className="me">
              <span className="av">DW</span>
              <Ico size={12} stroke="#AAAAAA">
                <path d="m6 9 6 6 6-6" />
              </Ico>
            </span>
          </div>
        </header>

        <main className="dh-body">
          <div className="dh-title">
            <div>
              <h1>Roster</h1>
              <div className="sub">
                <span className="meta">
                  Women · <Num>{LINEUP.length + BENCH.length}</Num> players · <Num>1</Num> coach-managed ·{" "}
                  <Num>16</Num> of <Num>25</Num> seats free
                </span>
              </div>
            </div>
            <div className="flex" />
            <span className="tr-ghost">Invite</span>
            <span className="dh-new">Add player</span>
          </div>

          <div className="dh-card tr-card" ref={cardRef}>
            <div className="tr-row tr-head">
              <span className="tr-spot">#</span>
              <span className="tr-player">Player</span>
              <span className="tr-record">Record</span>
              <span className="tr-form">Form</span>
              <span className="tr-last">Last match</span>
              <span className="tr-set">Set lineup</span>
            </div>
            <ol className="tr-list">
              {lineup.map((p, i) => (
                <Row
                  p={lastFor ? { ...p, last: lastFor(p) } : p}
                  spot={i + 1}
                  style={rowStyle?.(p, i)}
                  className={rowClass?.(p, i)}
                  key={p.name}
                />
              ))}
            </ol>
            <div className="tr-div">
              <span>Not in the lineup</span>
              <span className="n">
                <Num>{BENCH.length}</Num>
              </span>
            </div>
            <ol className="tr-list">
              {BENCH.map((p) => (
                <Row p={p} key={p.name} />
              ))}
            </ol>
            {overlay}
          </div>
          {/* The page's two closing lines, worded as the dashboard words them. */}
          <p className="tr-foot">
            Coached by Dana Whitfield. <span className="lnk">Manage staff →</span>
          </p>
          <p className="tr-foot">Anyone on the team can upload for a teammate — analysis time resets Oct 1.</p>
        </main>
      </div>
      {drawer}
    </div>
  );
}
