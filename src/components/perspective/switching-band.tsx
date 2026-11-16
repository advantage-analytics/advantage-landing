import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EXPORT_GUIDE_HREF } from "@/lib/match-video";

/* For a visitor who already films with another app: their exports work here.
   Off until it is decided whether the page names another product; flip
   SHOW_SWITCHING_BAND to show it. */
export const SHOW_SWITCHING_BAND = false;

export function SwitchingBand() {
  if (!SHOW_SWITCHING_BAND) return null;
  return (
    <section className="band" id="switching">
      <div className="wrap">
        <div className="switch-band reveal">
          <div className="sec-head">
            <span className="eyebrow">Switching</span>
            <h2>Already on SwingVision? Bring your exports.</h2>
          </div>
          <Link className="btn btn-outline btn-lg" href={`${EXPORT_GUIDE_HREF}#swingvision`}>
            Read the export guide
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
