// Outbound link to the Advantage dashboard app. The landing page is standalone;
// the sign-in action hands off to the product's real auth route.
const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"
).replace(/\/$/, "");

export const links = {
  signIn: `${APP_URL}/login`,
} as const;
