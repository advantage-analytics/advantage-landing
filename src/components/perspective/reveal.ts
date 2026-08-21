"use client";

import { useEffect } from "react";

/* Reveal-on-scroll — fades sections in as they enter the viewport.
   Honors prefers-reduced-motion via the CSS (.reveal stays visible).

   The CSS hides .reveal only under .perspective-page[data-reveal-armed], set
   here at hydration — server-rendered content stays visible while JS loads,
   so a hash landing (/#access) never sits on a blank section. Arming the
   page wrapper (not <html>) keeps the gate per-mount and fail-open: each
   navigation starts unarmed, and a page that renders .reveal without calling
   this hook shows its content rather than hiding it forever. Elements
   already painted in the viewport when we arm go straight to `.in` in the
   same frame (both changes paint together) — never hide what the user has
   already been shown. */
export function useReveal() {
  useEffect(() => {
    const root = document.querySelector(".perspective-page");
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    const vh = window.innerHeight;
    root.querySelectorAll(".reveal").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add("in");
      else io.observe(el);
    });
    root.setAttribute("data-reveal-armed", "");
    return () => io.disconnect();
  }, []);
}
