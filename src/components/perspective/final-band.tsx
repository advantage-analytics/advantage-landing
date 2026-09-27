import { FindTeamLink, JoinBetaLink } from "./cta-links";
import { BETA_END_SHORT } from "@/lib/pilot";

/* The page's one dark band: the free window, the closing ask, both lanes
   again, and the two allowances in one line of small print. The eyebrow
   carries the date, so the small print doesn't repeat it. The hero promised
   what the product does; by here the visitor has seen it, so the headline
   names the first move instead of repeating the promise. Same navy, glow and
   grain as the access card on /pilot, so the two dark moments on the site are
   one material. The ghost lane wears the same glass as the header and hero
   CTAs, so the three dark-surface buttons on the site are one control. */
export function FinalBand() {
  return (
    <section className="band final-band" id="start">
      <div className="ac-glow" aria-hidden="true" />
      <div className="ac-grain" aria-hidden="true" />
      <div className="final-inner reveal">
        <span className="eyebrow">Free through {BETA_END_SHORT}</span>
        <h2>Start with the match you already filmed.</h2>
        <div className="final-actions">
          <JoinBetaLink className="hbtn hbtn-white" placement="home-final" />
          <FindTeamLink className="hbtn hbtn-glass" placement="home-final" />
        </div>
        <span className="final-note">
          Players get 2 hours of film a month. Pilot programs get 75.
        </span>
      </div>
    </section>
  );
}
