"use client";

import type { ReactNode } from "react";
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

// The program lane. A coach signs up in the app and finds their team there;
// nearly every college program is already listed. A school-email match turns
// the pilot on at once, and anyone else is confirmed by hand.
export function FindTeamLink({
  className,
  placement,
  children = "Find Your Team",
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
      onClick={() => trackCta("find_your_team", placement)}
    >
      {children}
      {icon ? <ArrowUpRight size={icon} aria-hidden="true" /> : null}
    </a>
  );
}
