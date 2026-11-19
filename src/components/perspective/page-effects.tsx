"use client";

import { useEffect } from "react";
import { useReveal } from "./reveal";

/* The page-level effects, kept out of the pages themselves so the pages (and
   everything static in them) stay server components. Render it as the LAST
   child of .perspective-page: effects run in tree order, so by the time this
   one's run, every section above it has mounted and run its own.

   `reanchorHash` (the home page): the product-board artboards are sized by
   useScaleToFit after mount, so a hash landing (/#team from the nav on another
   page, or a fresh load) is scrolled against pre-fit layout and can end up off
   target. Those fits have run by now, so re-anchor once, instantly, to the
   corrected position. It runs BEFORE arming the reveals: useReveal snapshots
   which sections are in view, so the viewport must already be at the hash or
   the landing section plays its entrance at the reader. (That ordering breaks
   if an artboard ever moves behind next/dynamic or Suspense: its fit would run
   after this, and the correction would have to move into the fit.) */
export function PageEffects({ reanchorHash = false }: { reanchorHash?: boolean }) {
  useEffect(() => {
    if (!reanchorHash) return;
    const hash = window.location.hash;
    if (!hash) return;
    // getElementById, not querySelector: fragments are ids, not selectors.
    // "instant" because html { scroll-behavior: smooth } would animate "auto".
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "instant" });
  }, [reanchorHash]);
  useReveal();
  return null;
}
