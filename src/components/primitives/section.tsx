import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

export function Section({
  children,
  className,
  containerClassName,
  id,
  bleed = false,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  // bleed: skip the inner Container (for full-width bands)
  bleed?: boolean;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20", className)}>
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
