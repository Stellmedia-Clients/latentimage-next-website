"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import WorkGallery from "../components/WorkGallery";
import CtaLink from "../components/CtaLink";
import { projectsPage } from "../copy";

/**
 * Gallery switcher. Only Photography has work behind it so far; the rest carry
 * an explicit empty state rather than filler that would read as real projects.
 *
 * Roving tabindex with automatic activation, per the WAI-ARIA tabs pattern:
 * only the selected tab is in the tab order, and the arrow keys move between
 * them.
 */
export default function ProjectTabs() {
  const galleries = projectsPage.galleries;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = galleries.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;

    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  const current = galleries[active];

  return (
    <>
      {/* The strip scrolls rather than wraps on narrow viewports — four labels
          stacked into two rows stop reading as one set of choices. */}
      <div className="no-scrollbar overflow-x-auto border-y border-stone">
        <div
          role="tablist"
          aria-label="Project galleries"
          onKeyDown={onKeyDown}
          className="shell flex w-max min-w-full gap-8 md:gap-10"
        >
          {galleries.map((gallery, i) => (
            <button
              key={gallery.slug}
              ref={(node) => {
                tabs.current[i] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${gallery.slug}`}
              aria-selected={active === i}
              aria-controls={`panel-${gallery.slug}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={`type-caption relative whitespace-nowrap py-5 transition-colors duration-300 ${
                active === i ? "text-charcoal" : "text-sage hover:text-charcoal"
              }`}
            >
              {gallery.label}
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-px transition-colors duration-300 ${
                  active === i ? "bg-bronze" : "bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${current.slug}`}
        aria-labelledby={`tab-${current.slug}`}
        tabIndex={0}
        className="shell pb-24 pt-4 md:pb-32"
      >
        {current.ready ? (
          <WorkGallery />
        ) : (
          <div className="mt-12 border border-stone px-8 py-20 text-center md:py-28">
            <h2 className="type-subheading text-charcoal">
              {projectsPage.empty.title}
            </h2>
            <p className="type-body mx-auto mt-4 max-w-md text-sage">
              {projectsPage.empty.body}
            </p>
            <CtaLink href="/enquire" className="mt-10">
              Start a Conversation
            </CtaLink>
          </div>
        )}
      </div>
    </>
  );
}
