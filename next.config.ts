import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a fully static site into out/ — plain .html and assets, no Node
  // server — which is what the Netlify deploy serves.
  //
  // NB: this is at odds with Dockerfile/.woodpecker.yml, which expect
  // `output: "standalone"` and run `node server.js` from .next/standalone.
  // That folder is not produced in this mode, so the container build breaks
  // while this stands. Pick one target, or drive this value from an env var.
  output: "export",

  images: {
    // A static export ships no image optimizer, so the built-in loader's
    // `/_next/image?url=...` URLs would 404 on every host. This loader points
    // Unsplash at its own CDN resizing and passes local files through as-is.
    loader: "custom",
    loaderFile: "./image-loader.ts",

    // Required from Next 16 — unlisted quality values are coerced to the nearest allowed entry.
    qualities: [60, 75, 90],
    // Format negotiation is Unsplash's job now (`auto=format` in the loader),
    // not the optimizer's, so `formats` and `minimumCacheTTL` are dropped:
    // both configure the built-in loader, which no longer runs.

    // remotePatterns likewise only gates the built-in optimizer. A custom
    // loader is trusted to build its own URLs, so the Unsplash allowlist that
    // used to live here would have no effect — the loader's own hostname
    // check is what restricts it.
  },
};

export default nextConfig;
