import type { CSSProperties } from "react";
import { ProofSide } from "./band-parts";
import { MockFrame } from "./mock-frame";
import { FindTeamLink } from "./cta-links";
import { TeamHome, TH_W } from "./team-home";

/* The team band: the program workspace's Home, the one product shot that
   speaks to a coach rather than a player — this weekend's dual sheet, who is
   moving, the court record and the dual history. On the proof skeleton the
   other product bands use: copy and the coach lane's action in the left
   column, the board beside them.

   The Team Home is the tallest board on the site (1170 native), so the band
   shows its top — title, program summary, the dual sheet, the insight and
   the court record — through a fixed window with the board fading out at
   the bottom, the way a page continues below the fold. The board itself is
   `team-home.tsx`. */
const TH_VIEW = 944;

export function TeamBand() {
  return (
    <section className="band alt proof-band" id="team">
      <div className="wrap">
        <div className="proof" style={{ "--ratio": TH_W / TH_VIEW } as CSSProperties}>
          <ProofSide
            eyebrow="Team workspace"
            title="Every dual, every court, one page."
            aside="This weekend’s lineup, the season’s court record and who is moving. Coaches send the video, and the team shares the hours."
          >
            <div className="proof-cta reveal">
              <FindTeamLink className="btn btn-lg btn-ink" placement="home-team" />
              <span className="note">Coaches sign up with a school email and find their team in the dashboard. Instant if you’re on the staff list.</span>
            </div>
          </ProofSide>
          <div
            className="proof-board"
            role="img"
            aria-label="The Advantage team workspace Home: this weekend's dual sheet with the lineup and score, the program summary, top movers, the season's court record by court, and the dual match history."
          >
            <MockFrame className="is-light is-cropped" width={TH_W} height={TH_VIEW}>
              <div inert className="film-inert">
                <TeamHome />
              </div>
            </MockFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
