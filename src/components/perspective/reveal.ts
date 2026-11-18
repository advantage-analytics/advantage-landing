"use client";

import { useEffect } from "react";

/* Reveal-on-scroll — fades sections in as they enter the viewport.
   Honors prefers-reduced-motion via the CSS (.reveal stays visible).

   The CSS hides .reveal only under .perspective-page[data-reveal-armed], set
   here at hydration — server-rendered content stays visible while JS loads,
   so a hash landing (/#faq) never sits on a blank section. Arming the
   page wrapper (not <html>) keeps the gate per-mount and fail-open: each
   navigation starts unarmed, and a page that renders .reveal without calling
   this hook shows its content rather than hiding it forever. Elements
   already painted in the viewport when we arm go straight to `.in` in the
   same frame (both changes paint together) — never hide what the user has
   already been shown.

   A .reveal that mounts later (a band a switch brings in) is picked up by
   the same rule as it arrives, so no component needs to opt out. */
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
    const arm = (el: Element) => {
      if (el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
      else io.observe(el);
    };
    root.querySelectorAll(".reveal").forEach(arm);
    root.setAttribute("data-reveal-armed", "");

    // Cheap on unrelated churn (embeds, canvases): a class lookup per added
    // element, and nothing more unless it holds a .reveal.
    const mo = new MutationObserver((records) => {
      for (const rec of records) {
        for (const node of rec.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.classList.contains("reveal")) arm(node);
          const inner = node.getElementsByClassName("reveal");
          for (let i = 0; i < inner.length; i++) arm(inner[i]);
        }
      }
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
