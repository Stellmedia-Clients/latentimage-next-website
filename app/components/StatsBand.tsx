"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { stats, type Stat } from "../copy";

gsap.registerPlugin(useGSAP);

/**
 * The four-up figures inside the hero, with the numerals counting up on load.
 *
 * The count is driven through React state rather than by writing textContent
 * on a ref. The numerals are rendered from JSX, so React owns those text
 * nodes: an imperative write survives only until the next render, and in
 * development Strict Mode the post-hydration re-render wiped it immediately.
 *
 * One tween drives a single 0..1 progress value for all three numerals rather
 * than one tween each, so a frame costs one state update and one render, not
 * three of each.
 *
 * Progress starts settled at 1, which is what the server renders, so the band
 * is complete and correct with JavaScript off and under reduced motion, where
 * the tween never runs at all.
 *
 * The band sits inside the hero, on screen at load, so there is no scroll
 * position at which to start it and nowhere to hide the zero state: a
 * ScrollTrigger would have snapped the server-rendered figures back to 0 in
 * view. It runs on mount instead: progress is forced to 0 at hydration, then
 * tweened up after a short delay that lets the headline land first.
 *
 * Below `md` the four figures run as a marquee instead of stacking 2x2. The
 * two arrangements are separate subtrees rather than one node switching
 * `display`, because the marquee needs the list duplicated for a seamless loop
 * and the grid must not see those copies. Only one subtree is ever visible —
 * the other is `display: none`, so the duplicates are never announced twice.
 */

/**
 * One figure. The numeral and an invisible copy of its *settled* value share a
 * single grid cell, so the cell is already as wide as the final number before
 * the count starts.
 *
 * Without that reservation the width changes as the digits do ("0+" through
 * "1,000+"), and in the marquee that is not a local wobble: the track is
 * `w-max`, so every frame of the count re-resolves the track width and the
 * -50% loop translate along with it, sliding every figure sideways for the
 * 2.1s the count runs. `tabular-nums` does not rescue it either — these
 * numerals are set in Cormorant, which may carry no `tnum` table at all.
 */
function Figure({ stat, progress }: { stat: Stat; progress: number }) {
  const format = (n: number) => n.toLocaleString("en-US");
  const settled =
    stat.kind === "count" ? format(stat.value) + stat.suffix : stat.value;
  const live =
    stat.kind === "count"
      ? format(Math.round(stat.value * progress)) + stat.suffix
      : stat.value;

  return (
    <div className="shrink-0">
      <dt className="sr-only">{stat.label}</dt>
      <dd>
        <span className="grid">
          <span
            aria-hidden
            className="type-stat font-serif invisible [grid-area:1/1]"
          >
            {settled}
          </span>
          <span
            className="type-stat font-serif block text-ivory [grid-area:1/1]"
            style={{ textShadow: "0 1px 14px rgba(0,0,0,0.5)" }}
          >
            {live}
          </span>
        </span>
        <span className="type-caption font-serif mt-2 block ps-1 text-ivory/65">
          {stat.label}
        </span>
      </dd>
    </div>
  );
}

export default function StatsBand() {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { value: 0 };

        // Land the zero state at hydration rather than leaving it to the
        // tween's first render: the figures are in the opening viewport now,
        // so the server-rendered "1,000+" would otherwise sit there and then
        // snap back to "0+" when the delay elapsed. Only reached under
        // no-preference, so the reduced-motion path still renders settled.
        setProgress(0);

        gsap.fromTo(
          counter,
          { value: 0 },
          {
            value: 1,
            duration: 2.1,
            delay: 0.45,
            ease: "power2.out",
            onUpdate: () => setProgress(counter.value),
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative w-full  border-ivory/20 py-8">
      {/* Mobile: the figures run past rather than stacking 2x2. Full-bleed on
          purpose — the track carries no padding of its own, because anything
          inset on it reappears as a gap at the loop seam. */}
      <div className="stats-viewport no-scrollbar overflow-hidden md:hidden">
        <dl className="stats-track flex w-max items-start gap-x-10">
          {[...stats, ...stats].map((stat, i) => (
            <Figure key={`${stat.label}-${i}`} stat={stat} progress={progress} />
          ))}
        </dl>
      </div>

      {/* Desktop: the four-up grid, unchanged. */}
      <div className="hidden md:block md:px-10">
        <div className="shell w-full">
          <dl className="grid grid-cols-4 gap-x-10">
            {stats.map((stat) => (
              <Figure key={stat.label} stat={stat} progress={progress} />
            ))}
          </dl>
        </div>
      </div>

      <style>{`
        .stats-viewport {
          -webkit-mask-image: linear-gradient(to right, transparent, black 7%, black 93%, transparent);
          mask-image: linear-gradient(to right, transparent, black 7%, black 93%, transparent);
        }
        .stats-track {
          animation: stats-scroll 24s linear infinite;
        }
        @keyframes stats-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        /* With no animation the second half of the track is unreachable, so
           the row becomes swipeable instead — and the faded edges come off,
           since on a row that never moves they read as truncated content. */
        @media (prefers-reduced-motion: reduce) {
          .stats-track { animation: none; }
          .stats-viewport {
            overflow-x: auto;
            -webkit-mask-image: none;
            mask-image: none;
          }
        }
      `}</style>
    </div>
  );
}
