import Image from "next/image";
import { Star } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { Reveal } from "@/components/primitives/reveal";

export function Testimonial() {
  return (
    <Section id="testimonial" className="py-24 sm:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--color-surface-muted)] sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/testimonial-ballota.jpg"
              alt="Gianluca Ballota celebrating on court in a UCLA jersey"
              fill
              sizes="(max-width: 1024px) 100vw, 460px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex" aria-label="Five out of five stars">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="size-4 fill-[var(--color-blue)] text-[var(--color-blue)]" />
            ))}
          </div>
          <blockquote className="mt-6 text-balance text-2xl font-medium leading-snug tracking-[-0.01em] text-[var(--color-ink-900)] sm:text-3xl">
            &ldquo;It was a valuable tool that helped us stay well-prepared and gave us an edge
            over other teams.&rdquo;
          </blockquote>
          <figcaption className="mt-7 flex items-center gap-3 text-sm">
            <span className="font-semibold text-[var(--color-ink-900)]">Gianluca Ballota</span>
            <span className="h-4 w-px bg-[var(--color-ink-200)]" />
            <span className="text-[var(--color-ink-500)]">UCLA Men&apos;s Tennis</span>
          </figcaption>
        </Reveal>
      </div>
    </Section>
  );
}
