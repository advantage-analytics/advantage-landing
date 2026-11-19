import type { ReactNode } from "react";
import Link from "next/link";
import { PageFrame, PageHero } from "@/components/perspective/page-frame";
import { CONTACT_EMAIL } from "@/lib/links";
import { GUIDES, GUIDES_HREF, guide, type GuideId } from "./guides";
import { GuideRail } from "./guide-rail";
import "./guide-shell.css";

/* One template for every guide: the site's navy masthead, compact and centred
   with a breadcrumb back to /guides; the "On this page" rail beside a
   reading column; and the other guides as a plain list at the foot. Each
   guide supplies only its sections. No eyebrow: the breadcrumb already names
   the guide. `hero` is anything the masthead must carry beyond its line (the
   AI connector's server URL). */
export function GuideShell({
  id,
  title,
  sub,
  hero,
  sections,
  children,
}: {
  id: GuideId;
  // Defaults to the guide's title in guides.ts, the one /guides lists.
  title?: ReactNode;
  sub: ReactNode;
  hero?: ReactNode;
  sections: readonly { id: string; label: string }[];
  children: ReactNode;
}) {
  const here = guide(id);
  return (
    <PageFrame
      hero={
        <PageHero
          compact
          crumb={
            <nav className="pv-crumb" aria-label="Breadcrumb">
              <Link href={GUIDES_HREF}>Guides</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{here.name}</span>
            </nav>
          }
          title={title ?? here.title}
          sub={sub}
          actions={hero}
        />
      }
    >
      <div className="wrap guide-body">
        <GuideRail sections={sections} />
        <article className="guide-main">{children}</article>
      </div>
      <GuideMore exclude={id} />
    </PageFrame>
  );
}

/* The other guides, a plain list, and the way to a person. */
function GuideMore({ exclude }: { exclude: GuideId }) {
  return (
    <section className="guide-more">
      <div className="wrap">
        <div className="guide-more-head">
          <span className="guide-rail-label">More guides</span>
          <Link href={GUIDES_HREF}>All guides</Link>
        </div>
        <ul>
          {GUIDES.filter((g) => g.id !== exclude).map((g) => (
            <li key={g.id}>
              <Link href={g.href}>
                <span className="k">{g.name}</span>
                <span className="v">{g.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="guide-more-foot">
          Didn&rsquo;t find it here? A person reads every message:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </section>
  );
}
