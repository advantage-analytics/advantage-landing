import { ProofHead } from "./band-parts";
import { MockFrame } from "./mock-frame";
import { FindTeamLink } from "./cta-links";
import { TeamHome, TH_W } from "./team-home";
import { PILOT_HOURS } from "@/lib/pilot";

/* The team band: the program workspace's Home, the one product shot that
   speaks to a coach rather than a player — this weekend's dual sheet, who is
   moving, the court record and the dual history. On the proof skeleton the
   other product bands use: the head, the board full width below it, and the
   coach lane's way in as one blue text link under the board, no note: the
   board does the persuading.

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
        <ProofHead
          eyebrow="Team workspace"
          title="Every dual, every court, one page."
          aside={`Lineups, every court’s record and who’s trending. ${PILOT_HOURS} of film a month, shared.`}
        />
        <div
          className="proof-board reveal"
          role="img"
          aria-label="The Advantage team workspace Home: this weekend's dual sheet with the lineup and score, the program summary, top movers, the season's court record by court, and the dual match history."
        >
          <MockFrame className="is-light is-cropped" width={TH_W} height={TH_VIEW}>
            <div inert className="film-inert">
              <TeamHome />
            </div>
          </MockFrame>
        </div>
        <p className="proof-cta reveal">
          <FindTeamLink className="proof-link" placement="home-team" icon={14}>
            Find your team
          </FindTeamLink>
        </p>
      </div>
    </section>
  );
}
