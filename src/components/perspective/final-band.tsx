import { ApplyPilotLink, JoinBetaLink } from "./cta-links";
import { BETA_END_SHORT } from "@/lib/pilot";

/* The page's one dark band: the hero's headline again, both lanes again, and
   the two allowances in one line of small print. Same navy, glow and grain as
   the access card on /pilot, so the two dark moments on the site are one
   material. */
export function FinalBand() {
  return (
    <section className="band final-band" id="start">
      <div className="ac-glow" aria-hidden="true" />
      <div className="ac-grain" aria-hidden="true" />
      <div className="final-inner reveal">
        <span className="eyebrow">Public beta</span>
        <h2>Walk on court knowing the pattern.</h2>
        <div className="final-actions">
          <JoinBetaLink className="hbtn hbtn-white" placement="home-final" />
          <ApplyPilotLink className="hbtn final-glass" placement="home-final" />
        </div>
        <span className="final-note">
          Beta 2 hrs/month · pilot programs 75. Free through {BETA_END_SHORT}.
        </span>
      </div>
    </section>
  );
}
