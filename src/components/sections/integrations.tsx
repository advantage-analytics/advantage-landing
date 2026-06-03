import Image from "next/image";
import { Container } from "@/components/primitives/container";

const partners = [
  "swingvision",
  "playsight",
  "baselinevision",
  "wingfield",
  "playreplay",
  "eyeson",
  "zenniz",
  "mojjo",
];

export function Integrations() {
  return (
    <section aria-label="Supported data sources" className="border-y border-[var(--color-ink-100)] bg-[var(--color-surface-muted)] py-12">
      <Container>
        <p className="text-center font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-ink-400)]">
          Works with the ELC tools you already use
        </p>
      </Container>
      <div
        className="group relative mt-8 flex overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="animate-marquee flex shrink-0 items-center gap-16 pr-16">
          {[...partners, ...partners].map((p, i) => (
            <Image
              key={`${p}-${i}`}
              src={`/partners/${p}.svg`}
              alt={p}
              width={120}
              height={28}
              className="h-7 w-auto opacity-50 grayscale transition-all duration-300 hover:opacity-90 hover:grayscale-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
