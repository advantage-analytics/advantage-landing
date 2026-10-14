"use client";

import type { CSSProperties } from "react";
import Image, { getImageProps } from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { DashboardHome } from "./dashboard-home";
import { LiveDots } from "./live-dots";
import { useScaleToFit } from "@/lib/use-scale-to-fit";
import { links } from "@/lib/links";
import { trackCta, trackEvent } from "@/lib/analytics";
import { BETA_END_SHORT } from "@/lib/pilot";

/* ===========================================================
   HERO PHOTO SLOT
   A portrait photo, shown whole, never cropped, on the right of the hero.
   Its background is carried out to the left by stretching the picture's
   own left edge sideways, and that wide strip fades into the navy on one
   long ramp, so the picture has no frame on the copy side. To swap: drop
   another photo at public/assets/marketing/hero-*.jpg, change this one
   import, rewrite `alt`, and set `ratio` to the new file's width / height.
   The left ~3% of the frame is what gets stretched, so it must be plain
   background (a wall, a windscreen, sky) with nothing of the subject in it.
   `track` places the player-tracking box: redraw it around the new player,
   or change its label, whenever the photo changes.
   =========================================================== */
import heroPhoto from "../../../public/assets/marketing/hero-fist-pump.jpg";

const HERO_PHOTO = {
  src: heroPhoto,
  alt: "Rudy Quan of UCLA shouts and pumps a fist after winning a point.",
  ratio: 4 / 5,
  // The player-tracking box drawn over the photo, as the app draws one on
  // match video: its edges as percentages of the photo (it takes in the
  // racket as well as the player), and its label.
  track: { left: 14, top: 6, width: 59.5, height: 89, label: "Rudy Quan", team: "UCLA", id: "01" },
};

// The extension only ever shows the photo's leftmost 3%, stretched, so a
// small optimized rendition is plenty; it is painted as a background.
const EXT_SRC = getImageProps({ src: HERO_PHOTO.src, alt: "", width: 640 }).props.src;

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

   The backdrop is the site's brand mesh with the live dot grid over it,
   as the hero has always had.
   Top: the copy, and beside it the photo, standing on the
   screen's top edge and shown whole. Its background is extended to the
   left behind the copy and fades into the mesh on one long ramp, so the
   player is never cut off and the picture has no edge on the copy side.
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
      <LiveDots glow={2.2} />
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
        <div className="hh-scene" style={{ "--hh-ratio": HERO_PHOTO.ratio } as CSSProperties}>
          <div className="hh-wide">
            <div className="hh-figure">
              <Image src={HERO_PHOTO.src} alt={HERO_PHOTO.alt} fill preload sizes="(max-width: 1023px) 80vw, 480px" placeholder="blur" />
            </div>
            {/* The same photo again, its left edge stretched sideways: the wall
                and the court, carried on to the left. */}
            <div className="hh-ext" aria-hidden="true" style={{ backgroundImage: `url(${EXT_SRC})` }} />
          </div>
          {/* The player-tracking box, as the app draws it on match video:
              outside the photo's fade mask so it stays crisp. Decorative —
              the photo's alt text already names the player. */}
          <div className="hh-track" aria-hidden="true">
            <div
              className="box"
              style={{
                left: `${HERO_PHOTO.track.left}%`,
                top: `${HERO_PHOTO.track.top}%`,
                width: `${HERO_PHOTO.track.width}%`,
                height: `${HERO_PHOTO.track.height}%`,
              }}
            >
              <i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" />
              {/* The read-out: a HUD panel seated above the box's top-left
                  corner, the way the app labels a tracked player. */}
              <span className="hud">
                <span className="l1">
                  <i className="rec" />
                  <span className="pid">P{Number(HERO_PHOTO.track.id)}</span>
                  <span>{HERO_PHOTO.track.label}</span>
                </span>
                <span className="l2">
                  <span>Team</span>
                  <span className="v">{HERO_PHOTO.track.team}</span>
                  <span aria-hidden="true">·</span>
                  <span>Tracking</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="wrap hh-screen-wrap">
        <HeroScreen />
      </div>
    </header>
  );
}
