import { Check } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Reveal } from "@/components/primitives/reveal";
import { Eyebrow, SectionHeading, SectionLede } from "@/components/primitives/heading";
import { Button } from "@/components/ui/button";
import { links } from "@/lib/links";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    cadence: "forever",
    blurb: "Everything you need to break down your first match.",
    features: [
      "1 match analysis",
      "Up to 5 SwingVision uploads",
      "Full statistics dashboard",
      "Community support",
    ],
    cta: "Get started free",
    featured: false,
  },
  {
    name: "Founder",
    price: "$9.99",
    cadence: "one-time",
    blurb: "Unlimited analysis for the whole season ahead.",
    features: [
      "Unlimited match analyses",
      "Unlimited uploads",
      "Serve placement and court maps",
      "AI insights on every match",
      "Priority support",
    ],
    cta: "Get started free",
    featured: true,
  },
];

export function Pricing() {
  return (
    <Section id="pricing" className="py-24 sm:py-28">
      <div className="mx-auto max-w-[40ch] text-center">
        <Reveal>
          <Eyebrow>Pricing</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <SectionHeading className="mt-4">Choose your advantage.</SectionHeading>
        </Reveal>
        <Reveal delay={0.12}>
          <SectionLede className="mx-auto mt-5">
            Start free. Unlock unlimited matches and the full dashboard with a one-time Founder
            upgrade, no subscription.
          </SectionLede>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={cn(
              "relative flex flex-col rounded-2xl p-7",
              t.featured
                ? "border-2 border-[var(--color-blue)] bg-white shadow-[0px_24px_50px_-24px_rgba(59,130,246,0.4)]"
                : "border border-[var(--color-ink-border)] bg-white shadow-[var(--shadow-card)]"
            )}
          >
            {t.featured && (
              <span className="absolute -top-3 left-7 rounded-full bg-[var(--color-blue)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                Recommended
              </span>
            )}
            <h3 className="text-sm font-semibold text-[var(--color-ink-900)]">{t.name}</h3>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="font-mono text-4xl font-semibold tracking-tight text-[var(--color-ink-900)]">
                {t.price}
              </span>
              <span className="text-sm text-[var(--color-ink-400)]">{t.cadence}</span>
            </div>
            <p className="mt-3 text-sm text-[var(--color-ink-500)]">{t.blurb}</p>

            <ul className="mt-6 flex-1 space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-[var(--color-ink-900)]">
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                      t.featured
                        ? "bg-[var(--color-blue)] text-white"
                        : "bg-[var(--color-blue-tint-12)] text-[var(--color-blue)]"
                    )}
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="lg"
              variant={t.featured ? "default" : "outline"}
              className="mt-8 w-full"
            >
              <a href={links.signUp}>{t.cta}</a>
            </Button>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
