// Outbound link to the Advantage dashboard app. The landing page is standalone;
// the sign-in action hands off to the product's real auth route.
const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.advantage-analytics.com"
).replace(/\/$/, "");

// The campaign's only reply channel, and the domain shown beside it. Both were
// retyped in half a dozen files; a stale address here is invisible until a
// coach's submission has already failed.
export const CONTACT_EMAIL = "team@advantage-analytics.com";
export const SITE_DOMAIN = "advantage-analytics.com";

export const links = {
  signIn: `${APP_URL}/login`,
  signUp: `${APP_URL}/sign-up`,
} as const;
