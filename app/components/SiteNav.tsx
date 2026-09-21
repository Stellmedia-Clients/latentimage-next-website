"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, studio } from "../content";

/**
 * Transparent over the home hero, solid everywhere else.
 *
 * The scroll threshold alone is not enough now the site has real routes: it
 * assumes a full-height dark hero under the bar, which only the home page has.
 * On /studio the same rule would paint ivory text on an ivory page. So the
 * transparent state is home-only, and every other route opens solid.
 */
export default function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = !isHome || scrolled;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid
          ? "bg-ivory/90 backdrop-blur-md border-b border-stone"
          : "bg-transparent border-b border-transparent"
          }`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="shell flex items-center justify-between py-4 md:py-5">
          <Link
            href="/"
            aria-label={`${studio.name} — home`}
            className="relative z-50 block shrink-0"
          >
            {/* Black artwork on transparency, so invert() turns it white over the
                hero video rather than shipping a second asset. Sized by intrinsic
                ratio (530×114) — a `fill` box would squash a 4.6:1 wordmark. */}
            <Image
              src="/logo-text.png"
              alt={studio.name}
              width={600}
              height={214}
              priority
              // Local PNG: the custom loader returns it verbatim and cannot
              // resize, so skip the pointless one-URL srcset.
              unoptimized
              className={`h-4 w-auto transition-[filter] duration-500 md:h-5 ${solid || open ? "" : "invert"
                }`}
            />
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {nav.slice(0, -1).map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`type-caption transition-colors ${solid
                    ? active
                      ? "text-charcoal"
                      : "text-sage hover:text-charcoal"
                    : active
                      ? "text-ivory"
                      : "text-ivory/70 hover:text-ivory"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/enquire"
            className={`type-caption hidden border px-5 py-2.5 transition-colors md:inline-block ${solid
              ? "border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory"
              : "border-ivory/40 text-ivory hover:bg-ivory hover:text-charcoal"
              }`}
          >
            Enquire
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`block h-px w-6 transition-all duration-300 ${open
                ? "translate-y-[3.5px] rotate-45 bg-charcoal"
                : solid
                  ? "bg-charcoal"
                  : "bg-ivory"
                }`}
            />
            <span
              className={`block h-px w-6 transition-all duration-300 ${open
                ? "-translate-y-[3.5px] -rotate-45 bg-charcoal"
                : solid
                  ? "bg-charcoal"
                  : "bg-ivory"
                }`}
            />
          </button>
        </div>
      </header>

      {/* Sibling of <header>, not a child of it. The bar carries
          backdrop-filter once it is solid, and a filtered element becomes the
          containing block for its fixed-position descendants — nested inside,
          this sheet resolved `inset-0` against the 68px-tall bar instead of the
          viewport and never covered the page. */}
      <div
        className={`fixed inset-0 z-40 overflow-y-auto bg-ivory transition-[opacity,visibility] duration-400 md:hidden ${open ? "visible opacity-100" : "invisible opacity-0"
          }`}
      >
        <div className="shell flex min-h-full flex-col justify-center py-28">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-stone py-5 transition-all duration-500"
              style={{
                transitionDelay: open ? `${80 + i * 55}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(14px)",
              }}
            >
              <span className="type-subheading block text-charcoal">
                {item.label}
              </span>
              <span className="type-body mt-1 block text-sage">{item.blurb}</span>
            </Link>
          ))}
          <a href={studio.phoneHref} className="type-body mt-10 text-bronze">
            {studio.phone}
          </a>
        </div>
      </div>
    </>
  );
}
