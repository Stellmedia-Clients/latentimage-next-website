# syntax=docker/dockerfile:1

# Debian slim rather than Alpine because Next bundles sharp for the image
# optimizer (next.config.ts negotiates AVIF/WebP, so sharp runs on every
# /_next/image request). sharp ships prebuilt glibc binaries; on musl npm either
# falls back to a slow source build or installs a runtime that throws on the
# first optimized image. The size difference is not worth that risk here.
ARG NODE_VERSION=22-bookworm-slim

# ---------------------------------------------------------------- deps --------
# Split from the build so `npm ci` is re-run only when the lockfile changes,
# not on every source edit.
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

COPY package.json package-lock.json ./
# Dev dependencies are needed: the build runs TypeScript and Tailwind v4 via
# @tailwindcss/postcss, both devDependencies. They stay in this stage and the
# builder — the runner never sees them.
RUN npm ci

# --------------------------------------------------------------- build --------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# This is a fully static marketing site: content comes from app/content.ts at
# build time, so the build needs no database, no API and no secrets. If a
# server-side data source is ever added, note that values inlined into client
# components are baked in HERE, not at container start.
RUN npm run build

# ---------------------------------------------------------------- run ---------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Binds all interfaces. The default would be localhost, which inside a container
# means only the container itself — the compose network could not reach it.
ENV HOSTNAME=0.0.0.0

# Order matters: unpack standalone first, then layer the two directories that
# `output: standalone` deliberately leaves out — public/ and .next/static.
# Without them the site returns 404 for every asset, the hero video never loads
# and the page renders unstyled.
#
# --chown matters as much as the paths: the server runs as the unprivileged
# `node` user, and Next's image optimizer writes resized variants under
# .next/cache at request time. Copied as root, those writes fail with EACCES.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# The optimizer's on-disk cache. Deliberately NOT a volume — it is derived data,
# rebuilt on demand from public/ and the Unsplash originals, so losing it on
# redeploy costs one slow request per image, not content.
RUN mkdir -p /app/.next/cache && chown -R node:node /app/.next/cache

USER node
EXPOSE 3000

# Gates the compose rollout: `up -d --wait` fails the deploy instead of
# reporting green if the container builds but cannot serve. start-period covers
# cold boot, during which failures do not count against retries.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# server.js is emitted by `output: "standalone"` (see next.config.ts). Not
# `npm start` — that would need next in node_modules, which this stage omits.
CMD ["node", "server.js"]
