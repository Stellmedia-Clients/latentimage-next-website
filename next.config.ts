import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Required from Next 16 — unlisted quality values are coerced to the nearest allowed entry.
    qualities: [60, 75, 90],
    // AVIF first, WebP fallback. Order matters: first Accept-header match wins.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400, // 31 days
    // NB: the `new URL()` shorthand implies `search: ""` (no query string
    // allowed), which rejects Unsplash's ?auto=format&w=... URLs. Omitting
    // `search` here implies `**`, permitting them.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-**",
      },
    ],
  },
};

export default nextConfig;
