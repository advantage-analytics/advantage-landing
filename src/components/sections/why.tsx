import { ArrowRight } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Reveal } from "@/components/primitives/reveal";
import { Eyebrow, SectionHeading, SectionLede } from "@/components/primitives/heading";

const before = [
  "One match in isolation, then forgotten",
  "Raw exports and scattered video clips",
  "Guessing at what actually went wrong",
];

const after = [
  "Every match in one performance dashboard",
  "Stats, court maps, and AI in one place",
  "Decisions from data, not hunches",
];

export function Why() {
  return (
    <Section className="py-24 sm:py-32">
      <div className="mx-auto max-w-[44ch] text-center">
        <Reveal>
          <Eyebrow>Why Advantage</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <SectionHeading className="mt-4">
            Your data is everywhere. Your edge is nowhere.
          </SectionHeading>
        </Reveal>
        <Reveal delay={0.12}>
          <SectionLede className="mx-auto mt-5">
            SwingVision captures every shot, then leaves it locked inside a single match.
            Advantage turns those exports into the season-long dashboard that actually changes
            how you play.
          </SectionLede>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mx-auto mt-14 grid max-w-3xl items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className="surface-card-ghost p-7">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink-400)]">
            Without Advantage
          </p>
          <ul className="mt-5 space-y-3">
            {before.map((b) => (
              <li key={b} className="flex gap-3 text-sm text-[var(--color-ink-500)]">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-ink-300)]" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center">
          <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-blue-tint-12)] text-[var(--color-blue)]">
            <ArrowRight className="size-4 max-sm:rotate-90" />
          </span>
        </div>

        <div className="rounded-[14px] border border-[var(--color-blue-ring-30)] bg-[var(--color-blue-tint-04)] p-7 shadow-[var(--shadow-card)]">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-blue)]">
            With Advantage
          </p>
          <ul className="mt-5 space-y-3">
            {after.map((a) => (
              <li key={a} className="flex gap-3 text-sm font-medium text-[var(--color-ink-900)]">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-blue)]" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
