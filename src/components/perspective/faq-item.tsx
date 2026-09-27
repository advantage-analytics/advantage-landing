"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/* One FAQ row: a native <details>, so it works (and is find-in-page
   searchable) before hydration and with reduced motion, where the click is
   left to the browser. Otherwise the click is taken over to animate the row's
   height both ways — the browser can only snap a <details> shut, and the
   CSS-only route (::details-content) is Chromium-only.

   Opening sets `open` first, then grows from the summary to the full row.
   Closing shrinks first and only drops `open` at the end, marking the row
   `.is-closing` meanwhile so the answer fades and the minus turns back into a
   plus right away. A click mid-animation reverses from the current height.
   Timings are the page's: 320ms on --ease-spring in, 220ms on --ease-primary
   out. */

const OPEN = { duration: 320, easing: "cubic-bezier(0.23, 1, 0.32, 1)" };
const CLOSE = { duration: 220, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" };

export function FaqItem({ q, children }: { q: string; children: ReactNode }) {
  const row = useRef<HTMLDetailsElement>(null);
  const running = useRef<Animation | null>(null);

  function onToggle(e: MouseEvent<HTMLElement>) {
    const el = row.current;
    if (!el || !el.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();

    const from = el.getBoundingClientRect().height;
    running.current?.cancel();
    el.style.overflow = "hidden";

    const closing = el.open && !el.classList.contains("is-closing");
    let to: number;
    if (closing) {
      el.classList.add("is-closing");
      const summary = el.querySelector("summary");
      const border = parseFloat(getComputedStyle(el).borderBottomWidth) || 0;
      to = (summary?.getBoundingClientRect().height ?? 0) + border;
    } else {
      el.classList.remove("is-closing");
      el.open = true;
      to = el.getBoundingClientRect().height;
    }

    const a = el.animate({ height: [`${from}px`, `${to}px`] }, closing ? CLOSE : OPEN);
    running.current = a;
    // A click mid-animation cancels this one (rejecting `finished`); the new
    // animation owns the row from there.
    a.finished.then(
      () => {
        running.current = null;
        el.style.overflow = "";
        if (closing) {
          el.open = false;
          el.classList.remove("is-closing");
        }
      },
      () => {}
    );
  }

  return (
    <details className="faq-row" ref={row}>
      <summary onClick={onToggle}>
        {q}
        <span className="faq-mark" aria-hidden="true" />
      </summary>
      <p>{children}</p>
    </details>
  );
}
