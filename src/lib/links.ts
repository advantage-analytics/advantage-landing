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
  // The dashboard's match uploader. Signed-out visitors land on sign-in and
  // come back here after.
  uploadMatch: `${APP_URL}/dashboard/matches/new`,
  // The dashboard Help page's step-by-step SwingVision export, which the
  // export guide points to rather than repeating.
  swingVisionHelp: `${APP_URL}/dashboard/help#swingvision`,
  // The Ask MCP connector's address, pasted into Claude, and the dashboard
  // page that lists connected apps.
  mcp: `${APP_URL}/api/mcp`,
  connections: `${APP_URL}/dashboard/settings/connections`,
} as const;
