"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { DashboardHome } from "./dashboard-home";
import { useScaleToFit } from "@/lib/use-scale-to-fit";
import { links } from "@/lib/links";
import { trackCta, trackEvent } from "@/lib/analytics";
import { BETA_END_SHORT } from "@/lib/pilot";

/* ===========================================================
   HERO PHOTO SLOT
   A portrait photo (4:5), shown whole, never cropped, on the right of
   the hero. A blurred copy of it sits around it as a soft halo that
   thins out to nothing toward the copy, so the picture has no frame. To swap: drop another
   photo at public/assets/marketing/hero-*.jpg, change this one import,
   rewrite `alt`, and set `ratio` to the new file's width / height. Keep
   the subject out of the outer ~10% of the frame: that is the fade.
   =========================================================== */
import heroPhoto from "../../../public/assets/marketing/hero-fist-pump.jpg";

const HERO_PHOTO = {
  src: heroPhoto,
  alt: "A tennis player in a blue shirt and cap shouts and pumps a fist after winning a point.",
  ratio: "4 / 5",
};

const HERO_EYEBROW = `Free through ${BETA_END_SHORT}`;

/* Headline options, all outcome-first and readable with zero context
   (a visitor may land here straight from a creator's link):

     1. "Film your match. See how to win the next one."   ← shipped
     2. "Let this be your new tennis coach."
     3. "Your match, explained. From a video on your phone."

   1 ships because it says what you do and what you get in eight plain
   words. 2 is warmer but promises a coach before the page has shown
   anything; 3 is clear but has no outcome in it. */
const HERO_TITLE = ["Film your match.", "See how to win the next one."];
const HERO_SUB =
  "Upload a video from your phone. Advantage shows where you won points, where you lost them, and what to work on.";

/* ===========================================================
   Human hero — one responsive composition, two tiers.

   Top: the copy on navy, and beside it the photo, standing on the
   screen's top edge and shown whole. A blurred copy of it surrounds it
   and fades out toward the copy, so the player is never cut off and the
   picture melts into the navy the type sits on.
   Below both: the dashboard on a computer screen, running the container's
   width, fading out into the next section so the hero has no hard bottom
   edge.

   • ≥1024px: copy left, photo right, screen under both.
   • <1024px: copy, then the photo full width, then the screen, drawn wider
     than the viewport so it stays legible and runs off the right edge. Both
     sign-up buttons stay above the fold on a 375×667 phone.
   =========================================================== */

// The screen is the dashboard Home's 1440 artboard under a browser bar, cut
// off partway down: the fade covers the cut. The fit hook and the
// pre-hydration height reservation (aspect-ratio, inline below) share these.
const SCREEN_W = 1440;
const SCREEN_BAR_H = 40;
const SCREEN_H = SCREEN_BAR_H + 640;

function HeroScreen() {
  const { outerRef, innerRef } = useScaleToFit({ width: SCREEN_W, height: SCREEN_H });
  return (
    // Decorative: the same dashboard Home the product bands describe.
    <div className="hh-screen" aria-hidden="true">
      <div ref={outerRef} className="hh-screen-fit" style={{ aspectRatio: `${SCREEN_W} / ${SCREEN_H}` }}>
        <div ref={innerRef} className="hh-screen-art" style={{ width: SCREEN_W }} inert>
          <div className="hh-bar" style={{ height: SCREEN_BAR_H }}>
            <span className="dots">
              <i style={{ background: "#FF5F57" }} />
              <i style={{ background: "#FEBC2E" }} />
              <i style={{ background: "#28C840" }} />
            </span>
            <span className="url">app.advantage-analytics.com</span>
          </div>
          <DashboardHome />
        </div>
      </div>
    </div>
  );
}

// The two lanes: individuals sign up in the app, and so do coaches, who then
// find their team there.
function HeroActions() {
  return (
    <div className="h-actions">
      <a
        className="hbtn hbtn-white"
        href={links.signUp}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCta("join_free_beta", "home-hero")}
      >
        Join Free Beta
        <ArrowUpRight size={16} />
      </a>
      <a
        className="hbtn hbtn-glass"
        href={links.signUp}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCta("find_your_team", "home-hero")}
      >
        Find Your Team
        <ArrowUpRight size={16} />
      </a>
    </div>
  );
}

export function PerspectiveHero() {
  return (
    <header className="hh" id="top">
      <div className="hh-top">
        <div className="wrap hh-inner">
          <div className="hh-copy">
            <span className="h-eyebrow">{HERO_EYEBROW}</span>
            <h1 className="h-title hh-title">
              <span>{HERO_TITLE[0]}</span> <span>{HERO_TITLE[1]}</span>
            </h1>
            <p className="h-sub hh-sub">{HERO_SUB}</p>
            <HeroActions />
            <a className="hh-more" href="#how" onClick={() => trackEvent("see_how_it_works_click", { placement: "home-hero" })}>
              See how it works
              <ArrowDown size={15} />
            </a>
          </div>
        </div>
        <div className="hh-scene">
          {/* The same photo again, stretched and blurred: a soft halo of the
              wall and the court that fades out before it reaches the copy. */}
          <div className="hh-ext" aria-hidden="true">
            <Image src={HERO_PHOTO.src} alt="" fill sizes="320px" />
          </div>
          <div className="hh-photo" style={{ aspectRatio: HERO_PHOTO.ratio }}>
            <Image src={HERO_PHOTO.src} alt={HERO_PHOTO.alt} fill preload sizes="(max-width: 1023px) 80vw, 480px" placeholder="blur" />
          </div>
        </div>
      </div>
      <div className="wrap hh-screen-wrap">
        <HeroScreen />
      </div>
    </header>
  );
}
