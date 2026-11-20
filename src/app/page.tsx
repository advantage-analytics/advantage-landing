import { PerspectiveHero } from "@/components/perspective/hero";
import { SiteNav } from "@/components/perspective/site-nav";
import { Footer } from "@/components/perspective/footer";
import { PageEffects } from "@/components/perspective/page-effects";
import { HowItWorks, WhatYouSee } from "@/components/perspective/sections";
import { ProductTour } from "@/components/perspective/product-tour";
import { TeamBand } from "@/components/perspective/team-band";
import { AiConnector } from "@/components/perspective/ai-connector";
import { VerifiedSection } from "@/components/perspective/verified";
import { SwitchingBand } from "@/components/perspective/switching-band";
import { Testimonial } from "@/components/perspective/testimonial";
import { ProductShowcase } from "@/components/perspective/product-showcase";
import { Faq } from "@/components/perspective/faq";
import { FinalBand } from "@/components/perspective/final-band";
import { JsonLd } from "@/components/json-ld";
import { softwareApplicationLd } from "@/lib/structured-data";

const APP_LD = softwareApplicationLd();

// Two arrangements of the same sections, kept side by side while the page's
// length is being decided. Delete the one that loses, and this switch.
const HOME_LAYOUT: "full" | "condensed" = "condensed";
// The section heads: the site's split head (headline left, premise right), or
// the AI connector's centred two-tone head on every band.
// "mixed" centres only the bands that make a statement above full-width
// content (the product band, and the AI connector, which is always centred)
// and leaves the bands that explain something on the split head.
const HEAD_STYLE = "mixed" as "split" | "centered" | "mixed";
// On the condensed page: the AI connector third, straight after How it works,
// with Verified between it and the product band; or fifth, after both.
const CONNECTOR_THIRD = false as boolean;
const AI_PROMPTS = ["summarize my last match", "find where I lose second-serve points", "scout our next opponent"];

export default function Home() {
  return (
    <div className={`perspective-page${HEAD_STYLE === "centered" ? " heads-centered" : ""}`}>
      <JsonLd data={APP_LD} />
      <SiteNav />
      <PerspectiveHero />
      <main>
        {HOME_LAYOUT === "condensed" ? (
          <>
            {/* The short page: what you do, the product once (match or
                team), what a reviewer adds, then the AI app you already use. */}
            <HowItWorks />
            {CONNECTOR_THIRD ? (
              <>
                <AiConnector prompts={AI_PROMPTS} />
                <VerifiedSection />
                <ProductShowcase centered={HEAD_STYLE === "mixed"} />
              </>
            ) : (
              <>
                <ProductShowcase centered={HEAD_STYLE === "mixed"} />
                <VerifiedSection />
                <AiConnector prompts={AI_PROMPTS} />
              </>
            )}
          </>
        ) : (
          <>
            {/* The long page: the AI connector straight after the hero, then
                each product band in full. */}
            <AiConnector />
            <HowItWorks />
            <WhatYouSee />
            <VerifiedSection />
            <ProductTour />
            <TeamBand />
          </>
        )}
        <SwitchingBand />
        <Testimonial />
        <Faq />
        <FinalBand />
      </main>
      <Footer />
      <PageEffects reanchorHash />
    </div>
  );
}
