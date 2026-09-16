"use client";

import { useEffect, useRef } from "react";

/**
 * Background film-strip motif.
 *
 * Hand-authored as a tiling SVG <pattern> driven through a <mask>, rather than
 * converted from movietape4.eps: this way it tiles seamlessly at any height,
 * takes its colour from `currentColor`, and costs about a kilobyte instead of
 * 1.4MB. The mask is white where the tape is and black where the frame windows
 * and sprocket holes are punched through.
 *
 * Geometry note: the cell is 88x118 with a 100-tall window and sprockets on a
 * 29.5 pitch, so both repeat exactly on the cell boundary and the tile seam is
 * invisible.
 *
 * Motion is scroll-scrubbed, never idle-animated, so it stays in the
 * background instead of pulling focus.
 */
export default function FilmStrip({
  side = "right",
  className = "",
}: {
  side?: "left" | "right";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = side; // pattern ids must be unique per instance

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const dir = side === "right" ? 1 : -1;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        // -1 .. 1 as the element travels through the viewport
        const p = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        el.style.transform = `translate3d(0, ${(-p * 160 * dir).toFixed(1)}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [side]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-[-12%] hidden w-[64px] select-none text-stone sm:block lg:w-[84px] ${
        side === "right" ? "right-0 lg:right-3" : "left-0 lg:left-3"
      } ${className}`}
    >
      <div ref={ref} className="h-full w-full will-change-transform">
        <svg
          className="h-full w-full"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`film-cell-${uid}`}
              width="88"
              height="118"
              patternUnits="userSpaceOnUse"
            >
              <rect width="88" height="118" fill="white" />
              {/* frame window */}
              <rect x="16" y="9" width="56" height="100" rx="3" fill="black" />
              {/* sprocket holes, 29.5 pitch so the tile wraps cleanly */}
              {[4.75, 34.25, 63.75, 93.25].map((y) => (
                <g key={y}>
                  <rect x="4" y={y} width="7" height="10" rx="2" fill="black" />
                  <rect x="77" y={y} width="7" height="10" rx="2" fill="black" />
                </g>
              ))}
            </pattern>
            <mask id={`film-mask-${uid}`}>
              <rect width="100%" height="100%" fill={`url(#film-cell-${uid})`} />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="currentColor"
            mask={`url(#film-mask-${uid})`}
            opacity="0.28"
          />
        </svg>
      </div>
    </div>
  );
}
