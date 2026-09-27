"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { links } from "@/lib/links";
import { trackCta } from "@/lib/analytics";

/* The two launch CTAs as links, with click tracking. A client leaf so the bands
   that hold them (beta terms, final band, the pilot masthead) can stay server
   components. Styling is the caller's: pass the button class. */

export function JoinBetaLink({
  className,
  placement,
  children = "Join Free Beta",
  icon = 16,
}: {
  className?: string;
  placement: string;
  children?: ReactNode;
  icon?: number | false;
}) {
  return (
    <a
      className={className}
      href={links.signUp}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCta("join_free_beta", placement)}
    >
      {children}
      {icon ? <ArrowUpRight size={icon} aria-hidden="true" /> : null}
    </a>
  );
}

export function ApplyPilotLink({
  className,
  placement,
  href = "/pilot#access",
  children = "Apply for Pilot",
  icon = false,
}: {
  className?: string;
  placement: string;
  href?: string;
  children?: ReactNode;
  icon?: number | false;
}) {
  return (
    <Link className={className} href={href} onClick={() => trackCta("apply_for_pilot", placement)}>
      {children}
      {icon ? <ArrowUpRight size={icon} aria-hidden="true" /> : null}
    </Link>
  );
}
