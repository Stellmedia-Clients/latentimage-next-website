"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { studio } from "../content";

/**
 * Full-bleed hero.
 *
 * Loading order is deliberate:
 *  1. The poster (23KB WebP) is the LCP element and is preloaded, so first
 *     paint never waits on video.
 *  2. The <video> is only mounted once the browser is idle, so 6MB of MP4
 *     never competes with fonts/CSS on the critical path.
 *  3. Mobile gets the 2.5MB 720p cut via a media-qualified <source>.
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

  return (
    <section className="relative h-[100svh] min-h-[34rem] w-full overflow-hidden bg-charcoal">
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
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src="/media/hero-720.mp4" type="video/mp4" media="(max-width: 768px)" />
          <source src="/media/hero-1080.mp4" type="video/mp4" />
        </video>
      )}

      {/* Legibility scrim. The montage cuts to bright frames (a white shirt, a
          snowfield), so a single soft gradient isn't enough — a flat base tint
          plus a bottom-weighted gradient plus a left wash keeps the statement
          readable on every cut. */}
      <div aria-hidden className="absolute inset-0 bg-charcoal/35" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/20 to-charcoal/90"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-charcoal/10 to-transparent"
      />

      <div className="relative flex h-full flex-col">
        <div className="shell flex flex-1 items-end pb-16 md:pb-24">
          <div className="max-w-4xl">
            <p className="type-caption mb-6 text-ivory/70">{studio.tagline}</p>
            <h1 className="type-display text-ivory text-balance">
              {studio.statement}
            </h1>
          </div>
        </div>

        <div className="shell pb-8">
          <div className="flex items-center justify-between border-t border-ivory/15 pt-6">
            <span className="type-caption text-ivory/60">{studio.basedIn}</span>
            <a
              href="#work"
              className="type-caption group inline-flex items-center gap-2 text-ivory/60 transition-colors hover:text-ivory"
            >
              Scroll
              <span
                aria-hidden
                className="inline-block h-px w-8 bg-current transition-all duration-500 group-hover:w-12"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
