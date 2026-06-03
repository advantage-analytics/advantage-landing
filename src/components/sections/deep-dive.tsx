import { Section } from "@/components/primitives/section";
import { Reveal } from "@/components/primitives/reveal";
import { Eyebrow, SectionHeading, SectionLede } from "@/components/primitives/heading";
import { CourtHeatmap } from "@/components/visuals/court-heatmap";

const metrics = [
  { value: "78%", label: "Wide, deuce court", note: "Points won" },
  { value: "Kick", label: "2nd serve go-to", note: "Ad court, body" },
  { value: "T", label: "Under pressure", note: "Break points saved" },
];

export function DeepDive() {
  return (
    <Section
      id="showcase"
      bleed
      className="border-y border-[var(--color-ink-100)] bg-[var(--color-blue-tint-04)] py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>Serve placement</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <SectionHeading className="mt-4">
                See exactly where your serves land.
              </SectionHeading>
            </Reveal>
            <Reveal delay={0.12}>
              <SectionLede className="mt-5">
                Advantage maps every serve onto the court and shows where you win points and
                where you leak them. Filter by serve type, zone, and result to find the pattern
                worth drilling.
              </SectionLede>
            </Reveal>

            <Reveal delay={0.16} className="mt-9 grid grid-cols-3 gap-3">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-[var(--color-ink-border)] bg-white p-4">
                  <div className="font-mono text-2xl font-semibold tracking-tight text-[var(--color-ink-900)]">
                    {m.value}
                  </div>
                  <div className="mt-1.5 text-xs font-medium text-[var(--color-ink-700)]">
                    {m.label}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-[var(--color-blue)]">
                    {m.note}
                  </div>
                </div>
              ))}
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="surface-card-elevated mx-auto max-w-[420px] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink-400)]">
                  1st serve · won points
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-ink-400)]">
                  Low
                  <span className="h-1.5 w-16 rounded-full bg-gradient-to-r from-[var(--color-blue-tint-12)] to-[var(--color-blue)]" />
                  High
                </span>
              </div>
              <div className="mx-auto mt-5 h-[340px]">
                <CourtHeatmap />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
