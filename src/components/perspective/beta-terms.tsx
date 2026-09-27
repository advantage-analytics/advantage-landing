import { FindTeamLink, JoinBetaLink } from "./cta-links";
import { BETA_END_SHORT, PILOT_HOURS } from "@/lib/pilot";
import { LiveDots } from "./live-dots";

/* The two lanes, routed by who the visitor is. These are not tiers to weigh
   against each other: an individual player is on the free beta, a college
   program is on the fall pilot, and nobody chooses between them. So each lane
   opens with the question the visitor answers about themselves, the hours are
   a plain fact rather than a headline figure, and both CTAs are the same
   white button so neither lane reads as the better plan. The lanes sit as
   the two halves of one panel (see perspective.css). */

const LANES = [
  {
    tag: "Players",
    ask: "An individual player?",
    line: "You're on the free beta. Sign up and upload your first match.",
    points: ["Full dashboard and film room", "2 hours of film a month", "No program or card needed"],
    cta: <JoinBetaLink className="hbtn hbtn-white" placement="home-beta-card" />,
    note: "Takes about a minute.",
  },
  {
    tag: "College programs",
    ask: "With a college program?",
    line: "Your program is on the fall pilot. Sign up, then find your team in the dashboard.",
    points: ["Team roster and shared film", `${PILOT_HOURS} of film a month, shared by the team`, "No hardware, no contract"],
    cta: <FindTeamLink className="hbtn hbtn-white" placement="home-beta-card" />,
    note: "Instant with your school email.",
  },
];

export function BetaTerms() {
  return (
    <section className="band alt" id="beta">
      <div className="wrap">
        <div className="beta-head reveal">
          <div className="sec-head">
            <span className="eyebrow">Access</span>
            <h2>
              One plan for players. <span className="beta-h2-tail">One for college programs.</span>
            </h2>
          </div>
          <p className="band-aside">
            Both are free through {BETA_END_SHORT}.{" "}
            <span className="beta-h2-tail">Start with the one that describes you.</span>
          </p>
        </div>
        <div className="beta-panel reveal">
          <div className="ac-glow" aria-hidden="true" />
          <LiveDots className="ac-grain" />
          {LANES.map((l) => (
            <div className="beta-lane" key={l.ask}>
              <span className="beta-tag">{l.tag}</span>
              <h3 className="beta-ask">{l.ask}</h3>
              <p className="beta-line">{l.line}</p>
              <ul className="beta-facts">
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
