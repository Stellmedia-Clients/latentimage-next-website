"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";
import { blurFor, work } from "../content";

/**
 * The selected-work grid. Client-side because each tile opens the lightbox;
 * the tiles themselves are <button>s so the viewer is reachable by keyboard,
 * not just by pointer.
 */
export default function WorkGallery() {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  // Send focus back to the tile that opened the viewer, once it has unmounted.
  useEffect(() => {
    if (openAt === null) trigger.current?.focus();
  }, [openAt]);

  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {work.map((item, i) => (
          <Reveal
            key={item.src}
            delay={(i % 3) * 80}
            className={item.span === "wide" ? "lg:col-span-2" : ""}
          >
            <figure className="group relative block w-full">
              <button
                type="button"
                onClick={(e) => {
                  trigger.current = e.currentTarget;
                  setOpenAt(i);
                }}
                aria-label={`Open ${item.alt} full screen`}
                className="relative block w-full cursor-zoom-in overflow-hidden bg-stone"
                style={{
                  aspectRatio:
                    item.span === "wide"
                      ? "3 / 2"
                      : item.span === "tall"
                        ? "3 / 4"
                        : "4 / 5",
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  quality={75}
                  placeholder={blurFor(item.src) ? "blur" : "empty"}
                  blurDataURL={blurFor(item.src)}
                  sizes={
                    item.span === "wide"
                      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  }
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
                />
              </button>
              <figcaption className="flex items-baseline justify-between gap-4 pt-4">
                <span className="type-subheading">{item.alt}</span>
                <span className="type-caption shrink-0 text-bronze">
                  {item.category}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      {openAt !== null && (
        <Lightbox
          items={work.map((w) => ({ src: w.src, alt: w.alt, category: w.category }))}
          startIndex={openAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </>
  );
}
