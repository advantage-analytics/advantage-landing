"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { DashboardHome } from "./dashboard-home";
import { links } from "@/lib/links";
import { trackCta, trackEvent } from "@/lib/analytics";
import { BETA_END_SHORT } from "@/lib/pilot";

/* ===========================================================
   HERO PHOTO SLOT — PLACEHOLDER
   elc-court.jpg is the interim image until the real shoot lands
   (assets/PHOTO_SHOTLIST.md, shot 1). To swap: drop the final file at
   public/assets/marketing/hero-fence.jpg (or any hero-*.jpg) and change
   this one import. Then rewrite `alt` to describe the new picture and
   nudge the two focus points so the subject stays in frame.
   =========================================================== */
import heroPhoto from "../../../public/assets/marketing/elc-court.jpg";

const HERO_PHOTO = {
  src: heroPhoto,
  alt: "A camera set up high behind a grass tennis court, filming two players mid-rally.",
  // object-position for the crop: the wide desktop frame keeps the right
  // half (copy sits on the left); the tall phone frame keeps the camera.
  focusDesktop: "72% 38%",
  focusMobile: "70% 30%",
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
   Human hero — one responsive composition.

   A full-bleed photo carries the section; a navy scrim on the copy side
   keeps the white type and the transparent nav legible. The dashboard is
   no longer the hero: it is a small floating card over the photo, cropped
   to the season summary — the person, and their stats.

   • ≥1024px: copy left, card pinned bottom-right over the photo.
   • <1024px: copy first, then the card in flow, running off the hero's
     bottom edge to invite the scroll. Both sign-up buttons stay above the
     fold on a 375×667 phone.
   =========================================================== */

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
    <header
      className="hh"
      id="top"
      style={
        {
          "--hh-focus": HERO_PHOTO.focusDesktop,
          "--hh-focus-mobile": HERO_PHOTO.focusMobile,
        } as CSSProperties
      }
    >
      <Image
        className="hh-photo"
        src={HERO_PHOTO.src}
        alt={HERO_PHOTO.alt}
        fill
        preload
        sizes="100vw"
        placeholder="blur"
      />
      <div className="hh-scrim" aria-hidden="true" />
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
        {/* Decorative: the same dashboard Home the product bands describe,
            cropped to its season summary. */}
        <div className="hh-card" aria-hidden="true">
          <div className="hh-dash" inert>
            <DashboardHome />
          </div>
        </div>
      </div>
    </header>
  );
}
