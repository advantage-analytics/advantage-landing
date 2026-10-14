import type { ReactNode } from "react";
import { Check } from "lucide-react";
import "./dashboard-home.css";
import "./mocks.css";

/* Match report pieces — cards from the dashboard's single-match report
   (ported from advantage-dashboard, `app/dashboard/matches/[matchId]`), each
   exported on its own for the home page's "what you'll see" strip and its
   how-it-works step: the insight, the scoreboard and the endings chart.

   The match is Quan v Gomez at Indian Wells. Every figure here is invented
   but internally consistent — the endings bars sum to the winner and
   error counts.

   Static markup, no state, renders on the server. Callers make it inert. */

const YOU = "Quan";
const OPP = "Gomez";

// Blue is the viewer, slate the opponent — the dashboard's `--viz-you` and
// `--viz-opp` ramps, deep → base → mid → light.
const VIZ = {
  you: ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"],
  opp: ["#475569", "#64748B", "#94A3B8", "#CBD5E1"],
} as const;

/* ---------- how points ended ---------- */
const ENDINGS = [
  { key: "Winners", you: 28, opp: 22 },
  { key: "Aces", you: 7, opp: 4 },
  { key: "Unforced", you: 19, opp: 27 },
  { key: "Double faults", you: 2, opp: 5 },
];

function Eyebrow({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="dh-sh">
      <h2>{children}</h2>
      <div className="flex" />
      {aside ? <span className="mb-micro">{aside}</span> : null}
    </div>
  );
}

/* ---------- the pieces ----------
   The app's own markup for each card, so the page shows a true crop of the
   report rather than a redrawn one. There is no `.dh` shell around them on
   the page, so callers wrap them in `.mb-crop` (mocks.css), which restores
   the shell utilities they lean on. */

export function MatchInsight() {
  return (
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
      </div>
    </div>
  );
}

export function MatchScore() {
  return (
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
  );
}

// `large`: the chart given a card of its own, its bars grown to fill it.
export function MatchEndings({ large = false }: { large?: boolean } = {}) {
  return (
    <section className={`dh-card mb-chart${large ? " is-lg" : ""}`}>
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
  );
}
