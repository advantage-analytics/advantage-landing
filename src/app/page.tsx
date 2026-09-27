"use client";

import { useEffect } from "react";

import { PerspectiveHero } from "@/components/perspective/hero";
import { SiteNav } from "@/components/perspective/site-nav";
import { Footer } from "@/components/perspective/footer";
import { useReveal } from "@/components/perspective/reveal";
import { DashboardShowcase, HowItWorks } from "@/components/perspective/sections";
import { FilmRoom } from "@/components/perspective/film-room";
import { TeamBand } from "@/components/perspective/team-band";
import { BetaTerms } from "@/components/perspective/beta-terms";
import { Faq } from "@/components/perspective/faq";
import { FinalBand } from "@/components/perspective/final-band";

/* The hero and dashboard artboards are sized by useScaleToFit after mount, so
   a hash landing (/#film from the nav on another page, or a fresh load) is
   scrolled against pre-fit layout and can end up off target. Child effects run
   before this one, so by now the artboards hold their final heights — re-anchor
   once, instantly, to the corrected position. (That ordering breaks if an
   artboard ever moves behind next/dynamic or Suspense — its fit effect would
   run after this one, and the correction would have to move into the fit.) */
function useReanchorHash() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    // getElementById, not querySelector: fragments are ids, not selectors.
    // "instant" because html { scroll-behavior: smooth } would animate "auto".
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "instant" });
  }, []);
}

export default function Home() {
  // Re-anchor BEFORE arming the reveals: useReveal snapshots which sections
  // are in view, so it must run with the viewport already at the corrected
  // hash position or the landing section plays its entrance at the user.
  useReanchorHash();
  useReveal();
  return (
    <div className="perspective-page">
      <SiteNav />
      <PerspectiveHero />
      <main>
        <DashboardShowcase />
        <FilmRoom />
        <TeamBand />
        <HowItWorks />
        <BetaTerms />
        <Faq />
        <FinalBand />
      </main>
      <Footer />
    </div>
  );
}
