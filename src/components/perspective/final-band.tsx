import { FreeMatchLink, TalkToUsLink } from "./cta-links";
import { FREE_MATCH_LINE, FREE_MATCH_OFFER } from "@/lib/plans";
import { LiveDots } from "./live-dots";

/* The page's one dark band: the closing ask and the hero's two buttons again.
   The hero promised what the product does; by here the visitor has seen it,
   so the headline names the first move instead of repeating the promise. The
   ghost button wears the same glass as the header and hero CTAs, so the three
   dark-surface buttons on the site are one control. */
export function FinalBand() {
  return (
    <section className="band final-band" id="start">
      <div className="ac-glow" aria-hidden="true" />
      <LiveDots className="ac-grain" energy={1} />
      <div className="final-inner reveal">
        <span className="eyebrow">Get started</span>
        <h2>{FREE_MATCH_OFFER ? FREE_MATCH_LINE : "Start with the match you already filmed."}</h2>
        <div className="final-actions">
          <FreeMatchLink className="hbtn hbtn-white" placement="home-final" />
          <TalkToUsLink className="hbtn hbtn-glass" placement="home-final" />
        </div>
        <span className="final-note">Start with the match you already filmed.</span>
      </div>
    </section>
  );
}
