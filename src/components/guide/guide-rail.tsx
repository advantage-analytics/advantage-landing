"use client";

import { useEffect, useState } from "react";

/* The guides' "On this page" rail: the sections as a plain list, with the one
   being read marked as you scroll. The way to a person is at the page's foot.
   Sticky beside the article on a wide screen; above it, unstuck, on a narrow
   one. */
export function GuideRail({ sections }: { sections: readonly { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    // A section counts as current once its top passes the upper third.
    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (shown[0]) setCurrent(shown[0].target.id);
      },
      { rootMargin: "0px 0px -66% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <aside className="guide-rail">
      <nav aria-label="On this page">
        <span className="guide-rail-label">On this page</span>
        <ol>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} aria-current={current === s.id ? "true" : undefined}>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
