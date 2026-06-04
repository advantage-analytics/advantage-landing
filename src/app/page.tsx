"use client";

import { PerspectiveHero } from "@/components/perspective/hero";
import { SiteNav } from "@/components/perspective/site-nav";
import {
  DashboardShowcase,
  HowItWorks,
  Features,
  Credibility,
  RequestAccess,
  Footer,
  useReveal,
} from "@/components/perspective/sections";

export default function Home() {
  useReveal();
  return (
    <div className="perspective-page">
      <SiteNav />
      <PerspectiveHero />
      <main>
        <DashboardShowcase />
        <HowItWorks />
        <Features />
        <Credibility />
        <RequestAccess />
      </main>
      <Footer />
    </div>
  );
}
