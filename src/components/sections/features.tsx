import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Reveal } from "@/components/primitives/reveal";
import { Eyebrow, SectionHeading, SectionLede } from "@/components/primitives/heading";
import { TrendChart } from "@/components/visuals/trend-chart";
import { RadarChart } from "@/components/visuals/radar-chart";
import { cn } from "@/lib/utils";

const statBars = [
  { label: "1st serve in", value: 68 },
  { label: "1st serve won", value: 74 },
  { label: "2nd serve won", value: 52 },
  { label: "Break points saved", value: 61 },
  { label: "Return points won", value: 43 },
];

function StatPanel() {
  return (
    <div className="surface-card-elevated p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink-400)]">
          Match statistics
        </span>
        <span className="rounded-md bg-[var(--color-blue-tint-12)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--color-blue)]">
          30+ metrics
        </span>
      </div>
      <dl className="mt-6 space-y-4">
        {statBars.map((s) => (
          <div key={s.label}>
            <div className="flex items-baseline justify-between">
              <dt className="text-sm text-[var(--color-ink-700)]">{s.label}</dt>
              <dd className="font-mono text-sm font-semibold text-[var(--color-ink-900)]">
                {s.value}%
              </dd>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-ink-100)]">
              <div
                className="h-full rounded-full bg-[var(--color-blue)]"
                style={{ width: `${s.value}%` }}
              />
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

function FeatureRow({
  eyebrow,
  title,
  body,
  bullets,
  visual,
  flip = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  visual: ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn(flip && "lg:order-2")}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[var(--color-ink-900)] sm:text-3xl">
          {title}
        </h3>
        <p className="mt-4 max-w-[46ch] text-pretty leading-relaxed text-[var(--color-ink-700)]">
          {body}
        </p>
        <ul className="mt-6 space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm text-[var(--color-ink-900)]">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-blue-tint-12)] text-[var(--color-blue)]">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.1} className={cn(flip && "lg:order-1")}>
        {visual}
      </Reveal>
    </div>
  );
}

export function Features() {
  return (
    <Section id="features" className="py-24 sm:py-28">
      <div className="max-w-[42ch]">
        <Reveal>
          <Eyebrow>Features</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <SectionHeading className="mt-4">
            The analysis a pro gets, on every match you play.
          </SectionHeading>
        </Reveal>
        <Reveal delay={0.12}>
          <SectionLede className="mt-5">
            Three ways Advantage reads your game, drawn from the same SwingVision data, each
            answering a different question about how you win.
          </SectionLede>
        </Reveal>
      </div>

      <div className="mt-20 space-y-24 sm:space-y-28">
        <FeatureRow
          eyebrow="Statistics"
          title="Every metric that shapes your game."
          body="Thirty-plus stats across serve, return, and rally, tracked match by match. The numbers a coach would pull, without the spreadsheet."
          bullets={[
            "Serve, return, and rally-length breakdowns",
            "Trends and deltas against your last 30 days",
            "Win rate, break points, winners, and errors",
          ]}
          visual={<StatPanel />}
        />

        <FeatureRow
          flip
          eyebrow="Performance profile"
          title="See the shape of your game."
          body="An eight-axis profile of your serve and return, so strengths and gaps are obvious at a glance, and easy to track as you improve."
          bullets={[
            "First and second serve won %",
            "Return and break-point conversion",
            "Compare the profile across matches",
          ]}
          visual={
            <div className="surface-card-elevated p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink-400)]">
                  Performance profile
                </span>
                <span className="rounded-md bg-[var(--color-blue-tint-12)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--color-blue)]">
                  8 axes
                </span>
              </div>
              <div className="mx-auto mt-2 h-56 max-w-[280px]">
                <RadarChart />
              </div>
            </div>
          }
        />

        <FeatureRow
          eyebrow="AI insights"
          title="Patterns you can't spot from the baseline."
          body="Advantage reads the match and surfaces what moved and why, alongside a point-by-point momentum tracker that shows where it swung."
          bullets={[
            "AI commentary on every match",
            "Momentum tracking and key moments",
            "What to drill before the next one",
          ]}
          visual={
            <div className="relative">
              <div className="surface-card-elevated p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink-400)]">
                    Momentum · point differential
                  </span>
                  <span className="rounded-md bg-[var(--color-blue-tint-12)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--color-blue)]">
                    Break detected
                  </span>
                </div>
                <div className="mt-4 h-44">
                  <TrendChart />
                </div>
              </div>
              <div className="absolute -bottom-5 -left-4 hidden max-w-[240px] rounded-xl border border-[var(--color-ink-border)] bg-white p-3.5 shadow-[0px_12px_30px_-12px_rgba(15,23,42,0.3)] sm:block">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-blue)]">
                  AI insight
                </div>
                <p className="mt-1 text-xs leading-snug text-[var(--color-ink-900)]">
                  You won 78% of points when your first serve landed wide in the deuce court.
                </p>
              </div>
            </div>
          }
        />
      </div>
    </Section>
  );
}
