"use client";

/**
 * Custom image loader — required because this site builds with
 * `output: "export"` (see next.config.ts).
 *
 * A static export ships no server, so Next's built-in loader is wrong here:
 * it emits `/_next/image?url=...` URLs that only the on-demand optimizer can
 * answer. On a static host (Netlify) every one of those 404s and the whole
 * page renders as broken-image icons.
 *
 * So: hand Unsplash its own resizing parameters — it is a real image CDN and
 * does the job the optimizer would have — and let local files under public/
 * through untouched, since nothing can resize them at request time.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.startsWith("https://images.unsplash.com/")) {
    // Local asset in public/. Returned verbatim: the srcset will repeat this
    // one URL under several `w` descriptors, which is harmless — the browser
    // just picks it every time. Keep these assets small at rest instead.
    return src;
  }

  const url = new URL(src);
  // `set`, not `append`: content.ts already pins w=1600&q=80 on every source
  // URL, and those have to be replaced rather than duplicated.
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  // Preserved from the source URL when present, re-asserted when not, so a
  // caller that omits them still gets format negotiation and a sane crop.
  if (!url.searchParams.has("auto")) url.searchParams.set("auto", "format");
  if (!url.searchParams.has("fit")) url.searchParams.set("fit", "crop");
  return url.toString();
}
