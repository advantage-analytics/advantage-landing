import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/container";
import { Reveal } from "@/components/primitives/reveal";
import { Button } from "@/components/ui/button";
import { links } from "@/lib/links";

export function FinalCta() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-[#0B0B0F] px-6 py-20 sm:px-16 sm:py-28">
          {/* faint brand glow + oversized logo watermark */}
          <div
            aria-hidden
            className="brand-mesh-gradient pointer-events-none absolute -right-1/4 -top-1/3 h-[120%] w-[70%] opacity-25 blur-2xl"
          />
          <Image
            src="/logos/logo.svg"
            alt=""
            aria-hidden
            width={520}
            height={92}
            className="pointer-events-none absolute -bottom-8 -left-10 w-[460px] opacity-[0.04] brightness-0 invert"
          />

          <Reveal className="relative mx-auto max-w-[34ch] text-center">
            <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] text-white sm:text-5xl">
              Ready to find your edge?
            </h2>
            <p className="mx-auto mt-5 max-w-[44ch] text-pretty leading-relaxed text-white/65">
              Upload your first SwingVision match and see your dashboard in minutes. Free to
              start, no credit card required.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={links.signUp}>
                  Get started free
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <a href={links.signIn}>Sign in</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
