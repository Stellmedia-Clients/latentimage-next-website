"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { hero } from "../copy";
import CtaLink from "./CtaLink";
import StatsBand from "./StatsBand";

/**
 * Full-bleed hero.
 *
 * Loading order is deliberate:
 *  1. The poster (23KB WebP) is the LCP element and is preloaded, so first
 *     paint never waits on video.
 *  2. The <video> is only mounted once the browser is idle, so the MP4 never
 *     competes with fonts/CSS on the critical path. Both cuts are the full
 *     60s master and are encoded `+faststart`, so playback begins on the
 *     first chunk rather than waiting for the whole file.
 *  3. Mobile gets the lighter 720p cut via a media-qualified <source>.
 *
 * The video is skipped entirely for reduced-motion and Data Saver users —
 * they keep the poster, which is a complete hero on its own.
 */
export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // `connection` is non-standard; treat its absence as "no constraint".
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (reduced || conn?.saveData) return;

    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const id = idle(() => setShowVideo(true));
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else clearTimeout(id as number);
    };
  }, []);

  // autoplay can still be refused (iOS Low Power Mode) — keep the poster if so.
  useEffect(() => {
    if (!showVideo) return;
    const v = videoRef.current;
    if (!v) return;
    v.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  }, [showVideo]);

  // `min-h`, not a fixed `h`: the stats row now sits inside the hero, and on a
  // 390px viewport the column (eyebrow + two headline lines + body + two
  // buttons + the stats row) is taller than 100svh. With a fixed height and
  // `justify-end` that overflow would have been clipped off the top, taking
  // the headline with it.
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden ">
      {/* Poster — the LCP element. */}
      <Image
        src="/media/hero-poster.webp"
        alt=""
        aria-hidden
        fill
        preload
        quality={75}
        sizes="100vw"
        className="object-cover"
      />

      {showVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          className={`absolute inset-0 h-full w-full object-cover  duration-1000 ${playing ? "opacity-100" : "opacity-0"
            }`}
        >
          <source src="/media/hero-720.mp4" type="video/mp4" media="(max-width: 768px)" />
          <source src="/media/hero-1080.mp4" type="video/mp4" />
        </video>
      )}

      {/* Legibility scrim. The montage opens on a hazy sunrise and cuts to other
          bright frames, so the video cannot be trusted to be dark anywhere.
          The left-to-right wash is the primary layer and spans the whole frame:
          it never reaches full transparency, because the headline now runs to
          the right gutter and would otherwise end over raw video. The vertical
          layer still carries the body copy and buttons at the bottom, and the
          flat tint is only a floor under both. */}
      <div aria-hidden className="absolute inset-0 bg-black/20" />
      <div
        aria-hidden
        className="absolute inset-0  bg-gradient-to-tr from-black/85 via-black/60 to-black/10"
      />
      {/* <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85"
      /> */}

      <div className="relative flex min-h-[100svh] flex-col justify-end">
        {/* Deliberately not `shell`: that caps at 82rem and would box the
            headline in the middle of a wide screen. Same gutters, no cap, so
            the type runs the full width of the viewport. */}
        <div className="w-full px-6 pb-4 md:px-10 md:pb-8">
          <div className="w-full">
            {/* Overridden on the element rather than in `type-caption`: the utility
                is right everywhere else. The string is 60 characters, so it wraps
                to two lines on a phone at any readable size — this just keeps
                those two lines from reading as a heavy block. */}
            <p className="type-caption mb-6 text-[0.66rem] tracking-[0.14em] text-ivory/70 md:mb-6 md:text-[0.8rem] md:tracking-[0.18em]">
              {hero.eyebrow}
            </p>
            {/* No `text-balance` — balancing picks the narrowest width that
                preserves the line count, which is the opposite of spanning. */}
            {/* The montage peaks near-white in the headline band (a snowfield
                around 0:08), where the scrim alone leaves the tail of line one
                at about 3:1. This shadow buys the rest locally, so the wash can
                stay light enough to keep the film visible behind it. */}
            <h1
              className="type-hero text-left text-ivory"
              style={{ textShadow: "0 2px 28px rgba(0,0,0,0.5)" }}
            >
              <span className="block">{hero.headline.lead}</span>
              {/* A true gold, set literally rather than derived from the
                  bronze token: bronze (#a58b68) is a desaturated mid-tone, and
                  every mix of it toward ivory gets paler without getting more
                  golden — the saturation is simply not in the source colour.
                  This sits 8.2:1 on charcoal and holds its hue over the
                  brightest frames of the montage (a white interior, a candle
                  close-up), which is where a darker gold turned muddy.

                  Deliberately not added to the @theme palette: the brand sheet
                  does not carry a gold, and this is one headline, not a token
                  the rest of the site should start reaching for. */}
              <span className="block" style={{ color: "#dfb863" }}>
                {hero.headline.accent}
              </span>
            </h1>
            <p
              className="type-body mt-7 max-w-4xl leading-[1.6] text-ivory/75 md:leading-[1.75]"
              style={{
                textShadow: "0 1px 16px rgba(0,0,0,0.55)",
                wordSpacing: "0.09em",
              }}
            >
              {hero.body}
            </p>

            {/* Below `sm` the two labels cannot share a row (182px + 258px
                against a 342px gutter), so they stacked at two different
                widths and read as a mistake. Matching them full-width makes
                the stack look chosen. Sizing stays with CtaLink — it is shared
                with four other pages, and 49px is already a correct target. */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <CtaLink
                href={hero.primary.href}
                tone="light"
                variant="solid"
                className="w-full sm:w-auto"
              >
                {hero.primary.label}
              </CtaLink>
              <CtaLink
                href={hero.secondary.href}
                tone="light"
                variant="outline"
                className="w-full sm:w-auto"
              >
                {hero.secondary.label}
              </CtaLink>
            </div>
          </div>
        </div>

        {/* The figures, over the film rather than in a band beneath it. */}
        <StatsBand />
      </div>
    </section>
  );
}
