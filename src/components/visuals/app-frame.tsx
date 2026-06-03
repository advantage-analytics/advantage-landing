import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// A neutral browser/app window chrome used to present real product screenshots
// so they read as live UI rather than floating images.
export function AppFrame({
  children,
  label = "app.advantage.tennis",
  className,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--color-ink-border)] bg-white shadow-[0px_24px_60px_-20px_rgba(15,23,42,0.28)]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--color-ink-100)] bg-[var(--color-surface-muted)] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
        </span>
        <span className="mx-auto rounded-md bg-white px-3 py-1 font-mono text-[11px] text-[var(--color-ink-400)] ring-1 ring-[var(--color-ink-100)]">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
