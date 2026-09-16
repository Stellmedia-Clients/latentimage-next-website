"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { blurFor } from "../content";

export type LightboxItem = {
  src: string;
  alt: string;
  category: string;
};

/**
 * Full-screen image viewer.
 *
 * Navigation is a native scroll-snap track of 100vw slides rather than custom
 * gesture handling. That gives touch swipe, trackpad horizontal scroll and
 * momentum for free, exactly matching platform behaviour, and click/keyboard
 * simply drive the same track through scrollTo — so every input path ends up
 * in one place instead of three implementations that can disagree.
 *
 * Clicking the left half goes back, the right half forward; the cursor swaps to
 * signal which. Click handlers sit on the slides rather than an overlay,
 * because an overlay with pointer-events would swallow the touch scrolling.
 */
export default function Lightbox({
  items,
  startIndex,
  onClose,
}: {
  items: LightboxItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(startIndex);

  // Jump to the clicked image before the first paint so it never flashes
  // slide 1 and then slides across.
  //
  // Returning focus to the tile that opened this is deliberately NOT done here:
  // React applies `autoFocus` during commit, before effects run, so by this
  // point document.activeElement is already our own close button. The opener
  // captures the trigger instead (see WorkGallery).
  useEffect(() => {
    const el = track.current;
    if (el) el.scrollLeft = startIndex * el.clientWidth;
  }, [startIndex]);

  // Lock the page behind the overlay.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, items.length - 1));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [items.length]);

  // Keep the counter in sync with wherever the track actually is.
  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el || el.clientWidth === 0) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goTo(index + 1);
      else if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo, onClose]);

  // Re-anchor on resize/orientation change, since slide width is the unit.
  useEffect(() => {
    const onResize = () => {
      const el = track.current;
      if (el) el.scrollLeft = index * el.clientWidth;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index]);

  const handleSlideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const forward = e.clientX > window.innerWidth / 2;
    goTo(forward ? index + 1 : index - 1);
  };

  // Cursor hint without re-rendering on every mouse move.
  const handleSlideMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const forward = e.clientX > window.innerWidth / 2;
    const atEdge = forward ? index === items.length - 1 : index === 0;
    el.style.cursor = atEdge ? "default" : forward ? "e-resize" : "w-resize";
  };

  const current = items[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${items.length}: ${current?.alt ?? ""}`}
      className="fixed inset-0 z-[100] bg-charcoal"
      style={{ animation: "lb-in 0.42s cubic-bezier(0.22,1,0.36,1) both" }}
    >
      <div
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-contain"
      >
        {items.map((item, i) => (
          <div
            key={item.src}
            onClick={handleSlideClick}
            onMouseMove={handleSlideMove}
            className="relative flex h-full w-full shrink-0 snap-center items-center justify-center px-4 py-24 md:px-16 md:py-28"
          >
            <div className="relative h-full w-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                quality={90}
                // Only the visible slide and its neighbours are worth fetching.
                loading={Math.abs(i - index) <= 1 ? "eager" : "lazy"}
                placeholder={blurFor(item.src) ? "blur" : "empty"}
                blurDataURL={blurFor(item.src)}
                sizes="100vw"
                className="object-contain"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Caption + counter */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 md:p-10">
        <div className="flex items-end justify-between gap-6 border-t border-ivory/15 pt-5">
          <div className="min-w-0">
            <p className="type-subheading truncate text-ivory">{current?.alt}</p>
            <p className="type-caption mt-1.5 text-ivory/55">{current?.category}</p>
          </div>
          <p className="type-caption shrink-0 tabular-nums text-ivory/55">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        autoFocus
        aria-label="Close"
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-charcoal md:right-8 md:top-8"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </button>

      {/* Edge arrows: discoverability for the click-to-change behaviour.
          Hidden where there is no hover, since swiping is the obvious gesture. */}
      {index > 0 && (
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-charcoal [@media(hover:hover)]:flex md:left-8"
        >
          <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden>
            <path d="M6 1L1 6L6 11M1 6H16" stroke="currentColor" strokeWidth="1.25" fill="none" />
          </svg>
        </button>
      )}
      {index < items.length - 1 && (
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next image"
          className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-charcoal [@media(hover:hover)]:flex md:right-8"
        >
          <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden>
            <path d="M10 1L15 6L10 11M15 6H0" stroke="currentColor" strokeWidth="1.25" fill="none" />
          </svg>
        </button>
      )}

      <style>{`
        @keyframes lb-in {
          from { opacity: 0; transform: scale(1.015); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="dialog"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
