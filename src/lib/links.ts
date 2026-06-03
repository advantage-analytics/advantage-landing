// Outbound links to the Advantage dashboard app. The landing page is standalone;
// every conversion action hands off to the product's real auth routes.
const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"
).replace(/\/$/, "");

export const links = {
  signUp: `${APP_URL}/sign-up`,
  signIn: `${APP_URL}/login`,
  // Secondary CTAs scroll in-page.
  howItWorks: "#how",
  showcase: "#showcase",
  features: "#features",
  pricing: "#pricing",
} as const;
