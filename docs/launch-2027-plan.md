# January 2027 launch: plan

Branch `claude/launch-2027`, cut from `origin/main` at `c7b8831`. This is the Phase 0 write-up. No page has been changed yet.

## 1. What the brief assumed that the repo does not have

| Brief says | What is actually here | What I will do |
|---|---|---|
| Read `AGENTS.md` or `CLAUDE.md` | Neither exists. The conventions live in `DESIGN.md` and `PRODUCT.md`. | Follow those two plus `perspective.css`. |
| Lead type `free_beta` becomes `sales` / `contact` | There is no `free_beta`. Leads carry a `Source` from `LEAD_SOURCES` in `lib/leads.ts` (`Landing CTA`, `Pilot page`, `Missing school`, `Walkthrough`). The contact form is a separate route and a separate Airtable table (`Contact Messages`). | Add Source `Sales` for the college form. Contact stays on `/api/contact`. Old sources stay on the list so old rows still read. |
| PostHog events via `lib/analytics.ts` | PostHog is not installed. `trackEvent` sends to Vercel Web Analytics (and any GTM, gtag or Plausible tag on the page). | Send the five events through `trackEvent`. Adding PostHog itself is a separate decision (see 6). |
| Run typecheck | `package.json` has `lint` and `build` only. | Run `npx tsc --noEmit` and add a `typecheck` script. |
| Pricing files may be untracked | They are committed: `claude/pricing-page` at `b131417`, one commit on top of `c7b8831`, which is still `origin/main`. Worktree is clean. | `git checkout claude/pricing-page -- src/app/pricing`. |
| Keep the 50/80/100% line if the dashboard sends it | The dashboard emails at 80% and when the allowance is spent (`notifyUsageThreshold`, `api/splitstep/jobs/handler.ts:181`). There is no 50% alert. Checked on the local `advantage-dashboard` checkout, branch `splitstep-integration`. | Reword to "We email you at 80% of your hours and when they run out." |
| Yearly is about two months free | $1,639 is 11 x $149 and $3,289 is 11 x $299. Yearly is one month free. | Say "one month free" unless the prices change (see 6). |

## 2. Every pilot, beta, free-offer and delivery-time mention

Files not listed (recording guide, export guide, `court-diagram`, `footage-checklist`, `live-dots`, `band-parts`, `page-frame`, `sections`, `honeypot`, `match-video`, `layout`) only mention `/pilot` in code comments. Those comments get corrected, no copy changes.

### Delete

| File | Why |
|---|---|
| `src/lib/pilot.ts` | Retired. Replaced by `src/lib/plans.ts`. |
| `src/app/pilot/` (`page.tsx`, `pilot.css`, `opengraph-image.jpg`, `.alt.txt`) | Replaced by a permanent redirect to `/pricing`. `page.tsx:71` has "within 24 h", `:78` to `:101` the pilot FAQ. The `pv-*` masthead classes in `pilot.css` are used by the pricing draft, so they move to `subpage.css` first. |
| `components/perspective/beta-terms.tsx` | Home page band, all beta and pilot copy. `.beta-*` CSS in `perspective.css` goes with it. |
| `components/perspective/pilot-terms.tsx` | Only `/pilot` uses it. |
| `components/perspective/request-access.tsx` | The missing-school form at the foot of `/pilot`. Its job moves to the "Talk to us" form. `.access-*` CSS stays only if the new form reuses it. |

### Rewrite

| File:line | Now | Becomes |
|---|---|---|
| `app/page.tsx:12,54` | `<BetaTerms />` | Removed. New order: Hero, AI connector, How it works, What you see, Verified, Product tour, Team band, Switching band, (Testimonial, hidden), FAQ, Final band. |
| `hero.tsx:11,42` | Eyebrow "Free through Dec 31" | "Your first match is free." |
| `hero.tsx:121-135` | "Join Free Beta" / "Find Your Team", both to sign-up | "Upload a free match" (sign-up) / "Talk to us" (sales form). Events `hero_cta_clicked`. |
| `hero.tsx:53-55` | Headline and sub | New headline, see 6 for the alternative. |
| `cta-links.tsx:12-63` | `JoinBetaLink`, `FindTeamLink` | `FreeMatchLink` (sign-up) and `TalkToUsLink` (`/contact?plan=…`). |
| `final-band.tsx:19-27` | "Free through Dec 31", two lanes, "Players get 2 hours… Pilot programs get 75." | "Your first match is free.", the hero's two buttons, no allowance line. |
| `team-band.tsx:5,30,46` | "75 hours of film a month, shared." and "Find your team" | Aside without hours or "shared". Link becomes "See college plans" to `/pricing`. |
| `faq.tsx:22-48` | Beta, pilot, "after Dec 31", "Within 24 hours", "everyone in your team workspace" | Pricing, Verified, video requirements, AI connector, "You get an email when it's ready." Same answers as the pricing FAQ, from one shared list. |
| `site-nav.tsx:46` (+ comments `:32-68`) | `/pilot` "Pilot" | `/pricing` "Pricing", desktop and sheet. |
| `footer.tsx:35-41` | "Join free beta", "Find your team", "Pilot program" | "Upload a free match", "Pricing", "Talk to us". |
| `dashboard-home.tsx:343` | Mock line "1.4 of 2 hours left this month · free through Dec 31, 2026" | Needs the real paid-plan wording from the dashboard (see 5). |
| `team-home.tsx:372` | Mock line "31 of 75 hours left this month · 3 dual weekends left · free through Dec 31, 2026" | Same. |
| `tennis-analytics/page.tsx:12-17,75,84,95-100,201,228-238` | "within 24 hours" twice, "Is it free?", beta and pilot lanes | No times. "Is it free?" becomes "What does it cost?" from `plans.ts`. Add Verified. Lanes become free match and college plans. |
| `contact/contact-form.tsx:40-49,108,262` | "The pilot is free through the fall season", "Join Free Beta" twice | Becomes the "Talk to us" form (see 3). |
| `lib/emails/contact-received.ts:7-13,29,57,81-85,121-123` | "Free Fall Pilot… free through December 31, 2026", button to `/pilot` | Points at `/pricing`. Em dashes in the body removed. A second template for the sales confirmation. |
| `api/leads/route.ts:61-63` | Label "New pilot request", default source "Missing school" | Label by source, new sales fields. |
| `api/cal-booking/route.ts:7`, `walkthrough-band.tsx:11-65`, `lib/links.ts:13-16` | "pilot walkthrough", namespace `pilot-walkthrough`, placement `pilot-band` | Booking kept. Internal names become `walkthrough`. The Cal.com event slug itself is set on Cal.com (see 5). |
| `llms.txt/route.ts:3-9,18,21,33-34,42` | "within 24 hours", beta, pilot, link to `/pilot` | Paid plans with prices from `plans.ts`, link to `/pricing`. |
| `lib/structured-data.ts:51-53` | `offers: { price: "0" }` "Free through the beta" | An `AggregateOffer` built from `plans.ts` (low $0, high from the top plan), plus one `Offer` per self-serve plan. |
| `lib/site.ts:36` | `/pilot` in `INDEXED_PATHS` | `/pricing`. |
| `legal/terms-and-conditions/page.tsx:180-181` | "If you accept pilot terms in the Service, those terms also apply." | New "Paid plans" section, marked `// LEGAL REVIEW`. Line 43, "Turnaround times shown in the Service are estimates, not guarantees", is a legal disclaimer, not a promise. I plan to leave it; say if you want it gone. |
| `send-a-match/page.tsx:10-76` | Noindex notice reading `PILOT_TERMS`, button "Join the free pilot" to `/pilot` | Its own comment says it becomes a redirect once the pilot ends. Proposal: permanent redirect to `/pricing`, delete the page and its CSS. |
| `pilot/opengraph-image.alt.txt` | "Free through December 31, 2026" | Deleted with the route. |

Also touched for the hard copy rules, not found by the pilot grep: em dashes in any marketing string I edit; "Singles only for now" stays as is.

## 3. Lead flow

Today:

- **`/api/leads`** writes Airtable table `Leads` (`Name`, `Email`, `University`, `Role`, `Division`, `Source`, `Submitted At`) and emails the team inbox through Resend. No reply to the sender. The only live caller is the missing-school form on `/pilot`.
- **`/api/contact`** writes table `Contact Messages` (`Name`, `Email`, `Role`, `University`, `Phone`, `Message`, `Submitted At`), emails the team, and sends the sender `contact-received`.
- **`/api/cal-booking`** is the Cal.com webhook (HMAC-signed). It writes a `Leads` row with Source `Walkthrough`.
- All three flag, not drop, on the honeypot.

After:

- `/contact` becomes "Talk to us" with two modes on one page. **College** (default when `?plan=starter|program|elite` is present): name, email, school, team(s) (men's, women's, both), roster size, season (spring or full year), plan preselected, optional note. Posts to `/api/leads` with Source `Sales`. **Everyone else**: the current form, unchanged route.
- New `Leads` columns: `Plan`, `Teams`, `Roster Size`, `Season`, `Message`. Old rows are untouched and stay readable; old sources stay in `LEAD_SOURCES`.
- A `sales-received` confirmation email to the coach. Copy in 6.
- Cal.com booking stays on the page for coaches.
- `sales_form_submitted` carries plan and teams only, no personal fields.

## 4. SEO

- **Sitemap** (`app/sitemap.ts`) is `INDEXED_PATHS`. Swap `/pilot` for `/pricing`.
- **Robots** allows everything but `/api/` and `/unsubscribe`. No change.
- **Canonicals** come from `pageMetadata({ path })`. `/pricing` gets `path: "/pricing", ownCard: true`.
- **OG image**: `/pilot/opengraph-image.jpg` is deleted. `/pricing` needs a new 1200x630 card in the existing style. I will build it as HTML and screenshot it to JPG; the alt text goes in `opengraph-image.alt.txt`.
- **Redirects** in `next.config.ts`: `/pilot` and `/pilot/:path*` to `/pricing`, permanent. `/send-a-match` too if you agree.
- **Structured data**: see the `structured-data.ts` row above. The pricing FAQ gets `FAQPage` JSON-LD from the same list the page renders.

## 5. Phase 4 checklist: what the dashboard must have live before this merges

Status is from a read-only look at the local `advantage-dashboard` checkout (branch `splitstep-integration`), so treat "not found" as "confirm", not "missing".

| Needed | Found |
|---|---|
| Free limited to one match | Not found. |
| Stripe plans for Coach and Coach Pro | Stripe checkout exists (`api/create-checkout-session`). No `Coach` / `Coach Pro` plan names found. |
| Sign-up reads `?plan=` | Not found. The site will send `plan=coach|coach-pro|free` and `period=monthly|yearly`. |
| College quote and invoice flow | Not found. |
| Block video under 1080p | The Help page states "1080p or higher". An upload-time block was not confirmed. |
| Verified badge | "Verified by Advantage" exists and locks score and stats. I will copy the mark from the dashboard for the home section. |
| Speed step (Standard, Priority, Rush) with plan allowances | Not found. |
| Usage alerts | 80% and spent. No 50%. |
| Paid-plan wording of the usage line on Home and Team Home | Needed for the two mock boards. |
| Cal.com event | Slug is `advantage-analytics/pilot-walkthrough`. Rename on Cal.com and set `NEXT_PUBLIC_CAL_WALKTHROUGH`, or leave it. |
| Airtable | Add the five `Leads` columns in 3 before launch. `typecast` creates select options, not columns. |

## 6. Decisions and copy I need from you

1. **`PRODUCT.md` principle 7** says "Never name or compare against another product anywhere on the page." The SwingVision band and the Claude, ChatGPT, Cursor cards on the home page break it. OK to amend the principle to allow the two cases?
2. **Team workspace.** The rule says no shared coach and player workspaces. The site has a "Team workspace" band and "everyone in your team workspace can see it". My plan: keep the band as the coach's view of the roster, drop "shared" and the "everyone can see it" answer. Confirm.
3. **Yearly discount.** One month free at these prices. Keep the prices and say "one month free", or change the prices to match "two months free" ($1,490 / $2,990)?
4. **Hours or matches: which one is the limit?** Plans are sold in hours, matches are an estimate, yet the FAQ says a match over about 3 hours "counts as 1.5". That only makes sense if matches are the unit. Which is it?
5. **Free plan and the headline.** The pricing masthead says "Every singles match, human-checked." and the hero says "Checked point by point.", but the free match is AI only. I will scope both to paid plans in the sub line unless you prefer another headline.
6. **Hero alternative**, as asked: "Tennis stats you can trust. Every point checked by a person." It keeps players in, which `PRODUCT.md` puts first; the brief's version speaks only to colleges.
7. **Pricing draft claims to confirm or drop:** the "Most chosen" tag (unverified, and the two-lane rule says plans are not ranked), "SwingVision imports, always free", "AI analysis you can correct point by point" on Free.
8. **Full year:** which months, and does "prices locked for 12 months" start at purchase?
9. **Rush on Free:** is Rush ($25) sold to free accounts, or to paid plans only?
10. **PostHog:** install it on the site, or keep Vercel Analytics for these five events?
11. **`/send-a-match`:** redirect to `/pricing` and delete the page?
12. **Copy to supply:** the "Paid plans" terms (billing, renewal, cancellation, unused hours), or I draft and mark `// LEGAL REVIEW`; the sales confirmation email; condensed film in one sentence; the plan-switching answer; whether players need their own account; the Gemini tab (after you test); the testimonial (slot stays hidden).

## 7. Order of work

1. `lib/plans.ts`, `typecheck` script.
2. Phase 2: bring in `/pricing`, move the `pv-*` classes, finish plans, payment band, FAQ, OG card, sitemap.
3. Phase 1: nav and footer, redirects, delete `/pilot` and the three components, sales form and API, emails, terms, `llms.txt`, structured data, retire `lib/pilot.ts`.
4. Phase 3: hero, AI connector section (design board `Section.dc.html`, readable), Verified section, tour callout, prompt chips, switching band, testimonial slot, FAQ, final band, `/tennis-analytics`, `/mcp` Gemini flag, mock boards.
5. Tracking events, final grep for the "done" list, screenshots at desktop and phone widths, draft PR.

Pricing goes before removal so the redirect and the new nav link never point at a missing page in any commit.
