"use client";

import { PerspectiveHero } from "@/components/perspective/hero";
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
