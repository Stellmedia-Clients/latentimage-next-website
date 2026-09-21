"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { shorts } from "../copy";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Horizontal rail of YouTube Shorts, autoplaying muted.
 *
 * Card sizing resolves a three-way squeeze. Under a ~290px header inside a
 * 100svh section, a card cannot at the same time (a) fit vertically, (b) stay
 * 9:16, and (c) leave enough of them wide enough to overflow a 1440px viewport.
 * So: height stretches to whatever the flex column leaves, `aspect-[9/16]`
 * derives the width from it, and `md:min-w-[16rem]` floors that width so the
 * track still overflows and the pinned scrub has somewhere to travel.
 *
 * Desktop (>=768px, motion allowed): the section pins and the track is scrubbed
 * right-to-left by vertical scroll. Distance is measured from the track's real
 * scrollWidth and recalculated on refresh, so font loading and resizes don't
 * desync the end point.
 *
 * Mobile / reduced-motion: no pinning — pinned horizontal scroll is unpleasant
 * on touch, so it falls back to a native snap-scrolling rail.
 */
export default function ShortsRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        if (!el) return;

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
      });

      return () => mm.revert();
    },
    { scope: section },
  );

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
            <p className="type-caption mb-4 text-bronze">Social Content</p>
            <h2 className="type-heading max-w-xl text-balance">
              Short-form work, made for the places people actually watch.
            </h2>
          </div>
          <p className="type-caption text-sage">Tap to open on YouTube</p>
        </div>
      </div>

      <div className="md:flex md:min-h-0 md:flex-1 md:items-stretch">
        <div
          ref={track}
          className="no-scrollbar flex gap-4 overflow-x-auto px-6 py-10 md:gap-6 md:overflow-visible md:px-12 md:py-8"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {shorts.map((id, i) => (
            <Short key={id} id={id} index={i} />
          ))}

          {/* Tail spacer so the last card can clear the right edge when pinned. */}
          <div aria-hidden className="hidden w-24 shrink-0 md:block" />
        </div>
      </div>
    </section>
  );
}

/* ── YouTube IFrame API ────────────────────────────────────────────────
 *
 * Only the handful of members we actually call are typed; @types/youtube is a
 * dependency's worth of surface for four methods.
 */
type YTPlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      host?: string;
      playerVars?: Record<string, number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (event: { data: number }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { PLAYING: number; ENDED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/**
 * Loads the API once for the whole page. Seven cards must not each append a
 * <script>, and `onYouTubeIframeAPIReady` is a single global slot, so letting
 * every card write it means only the last one ever resolves.
 */
/**
 * How long YouTube's chrome stays up after playback (re)starts before it fades
 * itself out — measured at ~3s, so the thumbnail is held a little past it.
 */
const CHROME_HOLD_MS = 2400;

let apiReady: Promise<YTNamespace> | null = null;

function loadYouTubeApi(): Promise<YTNamespace> {
  apiReady ??= new Promise<YTNamespace>((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    window.onYouTubeIframeAPIReady = () => resolve(window.YT!);
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiReady;
}

/**
 * One card. The player is mounted only while the card is near the viewport:
 * seven YouTube players on the page at once is megabytes of third-party script
 * for something the visitor can see at most two or three of.
 *
 * Three separate things conspire to show YouTube's own chrome over the video,
 * and each is dealt with in a different place below:
 *
 *  1. A portrait embed gets the Shorts player — wordmark, Like/Share rail,
 *     centre play/pause flanked by prev/next. `controls=0` has no say over any
 *     of it. Fixed by giving the player a landscape box (see the host div).
 *  2. `loop=1&playlist=<id>` loops by *reloading* the video, which is a whole
 *     fresh player load and brings every bit of chrome back with it. Looping
 *     with `seekTo` instead keeps one continuous playback session.
 *  3. Even a seek re-enters PLAYING, and YouTube draws the title bar, the
 *     centre bezel and the More button on every (re)start, for ~3s. Nothing in
 *     the embed API turns that off, and the bezel is dead centre so no amount
 *     of cropping hides it. The thumbnail is therefore held over the player for
 *     CHROME_HOLD_MS after each start — at first play, and again at every loop.
 *
 * The thumbnail is not decoration — it is the mask for (3), and it is the whole
 * card under reduced motion. `hqdefault` is a 4:3 frame with the vertical video
 * pillarboxed inside it; cropping that to 9:16 with object-cover lands exactly
 * on the video content, so the bars never appear.
 */
function Short({ id, index }: { id: string; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => setMounted(entry.isIntersecting),
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = host.current;
    if (!el) return;

    let player: YTPlayer | undefined;
    let loop: ReturnType<typeof setInterval> | undefined;
    let reveal: ReturnType<typeof setTimeout> | undefined;
    let restarting = false;
    let cancelled = false;

    // The API *replaces* the element it is handed, so it gets a node of its own
    // that React has never seen. React owns only `host`, which is empty in the
    // JSX, so the two teardowns can never fight over the same child.
    const slot = document.createElement("div");
    el.appendChild(slot);

    // Every restart puts the thumbnail back up first. Seeking re-enters PLAYING,
    // and YouTube treats that as a fresh start: title bar, centre bezel and
    // More button all draw again and take ~3s to fade. The poster goes up
    // before the seek so there is never a frame where they are visible.
    const restart = () => {
      if (restarting || !player) return;
      restarting = true;
      if (reveal) clearTimeout(reveal);
      setLive(false);
      player.seekTo(0, true);
    };

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;

      player = new YT.Player(slot, {
        videoId: id,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          playsinline: 1,
          rel: 0,
          disablekb: 1,
        },
        events: {
          // The constructor returns before the player exists — getDuration and
          // friends are only attached once onReady fires, so the loop cannot be
          // started any earlier than this.
          onReady: () => {
            // Seek back a beat before the end rather than waiting for ENDED: by
            // the time that fires, the end screen has already drawn over the
            // last frame, which is the chrome we are here to avoid.
            loop = setInterval(() => {
              if (!player || restarting) return;
              const duration = player.getDuration();
              if (duration && duration - player.getCurrentTime() < 0.5) {
                restart();
              }
            }, 200);
          },
          onStateChange: (event) => {
            // A restart that failed to take: the seek is refused near the very
            // end often enough to matter, and a throttled background tab can
            // overshoot the window entirely. Either way the end screen is up,
            // so force the restart rather than leaving the card sitting on it.
            if (event.data === YT.PlayerState.ENDED) {
              restarting = false;
              restart();
              return;
            }
            if (event.data === YT.PlayerState.PLAYING) {
              restarting = false;
              if (reveal) clearTimeout(reveal);
              reveal = setTimeout(() => setLive(true), CHROME_HOLD_MS);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (loop) clearInterval(loop);
      if (reveal) clearTimeout(reveal);
      player?.destroy();
      el.replaceChildren();
      setLive(false);
    };
  }, [mounted, id]);

  return (
    <article
      ref={ref}
      className="group relative aspect-[9/16] w-[min(72vw,17rem)] shrink-0 overflow-hidden rounded-xl bg-charcoal md:w-auto md:min-w-[16rem]"
      style={{ scrollSnapAlign: "center" }}
    >
      {mounted && (
        <div
          ref={host}
          /* The player must not eat the click — the overlay link below owns it,
             and on touch the card still has to scroll with the rail. */
          className="pointer-events-none absolute left-1/2 top-1/2 h-full [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0"
          /* Deliberately landscape: YouTube picks the player from the embed's
             own aspect ratio, and only a 16:9 box avoids the Shorts player.
             That player pillarboxes the 9:16 video, so the box is sized to put
             the bars outside the card — width = height x 16/9, and height = the
             card's height = its width x 16/9, so width is the card's width x
             (16/9)^2 = 256/81. The video then lands exactly on the card and the
             bars fall outside its overflow-hidden. The 1.02 absorbs subpixel
             rounding so no sliver of bar can show. */
          style={{
            width: "calc(100% * 256 / 81)",
            transform: "translate(-50%, -50%) scale(1.02)",
          }}
        />
      )}

      {/* After the player in DOM order so it covers the black first paint, and
          fades only once the player says it is actually playing. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        aria-hidden
        loading={index < 2 ? "eager" : "lazy"}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity ${live ? "opacity-0 duration-700" : "opacity-100 duration-150"
          }`}
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <a
        href={`https://www.youtube.com/shorts/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10 flex items-end p-5"
      >
        <span className="type-caption translate-y-2 text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          Watch on YouTube
        </span>
      </a>
    </article>
  );
}
