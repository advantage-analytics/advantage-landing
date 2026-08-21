"use client";

import { useEffect } from "react";

import { PerspectiveHero } from "@/components/perspective/hero";
import { PilotTermsBand } from "@/components/perspective/pilot-terms";
import { SiteNav } from "@/components/perspective/site-nav";
import { Footer } from "@/components/perspective/footer";
import { useReveal } from "@/components/perspective/reveal";
import { RequestAccess } from "@/components/perspective/request-access";
import {
  DashboardShowcase,
  HowItWorks,
  Features,
  BuiltForAthletes,
} from "@/components/perspective/sections";

/* The hero and dashboard artboards are sized by useScaleToFit after mount, so
   a hash landing (/#access from the nav on another page, or a fresh load) is
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
        <HowItWorks />
        <Features />
        <BuiltForAthletes />
        <PilotTermsBand
          id="pilot"
          alt
          eyebrow="Fall 2026 · Collegiate programs"
          title="The Free Fall Season Pilot."
          body="Every program that wants in, gets in — onboarding runs through September for the fall season. Four terms, no fine print."
          cta={{ href: "/pilot", label: "Full pilot details" }}
        />
        <RequestAccess />
      </main>
      <Footer />
    </div>
  );
}
