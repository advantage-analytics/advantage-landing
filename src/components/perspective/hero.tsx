"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { DashboardHome } from "./dashboard-home";
import { links } from "@/lib/links";
import { trackCta, trackEvent } from "@/lib/analytics";
import { BETA_END_SHORT } from "@/lib/pilot";

/* ===========================================================
   HERO PHOTO SLOT
   A cut-out player on a transparent background (PNG), standing on the
   hero's own navy-and-blue backdrop. To swap: drop another cut-out at
   public/assets/marketing/hero-*.png, change this one import, and rewrite
   `alt` to describe the new picture. The figure is anchored to the hero's
   bottom edge, so a cut-out that ends mid-body (as this one does at the
   thigh) never shows its cut.
   =========================================================== */
import heroPhoto from "../../../public/assets/marketing/hero-player.png";

const HERO_PHOTO = {
  src: heroPhoto,
  alt: "A tennis player in a gold shirt and blue cap pumps a fist between points, racket in hand.",
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

   A cut-out player stands on a navy backdrop lit blue behind them; the
   copy sits on the dark side, so the white type and the transparent nav
   stay legible. The dashboard is no longer the hero: it is a small
   floating card across the player's lower half — the person, and their
   stats.

   • ≥1024px: copy left; player and card share a stage on the right.
   • <1024px: copy first, then the stage in flow, the player looking over
     the card as it runs off the hero's bottom edge. Both sign-up buttons
     stay above the fold on a 375×667 phone.
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
    <header className="hh" id="top">
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
        <div className="hh-stage">
          <Image
            className="hh-player"
            src={HERO_PHOTO.src}
            alt={HERO_PHOTO.alt}
            preload
            sizes="(max-width: 1023px) 240px, 420px"
          />
          {/* Decorative: the same dashboard Home the product bands describe,
              cropped to its season summary. */}
          <div className="hh-card" aria-hidden="true">
            <div className="hh-dash" inert>
              <DashboardHome />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
