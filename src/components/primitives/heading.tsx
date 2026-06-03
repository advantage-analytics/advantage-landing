import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-blue)]",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-balance text-3xl font-medium tracking-[-0.02em] text-[var(--color-ink-900)] sm:text-4xl",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function SectionLede({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "max-w-[60ch] text-pretty text-base leading-relaxed text-[var(--color-ink-700)] sm:text-lg",
        className
      )}
    >
      {children}
    </p>
  );
}
