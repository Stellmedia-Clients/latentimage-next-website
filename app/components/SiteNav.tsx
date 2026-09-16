"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { nav, studio } from "../content";

/**
 * Transparent over the hero, ivory once scrolled past it. The logo swaps
 * between the light-on-dark and dark-on-light marks at the same breakpoint.
 */
export default function SiteNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "bg-ivory/90 backdrop-blur-md border-b border-stone"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="shell flex items-center justify-between py-4 md:py-5">
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="relative z-50 block h-7 w-11 shrink-0 md:h-8 md:w-[52px]"
        >
          {/* logo-mark.png is black artwork on transparency; invert() turns it
              white over the hero video rather than shipping a second asset.
              (public/logo-without-text.png is unusable here — it has an opaque
              black background, not alpha.) */}
          <Image
            src="/logo-mark.png"
            alt={studio.name}
            fill
            sizes="52px"
            quality={90}
            className={`object-contain transition-[filter] duration-500 ${
              solid || open ? "" : "invert"
            }`}
          />
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`type-caption transition-colors ${
                solid ? "text-sage hover:text-charcoal" : "text-ivory/70 hover:text-ivory"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={studio.phoneHref}
          className={`type-caption hidden border px-5 py-2.5 transition-colors md:inline-block ${
            solid
              ? "border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory"
              : "border-ivory/40 text-ivory hover:bg-ivory hover:text-charcoal"
          }`}
        >
          Enquire
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-px w-6 transition-all duration-300 ${
              open ? "translate-y-[3.5px] rotate-45 bg-charcoal" : solid ? "bg-charcoal" : "bg-ivory"
            }`}
          />
          <span
            className={`block h-px w-6 transition-all duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45 bg-charcoal" : solid ? "bg-charcoal" : "bg-ivory"
            }`}
          />
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-0 z-40 bg-ivory transition-[opacity,visibility] duration-400 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="shell flex h-full flex-col justify-center gap-2">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="type-heading border-b border-stone py-4 text-charcoal transition-all duration-500"
              style={{
                transitionDelay: open ? `${80 + i * 55}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(14px)",
              }}
            >
              {item.label}
            </a>
          ))}
          <a href={studio.phoneHref} className="type-body mt-8 text-sage">
            {studio.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
