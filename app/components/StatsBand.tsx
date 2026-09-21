"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { stats } from "../copy";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The four-up figures under the hero, with the numerals counting up as the
 * band enters view.
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
 * the tween never runs at all. Once the tween is created it renders at zero
 * ahead of its trigger; the band sits a full viewport below the hero, so that
 * state is not on screen at load.
 */
export default function StatsBand() {
  const root = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { value: 0 };

        gsap.to(counter, {
          value: 1,
          duration: 2.1,
          ease: "power2.out",
          onUpdate: () => setProgress(counter.value),
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="border-b border-stone bg-ivory">
      <div className="shell py-16">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 md:gap-x-10">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                {/* Tabular figures are already set on type-stat, so the number
                    does not jitter horizontally while it counts. */}
                <span className="type-stat block text-charcoal">
                  {stat.kind === "count"
                    ? Math.round(stat.value * progress).toLocaleString("en-US") +
                    stat.suffix
                    : stat.value}
                </span>
                <span className="type-caption mt-3 block text-sage">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
