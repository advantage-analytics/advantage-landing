import type { CSSProperties } from "react";
import { BandHead } from "./band-parts";
import { ApplyPilotLink, JoinBetaLink } from "./cta-links";
import { BETA_END_SHORT } from "@/lib/pilot";

/* The two ways in, side by side. This is the one place on the page the lanes
   are cards: the figure is the whole comparison (2 hrs against 75), so it gets
   the size, and each card ends on its own CTA. Individuals get the ink button,
   programs the outlined one, so the pair never reads as primary/secondary. */

const LANES = [
  {
    label: "Free beta · Individuals",
    fig: "2 hrs",
    qual: "of film a month",
    points: ["Self-serve. No program or card needed", "Full dashboard and film room", `Free through ${BETA_END_SHORT}`],
    cta: <JoinBetaLink className="btn btn-lg btn-ink" placement="home-beta-card" />,
    note: "Sign up in a minute.",
  },
  {
    label: "Fall pilot · Programs",
    fig: "75 hrs",
    qual: "of film a month, shared by the team",
    points: ["For college programs", "Team roster and shared film", "No hardware, no contract"],
    cta: <ApplyPilotLink className="btn btn-lg btn-outline" placement="home-beta-card" />,
    note: "Apply on the pilot page.",
  },
];

export function BetaTerms() {
  return (
    <section className="band alt" id="beta">
      <div className="wrap">
        <BandHead
          eyebrow="Beta terms"
          title={`Free through ${BETA_END_SHORT}. Two ways in.`}
          aside="Players sign up and start. Programs apply for the fall pilot."
        />
        <div className="beta-grid">
          {LANES.map((l, i) => (
            <div className="beta-card reveal" key={l.label} style={{ "--ri": i } as CSSProperties}>
              <span className="beta-label">{l.label}</span>
              <div className="beta-fig">
                <span className="n">{l.fig}</span>
                <span className="q">{l.qual}</span>
              </div>
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
          ))}
        </div>
      </div>
    </section>
  );
}
