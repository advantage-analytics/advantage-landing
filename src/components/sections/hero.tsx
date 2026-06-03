"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/primitives/container";
import { AppFrame } from "@/components/visuals/app-frame";
import { DashboardPreview } from "@/components/visuals/dashboard-preview";
import { links } from "@/lib/links";

const EASE = [0.22, 1, 0.36, 1] as const;

const chips = [
  { label: "Win rate", value: "71%", className: "left-0 top-20 sm:-left-8" },
  { label: "1st serve in", value: "68%", className: "right-0 top-36 sm:-right-8" },
  { label: "Break pts won", value: "54%", className: "bottom-8 left-6" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: reduce ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* ambient blue glow */}
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute left-1/2 top-0 -z-10 h-[620px] w-[1100px] -translate-x-1/2 opacity-[0.5] blur-3xl"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 40%, rgba(59,130,246,0.28) 0%, rgba(59,130,246,0) 70%)",
        }}
      />
      <Container className="flex flex-col items-center text-center">
        <motion.a
          href="#testimonial"
          {...fade(0)}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-ink-border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-ink-700)] shadow-xs transition-colors hover:border-[var(--color-blue-ring-30)]"
        >
          <span className="flex" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="size-3 fill-[var(--color-blue)] text-[var(--color-blue)]" />
            ))}
          </span>
          Trusted by UCLA Men&apos;s Tennis
        </motion.a>

        <motion.h1
          {...fade(0.08)}
          className="mt-6 max-w-[19ch] text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-[var(--color-ink-900)] sm:text-6xl"
        >
          Every serve, every rally, in one dashboard.
        </motion.h1>

        <motion.p
          {...fade(0.16)}
          className="mt-6 max-w-[56ch] text-pretty text-base leading-relaxed text-[var(--color-ink-700)] sm:text-lg"
        >
          Upload a SwingVision match and Advantage turns it into a complete performance
          dashboard: live stats, serve placement, momentum, and AI insights. Built for
          competitive players.
        </motion.p>

        <motion.div {...fade(0.24)} className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={links.signUp}>
              Get started free
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={links.howItWorks}>See how it works</a>
          </Button>
        </motion.div>
        <motion.p {...fade(0.3)} className="mt-3 text-xs text-[var(--color-ink-400)]">
          Free to start. No credit card required.
        </motion.p>

        {/* product shot */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.36 }}
          className="relative mt-16 w-full max-w-[940px]"
        >
          <AppFrame>
            <div className="aspect-[16/10] w-full overflow-hidden">
              <DashboardPreview />
            </div>
          </AppFrame>

          {/* floating data chips */}
          {chips.map((c) => (
            <motion.div
              key={c.label}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.8 }}
              className={`absolute hidden rounded-xl border border-[var(--color-ink-border)] bg-white/90 px-3.5 py-2.5 shadow-[0px_10px_30px_-10px_rgba(15,23,42,0.25)] backdrop-blur md:block ${c.className}`}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-400)]">
                {c.label}
              </div>
              <div className="mt-0.5 font-mono text-lg font-semibold text-[var(--color-ink-900)]">
                {c.value}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
