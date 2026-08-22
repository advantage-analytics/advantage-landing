// Shared shell and building blocks for Advantage's transactional emails.
//
// The design is the product's invite email (01programinvitecoach.html), not the
// cold outreach one. That distinction is the whole point: outreach is a pitch
// and can afford a 32px headline and two competing CTAs, while these arrive
// because someone just did something and want confirming, quickly. So the
// headline is 24px, there is exactly one button, and the supporting detail sits
// in a single quiet panel rather than four ruled sections.
//
// Constraints that shape all of it:
//  - Tables, not divs. Outlook renders with Word and ignores modern layout.
//  - Inline styles on every element. The <style> block carries only the
//    progressive extras (hover, media queries) that are safe to lose, because
//    several clients strip it outright.
//  - Absolute image URLs on www. The apex 307s to www, and a redirect in front
//    of an image is one more reason for a client to give up on loading it.
//  - No unsubscribe link. These are transactional. Offering an opt-out here
//    would let someone suppress their own delivery receipts, and Resend's
//    suppression list is global — an opt-out taken from a confirmation email
//    would silently kill the follow-up that matters.

import { escapeHtml } from "../notify";

// Canonical origin for links and images. www, not the apex — see above.
const SITE = "https://www.advantage-analytics.com";

const FONT =
  "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export type EmailContent = { subject: string; html: string; text: string };

/* ---------------------------------------------------------------- shell -- */

export function emailShell({
  title,
  preheader,
  body,
}: {
  title: string;
  // The grey line a client shows next to the subject. Left unset it scrapes
  // whatever copy comes first, which here is the alt text of a logo.
  preheader: string;
  body: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body { margin:0; padding:0; width:100% !important; background:#FAFAFA;
      -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;
      -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
    table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { border:0; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
    a { text-decoration:none; }
    .btn:hover { background:#2563EB !important; }
    @media only screen and (max-width:600px) {
      .container { width:100% !important; }
      .px { padding-left:28px !important; padding-right:28px !important; }
      .h1 { font-size:22px !important; line-height:30px !important; }
    }
    @media (prefers-color-scheme: dark) {
      .bg { background:#0A0A0B !important; }
      .card { background:#0E0E10 !important; border-color:#2E2E2E !important; box-shadow:none !important; }
      .ink { color:#F5F5F5 !important; }
      .ink2 { color:#B5B5B5 !important; }
      .ink3 { color:#9A9A9A !important; }
      .ink4 { color:#828282 !important; }
      .rule { border-color:#1F1F1F !important; }
      .tone { background:#1A1A1C !important; }
      .accent { color:#60A5FA !important; }
      /* The filled CTA keeps #3B82F6 — white text on the lifted dark blue
         would drop below 3:1. Only unfilled blue lifts. */
      .logo-light { display:none !important; }
      .logo-dark { display:inline-block !important; width:140px !important; max-height:none !important; }
    }
</style>

  <!-- Inter sits in its own <style> block, deliberately after the layout rules.
       Gmail strips @font-face and can discard the whole block it lives in, so the
       expendable thing goes last: losing this costs the font and leaves the
       responsive rules above untouched. Hidden from Outlook, which ignores
       @font-face and drops to Times New Roman when it sees one. Order relative to
       usage doesn't matter — @font-face registers at parse time.
       One file covers all three weights; Inter v20 is a variable font. -->
  <!--[if !mso]><!-->
  <style>
    @font-face { font-family:'Inter'; font-style:normal; font-weight:300; font-display:swap;
      src:url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2) format('woff2'); }
    @font-face { font-family:'Inter'; font-style:normal; font-weight:400; font-display:swap;
      src:url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2) format('woff2'); }
    @font-face { font-family:'Inter'; font-style:normal; font-weight:500; font-display:swap;
      src:url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2) format('woff2'); }
  </style>
  <!--<![endif]-->
</head>
<body class="bg" style="margin:0; padding:0; background:#FAFAFA;">
  <span style="display:none !important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all;">${escapeHtml(preheader)}</span>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="bg" style="background:#FAFAFA;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px; max-width:600px;">

          <tr>
            <td class="card" style="background:#FFFFFF; border:1px solid #F3F3F3; border-radius:14px; box-shadow:0px 2px 8px 0px rgba(0,0,0,0.06);">

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td class="px" style="padding:44px 44px 0 44px;">
                    <!-- PNG, not SVG: Gmail, Outlook and Yahoo all strip SVG.
                         Files are 280x50 (2x) served at 140x25. -->
                    <img class="logo-light" src="${SITE}/email/advantage-wordmark.png" width="140" height="25" alt="Advantage" style="display:block; width:140px; height:auto; border:0; outline:none;">
                    <img class="logo-dark" src="${SITE}/email/advantage-wordmark-white.png" width="140" height="25" alt="Advantage" style="display:none; width:0; max-height:0; overflow:hidden; border:0; outline:none;">
                  </td>
                </tr>
${body}
              </table>

            </td>
          </tr>

          <tr>
            <td align="center" style="padding:24px 40px 8px 40px;">
              <p class="ink4" style="margin:0; font-family:${FONT}; font-size:11px; line-height:17px; color:#AAAAAA;">&copy; 2026 Advantage Analytics LLC &middot; advantage-analytics.com</p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ----------------------------------------------------------- components -- */

// Small-caps label and the headline, as one cell. They travel together: the
// label is a category for the headline, not a section marker, so nothing else
// in the email uses this treatment.
export function heading(label: string, title: string): string {
  return `                <tr>
                  <td class="px" style="padding:36px 44px 0 44px;">
                    <p class="ink4" style="margin:0 0 12px 0; font-family:${FONT}; font-size:10px; font-weight:500; letter-spacing:2.5px; color:#AAAAAA;">${escapeHtml(label)}</p>
                    <h1 class="h1 ink" style="margin:0; font-family:${FONT}; font-size:24px; line-height:32px; font-weight:300; letter-spacing:-0.5px; color:#0D0D0D;">${title}</h1>
                  </td>
                </tr>`;
}

// Body copy. One paragraph per row rather than margin-stacked inside a single
// cell — Outlook's handling of <p> margins is unreliable, and the row padding
// is the thing actually creating the rhythm.
export function para(html: string): string {
  return `                <tr>
                  <td class="px" style="padding:20px 44px 0 44px;">
                    <p class="ink2" style="margin:0; font-family:${FONT}; font-size:15px; line-height:26px; color:#525252;">${html}</p>
                  </td>
                </tr>`;
}

export function paras(list: string[]): string {
  return list.map(para).join("\n");
}

export type PanelRow = {
  l: string;
  v: string;
  // Prose rather than a field value — quoted-back message text, mostly. Renders
  // at body weight with room to breathe instead of the 500-weight single line a
  // label/value pair gets.
  multiline?: boolean;
};

// The one panel. Label above value, stacked, because a two-column receipt
// forces long values (a program name, a filename) to wrap to one word per line
// on a phone and there is no media query that fixes that in Outlook.
export function panel(rows: PanelRow[]): string {
  const body = rows
    .map(
      (r, i) => `                        <tr>
                          <td class="ink3" style="padding:${i === 0 ? 0 : 10}px 0 0 0; font-family:${FONT}; font-size:12px; line-height:18px; color:#71717A;">${escapeHtml(r.l)}</td>
                        </tr>
                        <tr>
                          <td class="ink" style="padding:2px 0 0 0; font-family:${FONT}; font-size:14px; line-height:${r.multiline ? 22 : 20}px; font-weight:${r.multiline ? 400 : 500}; color:#0D0D0D;">${r.v}</td>
                        </tr>`,
    )
    .join("\n");

  return `                <tr>
                  <td class="px" style="padding:24px 44px 0 44px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="tone" style="background:#FAFAFA; border-radius:10px;">
                      <tr>
                        <td style="padding:18px 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
${body}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`;
}

// One CTA, with a VML twin for Outlook, which ignores the padded-anchor trick.
// VML needs a pixel width up front; there is no measuring a font in an email,
// so it is estimated from the label and the arithmetic is left visible rather
// than hidden behind a magic number.
export function button(label: string, href: string): string {
  const width = label.length * 8 + 55;
  return `                <tr>
                  <td class="px" style="padding:28px 44px 0 44px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:45px;v-text-anchor:middle;width:${width}px;" arcsize="13%" strokecolor="#3B82F6" fillcolor="#3B82F6">
                    <w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:500;">${escapeHtml(label)}</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-- -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td class="btn" bgcolor="#3B82F6" align="center" style="border-radius:6px; box-shadow:0 1px 3px rgba(57,134,243,0.25);">
                          <a href="${href}" target="_blank" style="display:block; padding:14px 30px; font-family:${FONT}; font-size:14px; font-weight:500; letter-spacing:0.5px; color:#FFFFFF; border-radius:6px; white-space:nowrap;">${escapeHtml(label)}</a>
                        </td>
                      </tr>
                    </table>
                    <!--<![endif]-->
                  </td>
                </tr>`;
}

// The button's plain-text twin, for clients that strip the button, corporate
// filters that rewrite it, and anyone forwarding the mail as text.
export function fallbackLink(href: string): string {
  return `                <tr>
                  <td class="px" style="padding:26px 44px 0 44px;">
                    <p class="ink3" style="margin:0 0 6px 0; font-family:${FONT}; font-size:12px; line-height:20px; color:#71717A;">If the button doesn't work, paste this link into your browser:</p>
                    <p style="margin:0; font-family:${FONT}; font-size:12px; line-height:20px; word-break:break-all;"><a class="accent" href="${href}" style="color:#3B82F6;">${escapeHtml(href)}</a></p>
                  </td>
                </tr>`;
}

// Fine print: why this email arrived, what the caveats are.
export function note(html: string): string {
  return `                <tr>
                  <td class="px" style="padding:20px 44px 0 44px;">
                    <p class="ink3" style="margin:0; font-family:${FONT}; font-size:12px; line-height:20px; color:#71717A;">${html}</p>
                  </td>
                </tr>`;
}

// Closes every email. Deliberately a support line rather than a signature —
// these are sent by the system, and a handwritten sign-off on an automated
// receipt invites a reply to a name that didn't write it.
export function helpBlock(): string {
  return `                <tr>
                  <td class="px" style="padding:36px 44px 44px 44px;">
                    <div class="rule" style="border-top:1px solid #F3F3F3; padding-top:24px;">
                      <p class="ink3" style="margin:0; font-family:${FONT}; font-size:12px; line-height:20px; color:#71717A;">Need help? Reach us at <a class="accent" href="mailto:team@advantage-analytics.com" style="color:#3B82F6;">team@advantage-analytics.com</a>.</p>
                    </div>
                  </td>
                </tr>`;
}

/* ---------------------------------------------------------------- utils -- */

export const SITE_URL = SITE;

export function strong(text: string): string {
  return `<strong class="ink" style="color:#0D0D0D; font-weight:600;">${text}</strong>`;
}

// Re-exported so a template has one import for everything it needs.
export { escapeHtml };
