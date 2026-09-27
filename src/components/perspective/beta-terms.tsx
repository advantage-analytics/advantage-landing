import { Fragment, type CSSProperties } from "react";
import { BandHead } from "./band-parts";
import { ApplyPilotLink, JoinBetaLink } from "./cta-links";
import { BETA_END_SHORT } from "@/lib/pilot";

/* The two lanes, routed by who the visitor is. These are not tiers to weigh
   against each other: an individual player is on the free beta, a college
   program is on the fall pilot, and nobody chooses between them. So each card
   opens with the question the visitor answers about themselves, the hours are
   a plain fact rather than a headline figure, and both CTAs share one ink
   button so neither lane reads as the better plan.

   Both cards run on one six-row structure (question, sentence, three facts,
   action). On desktop the pair's rows are shared through subgrid, so every
   line sits level with its opposite whatever wraps. */

const LANES = [
  {
    ask: "An individual player?",
    line: "You're on the free beta. Sign up and start on your own.",
    points: ["Full dashboard and film room", "2 hours of film a month", "No program or card needed"],
    cta: <JoinBetaLink className="btn btn-lg btn-ink" placement="home-beta-card" />,
    note: "Takes about a minute.",
  },
  {
    ask: "With a college program?",
    line: "Your team is on the fall pilot. Your program applies once for everyone.",
    points: ["Team roster and shared film", "75 hours of film a month, shared by the team", "No hardware, no contract"],
    cta: <ApplyPilotLink className="btn btn-lg btn-ink" placement="home-beta-card" />,
    note: "Details and application on the pilot page.",
  },
];

export function BetaTerms() {
  return (
    <section className="band alt" id="beta">
      <div className="wrap">
        <BandHead
          title="One plan for players. One for college programs."
          aside={`Both are free through ${BETA_END_SHORT}. You're on whichever one fits you.`}
        />
        <div className="beta-pair">
          {LANES.map((l, i) => (
            <Fragment key={l.ask}>
              {i > 0 ? (
                <span className="beta-or" aria-hidden="true">
                  or
                </span>
              ) : null}
              <div className="beta-card reveal" style={{ "--ri": i } as CSSProperties}>
                <h3 className="beta-ask">{l.ask}</h3>
                <p className="beta-line">{l.line}</p>
                <ul className="beta-list">
                  {l.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <div className="beta-cta">
                  {l.cta}
                  <span className="note">{l.note}</span>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
