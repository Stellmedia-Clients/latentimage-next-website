"use client";

/**
 * Edge-faded marquee for the sectors strip. The track holds two copies of the
 * list and translates by exactly -50%, so the loop is seamless. The fade at
 * both ends is a mask-image rather than a gradient overlay, so it works over
 * any section background.
 */
export default function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];

  return (
    <div
      className="group relative w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div className="marquee-track flex w-max items-center gap-x-14 md:gap-x-20">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            aria-hidden={i >= items.length}
            className="type-subheading shrink-0 whitespace-nowrap text-sage"
          >
            {item}
            <span aria-hidden className="ml-14 text-bronze md:ml-20">
              ·
            </span>
          </span>
        ))}
      </div>

      <style>{`
        .marquee-track {
          animation: marquee-scroll 42s linear infinite;
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
