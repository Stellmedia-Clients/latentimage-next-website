"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * `title` is a ReactNode, not a string: /services needs a title row that also
 * carries the service's one-line description above the fold.
 */
export type AccordionItem = { title: ReactNode; body: ReactNode };

/**
 * The expandable list used three times over: "What we do" on the home page,
 * the "Why brands work with us" panels below it, and the service detail on
 * /services.
 *
 * The panel animates on `grid-template-rows: 0fr -> 1fr` rather than a pixel
 * height. That transitions to intrinsic content height with no measuring pass,
 * so it stays correct when the font swaps in or the text rewraps on resize —
 * which a cached max-height would not.
 *
 * `inert` on the collapsed panel keeps its links and copy out of the tab order
 * and away from screen readers; `overflow-hidden` alone would leave them
 * reachable inside a zero-height box.
 */
export default function Accordion({
  items,
  single = false,
  className = "",
}: {
  items: AccordionItem[];
  /** One panel open at a time. */
  single?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState<number[]>([]);
  const uid = useId();

  const toggle = (i: number) =>
    setOpen((cur) =>
      cur.includes(i) ? cur.filter((x) => x !== i) : single ? [i] : [...cur, i],
    );

  return (
    <div className={className}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        const panelId = `${uid}-panel-${i}`;
        const buttonId = `${uid}-button-${i}`;

        return (
          <div key={i} className="border-t border-stone last:border-b">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left md:py-7"
              >
                <span
                  className={`type-subheading transition-colors duration-500 group-hover:text-bronze ${
                    isOpen ? "text-bronze" : ""
                  }`}
                >
                  {item.title}
                </span>

                {/* + rotates 45° into ×. */}
                <span
                  aria-hidden
                  className={`relative mt-2 block h-3 w-3 shrink-0 text-bronze transition-transform duration-500 ease-[var(--ease-brand)] motion-reduce:transition-none ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current" />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-brand)] motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-7 md:pb-9 md:pr-12">{item.body}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
