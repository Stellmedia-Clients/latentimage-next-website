"use client";

import type { Brand } from "../copy";

/**
 * Client logo marquee. The track holds two copies of the list and translates
 * by exactly -50%, so the loop is seamless. The fade at both ends is a
 * mask-image rather than a gradient overlay, so it works over any background.
 *
 * Logos are flattened to a single colour with `brightness(0) invert(1)` —
 * every opaque pixel becomes white, alpha untouched. The supplied artwork is a
 * mix of light-background and dark-background variants (three of them are
 * white-on-transparent and would be invisible on ivory), and no single
 * background reads correctly for all of them in their own colours. Forcing one
 * colour on a charcoal band is what makes the set coherent.
 *
 * A brand with no `src` renders as a wordmark — either because its artwork has
 * a solid background baked in and cannot be monochromed, or because no file has
 * been supplied yet. See the notes on `brands` in copy.ts.
 */
export default function Marquee({ items }: { items: Brand[] }) {
  const loop = [...items, ...items];

  return (
    <div
      className="group relative w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div className="marquee-track flex w-max items-center gap-x-14 md:gap-x-20">
        {loop.map((brand, i) => (
          <span
            key={`${brand.label}-${i}`}
            aria-hidden={i >= items.length}
            className="flex shrink-0 items-center"
          >
            {brand.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.src}
                alt={i >= items.length ? "" : brand.label}
                width={brand.width}
                height={brand.height}
                loading="lazy"
                className="h-8 w-auto opacity-55 transition-opacity duration-500 hover:opacity-100 md:h-11"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            ) : (
              <span
                className="type-caption whitespace-nowrap text-ivory/55 transition-colors duration-500 hover:text-ivory"
                style={{ fontSize: "0.85rem" }}
              >
                {brand.label}
              </span>
            )}
          </span>
        ))}
      </div>

      <style>{`
        .marquee-track {
          animation: marquee-scroll 52s linear infinite;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
