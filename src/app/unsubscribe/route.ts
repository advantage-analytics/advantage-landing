// Unsubscribe endpoint for the college outreach campaign.
//
// Writes to Resend's *suppression list*, not an audience. The distinction
// matters: a suppressed address is refused by Resend at send time, "even when
// included as recipients." So an opt-out holds even if the sender script has a
// bug, or someone re-imports an old CSV, or a coach's address is sitting in a
// CC list nobody remembered to filter. Client-side filtering is a convenience;
// this is the guarantee.
//
// Env: RESEND_API_KEY — already set for lib/notify.ts. Nothing else to add.

import { NextRequest, NextResponse } from "next/server";
import { CONTACT_EMAIL } from "@/lib/links";
import { escapeHtml } from "@/lib/notify";

// A coach clicking unsubscribe must not be served a cached render.
export const dynamic = "force-dynamic";

type Outcome = "ok" | "unconfigured" | "error";

async function suppress(email: string): Promise<Outcome> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[unsubscribe] RESEND_API_KEY not set; cannot record opt-out.");
    return "unconfigured";
  }

  try {
    const res = await fetch("https://api.resend.com/suppressions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    // Already suppressed is a success from the coach's point of view — they
    // asked not to be emailed and they will not be.
    if (res.ok || res.status === 409) return "ok";

    console.error(
      "[unsubscribe] Resend rejected the suppression:",
      res.status,
      await res.text().catch(() => ""),
    );
    return "error";
  } catch (err) {
    console.error("[unsubscribe] Failed to record opt-out:", err);
    return "error";
  }
}

/* Gmail and Outlook call this when a recipient uses the native Unsubscribe
   control beside the sender name. That control appears because the outreach
   email sets List-Unsubscribe-Post: List-Unsubscribe=One-Click — and
   advertising one-click without honouring the POST is something Gmail marks
   senders down for. Returns 200 fast, no click-through. */
export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("e");
  if (email) await suppress(email);
  return new NextResponse(null, { status: 200 });
}

/* The visible link in the email footer. */
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("e");

  if (!email) {
    return page(
      "Something went wrong",
      `That unsubscribe link is missing an address. Email ${CONTACT_EMAIL} and we'll remove you by hand.`,
      400,
    );
  }

  const outcome = await suppress(email);

  if (outcome !== "ok") {
    return page(
      "Something went wrong",
      `We couldn't process that automatically. Email ${CONTACT_EMAIL} and we'll remove ${escapeHtml(email)} by hand.`,
      500,
    );
  }

  return page(
    "You're unsubscribed",
    `${escapeHtml(email)} won't hear from us again. Sorry for the interruption.`,
  );
}

/* Deliberately a standalone document rather than a page inside the site shell.
   This is reached from an inbox by someone who has decided they are done with
   us; wrapping that message in the nav, the campaign frame and a sign-up CTA
   reads as not taking no for an answer. */
function page(heading: string, body: string, status = 200) {
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${heading} — Advantage</title>
  <style>
    :root { color-scheme: light dark; }
    * { box-sizing: border-box; }
    body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
           padding:24px; background:#FAFAFA; color:#0D0D0D;
           font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
           -webkit-font-smoothing:antialiased; }
    .card { width:100%; max-width:460px; padding:48px 44px; background:#FFF;
            border:1px solid #F3F3F3; border-radius:14px; }
    .logo { display:block; width:140px; height:auto; margin:0 0 32px; }
    .logo-dark { display:none; }
    h1 { margin:0 0 12px; font-size:24px; line-height:32px; font-weight:300; letter-spacing:-0.4px; }
    p  { margin:0; font-size:15px; line-height:26px; color:#4E4E55; }
    @media (max-width:520px) { .card { padding:36px 28px; } }
    @media (prefers-color-scheme: dark) {
      body { background:#0D0D0D; color:#F5F5F5; }
      .card { background:#141414; border-color:#262626; }
      p { color:#B4B4B8; }
      .logo-light { display:none; }
      .logo-dark { display:block; }
    }
  </style>
</head>
<body>
  <main class="card">
    <img class="logo logo-light" src="/email/advantage-wordmark.png" width="140" height="25" alt="ADVANTAGE">
    <img class="logo logo-dark" src="/email/advantage-wordmark-white.png" width="140" height="25" alt="ADVANTAGE">
    <h1>${heading}</h1>
    <p>${body}</p>
  </main>
</body>
</html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
