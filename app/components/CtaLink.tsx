import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The one call-to-action primitive. Every section in the brief ends in one, so
 * the treatment is centralised here rather than repeated per section.
 *
 * `tone` exists because CTAs appear on both the ivory page and over the dark
 * hero video, where a charcoal border would disappear.
 */
export default function CtaLink({
  href,
  children,
  variant = "outline",
  tone = "dark",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  tone?: "dark" | "light";
  className?: string;
}) {
  const styles = {
    "dark-solid": "bg-charcoal text-ivory hover:bg-bronze",
    "dark-outline":
      "border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory",
    "light-solid": "bg-ivory text-charcoal hover:bg-bronze hover:text-ivory",
    "light-outline":
      "border border-ivory/40 text-ivory hover:bg-ivory hover:text-charcoal",
  }[`${tone}-${variant}` as const];

  return (
    <Link
      href={href}
      className={`type-caption inline-flex items-center justify-center px-8 py-4 text-center transition-colors duration-500 ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}
