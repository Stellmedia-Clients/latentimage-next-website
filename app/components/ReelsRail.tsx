"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reels } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Horizontal reel gallery.
 *
 * Card sizing resolves a three-way squeeze. Under a ~290px header inside a
 * 100svh section, a card cannot at the same time (a) fit vertically, (b) stay
 * 9:16, and (c) leave five of them wide enough to overflow a 1440px viewport —
 * below roughly 760px of viewport height, something has to give. The old
 * `h-[62vh]` bought (b) and (c) by breaking (a): it measured against the whole
 * viewport rather than `100svh - header`, so the card outgrew its container
 * and the section's `overflow-hidden` sliced the captions off the bottom.
 *
 * So: height stretches to whatever the flex column actually leaves (a holds,
 * nothing is ever clipped), `aspect-[9/16]` derives the width from it, and
 * `md:min-w-[16rem]` floors that width so the track still overflows and the
 * pinned scrub below still has somewhere to travel (c holds). Aspect is the
 * one that yields: on short viewports the cards land nearer 0.7 than 0.5625
 * and the poster/video `object-cover` crops a little. On tall viewports the
 * derived width is already past the floor, so none of this binds.
 *
 * Desktop (>=768px, motion allowed): the section pins and the track is
 * scrubbed right-to-left by vertical scroll — the GreenSock horizontal-gallery
 * pattern. Distance is measured from the track's real scrollWidth and
 * recalculated on refresh, so variable card widths and font loading don't
 * desync the end point.
 *
 * Mobile / reduced-motion: no pinning. Pinned horizontal scroll is genuinely
 * unpleasant on touch, so it falls back to a native snap-scrolling rail, which
 * is still "controlled by scroll" and costs nothing.
 *
 * Playback: hover on pointer devices, tap to toggle on touch.
 */
export default function ReelsRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const el = track.current;
          if (!el) return;

          // How far the track must travel for its last card to reach the right
          // edge. Card width is derived from card height, so scrollWidth moves
          // with viewport *height* as well as width — `invalidateOnRefresh`
          // below is what keeps this honest across resizes.
          const distance = () => Math.max(0, el.scrollWidth - window.innerWidth + 96);

          gsap.to(el, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: section },
  );

  const play = (i: number) => {
    const v = videos.current[i];
    if (!v) return;
    v.play().then(
      () => setActive(i),
      () => { },
    );
  };

  const stop = (i: number) => {
    const v = videos.current[i];
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setActive((cur) => (cur === i ? null : cur));
  };

  // Resolved after mount: reading matchMedia during render makes the server
  // and client disagree and trips a hydration error. `null` means "not yet
  // known", so nothing hover-dependent is rendered until it is.
  const [canHover, setCanHover] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section
      id="films"
      ref={section}
      className="relative overflow-hidden bg-greige md:flex md:h-[100svh] md:flex-col"
    >
      {/* Header is a flex row rather than an absolute overlay, so it can never
          collide with the track whatever the card height works out to be. */}
      <div className="shell pt-24 md:shrink-0 md:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-stone pb-6">
          <div>
            <p className="type-caption mb-4 text-bronze">Cinematic Films</p>
            <h2 className="type-heading max-w-xl text-balance">
              Motion, where a still frame isn&apos;t enough.
            </h2>
          </div>
          <p className="type-caption text-sage">
            {canHover === null ? "\u00a0" : canHover ? "Hover to play" : "Tap to play"}
          </p>
        </div>
      </div>

      <div className="md:flex md:min-h-0 md:flex-1 md:items-stretch">
        <div
          ref={track}
          className="no-scrollbar flex gap-4 overflow-x-auto px-6 py-10 md:gap-6 md:overflow-visible md:px-12 md:py-8"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {reels.map((reel, i) => (
            <article
              key={`${reel.src}-${i}`}
              className="group relative aspect-[9/16] w-[min(72vw,17rem)] shrink-0 overflow-hidden rounded-xl bg-charcoal md:w-auto md:min-w-[16rem]"
              style={{ scrollSnapAlign: "center" }}
              onMouseEnter={canHover === true ? () => play(i) : undefined}
              onMouseLeave={canHover === true ? () => stop(i) : undefined}
              onClick={
                canHover === false
                  ? () => (active === i ? stop(i) : play(i))
                  : undefined
              }
            >
              {/* The poster is a lazy next/image rather than the <video poster>
                  attribute: browsers fetch `poster` eagerly no matter where the
                  element sits, so five off-screen posters were being downloaded
                  on first load. preload="none" defers only the video data. */}
              <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                <video
                  ref={(node) => {
                    videos.current[i] = node;
                  }}
                  src={reel.src}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label={`${reel.title} — ${reel.place}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <Image
                  src={reel.poster}
                  alt=""
                  aria-hidden
                  fill
                  loading="lazy"
                  quality={75}
                  sizes="(max-width: 768px) 72vw, 340px"
                  className={`object-cover transition-opacity duration-700 ${active === i ? "opacity-0" : "opacity-100"
                    }`}
                />
              </div>

              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent"
              />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="type-subheading text-ivory">{reel.title}</h3>
                <p className="type-caption mt-1.5 text-ivory/60">{reel.place}</p>
              </div>

              {/* Play affordance — only where hover can't do the job. */}
              {canHover === false && active !== i && (
                <span
                  aria-hidden
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-ivory/40 bg-charcoal/30 backdrop-blur-sm"
                >
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                    <path d="M0 0L10 6L0 12V0Z" fill="currentColor" className="text-ivory" />
                  </svg>
                </span>
              )}
            </article>
          ))}

          {/* Tail spacer so the last card can clear the right edge when pinned. */}
          <div aria-hidden className="hidden w-24 shrink-0 md:block" />
        </div>
      </div>
    </section>
  );
}
