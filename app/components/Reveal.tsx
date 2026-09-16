"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Fades/rises children once as they enter the viewport.
 *
 * Uses a shared rAF-throttled scroll pass rather than IntersectionObserver.
 * IO is the obvious choice here but it has a failure mode that matters on a
 * one-page site full of anchor links: if an element goes from below the
 * viewport to above it in a single jump (#contact from the nav, a restored
 * scroll position, a fast flick) it never becomes "intersecting", the observer
 * never fires, and the content stays invisible permanently.
 *
 * Checking rects on scroll has no such gap — anything at or above the fold is
 * revealed, whether it was scrolled past or scrolled to. The registry empties
 * as elements reveal and the listener detaches once it is empty, so the cost
 * is bounded and temporary.
 *
 * The visible state is the CSS default under prefers-reduced-motion.
 */
const pending = new Set<HTMLElement>();
let frame = 0;
let listening = false;

function flush() {
  frame = 0;
  const limit = window.innerHeight * 0.88;
  for (const el of pending) {
    if (el.getBoundingClientRect().top < limit) {
      el.dataset.shown = "true";
      pending.delete(el);
    }
  }
  if (pending.size === 0) detach();
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(flush);
}

function attach() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
}

function detach() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}

export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.shown = "true";
      return;
    }

    pending.add(el);
    attach();
    // Two passes: one now, one after the browser has applied any hash scroll.
    schedule();
    const t = window.setTimeout(schedule, 300);

    return () => {
      window.clearTimeout(t);
      pending.delete(el);
      if (pending.size === 0) detach();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
