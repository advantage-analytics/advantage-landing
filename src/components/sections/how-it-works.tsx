import Image from "next/image";
import { Video, Upload, LineChart } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Reveal } from "@/components/primitives/reveal";
import { Eyebrow, SectionHeading, SectionLede } from "@/components/primitives/heading";
import { AppFrame } from "@/components/visuals/app-frame";

const steps = [
  {
    icon: Video,
    title: "Record in SwingVision",
    body: "Film your match with the SwingVision iOS app. It tracks every shot, point, and serve.",
  },
  {
    icon: Upload,
    title: "Export and upload",
    body: "Export the match stats from SwingVision and drop the file into Advantage. Setup takes a minute.",
  },
  {
    icon: LineChart,
    title: "Analyze your dashboard",
    body: "Get a full breakdown the moment it lands: stats, serve placement, momentum, and AI insights.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how" className="py-24 sm:py-28">
      <div className="max-w-[42ch]">
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <SectionHeading className="mt-4">
            From a SwingVision match to a full dashboard.
          </SectionHeading>
        </Reveal>
        <Reveal delay={0.12}>
          <SectionLede className="mt-5">
            No spreadsheets, no manual tagging. Advantage reads your SwingVision export and does
            the analysis for you.
          </SectionLede>
        </Reveal>
      </div>

      <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <Reveal>
          <ol className="space-y-7">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex size-10 items-center justify-center rounded-full border border-[var(--color-ink-border)] bg-white text-[var(--color-blue)] shadow-xs">
                    <s.icon className="size-4" />
                  </span>
                  {i < steps.length - 1 && (
                    <span aria-hidden className="mt-1 h-12 w-px bg-[var(--color-ink-200)]" />
                  )}
                </div>
                <div className="pt-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[var(--color-ink-400)]">
                      0{i + 1}
                    </span>
                    <h3 className="text-base font-semibold text-[var(--color-ink-900)]">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 max-w-[42ch] text-sm leading-relaxed text-[var(--color-ink-700)]">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1}>
          <AppFrame label="SwingVision · Export stats">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
              <Image
                src="/screens/swingvision-export.png"
                alt="The SwingVision match screen with the Export Data action used to send stats to Advantage"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover object-top"
              />
            </div>
          </AppFrame>
          <p className="mt-3 text-center font-mono text-[11px] text-[var(--color-ink-400)]">
            Your real SwingVision export — the only data Advantage needs.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
