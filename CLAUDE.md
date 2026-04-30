# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A monorepo containing a **Strapi 5 CMS** backend (`/strapi`) and a **Next.js 16 frontend** (`/next`) for the Meetswiss luxury transfer website. Both apps are run together from the root.

## Commands

### Setup (first time)

```sh
yarn setup          # installs all deps + copies .env files for both apps
yarn seed           # imports demo content into Strapi
```

### Development

```sh
yarn dev            # starts Strapi on :1337, waits, then starts Next on :3000
```

### Individual apps

```sh
cd next && yarn dev
cd strapi && yarn develop
```

### Quality

```sh
yarn check:format   # check prettier formatting
yarn fix:format     # auto-fix formatting
cd next && yarn lint
```

### Data management

```sh
yarn seed           # import Strapi data from ./strapi/data/export_*.tar.gz
yarn export         # export current Strapi data
```

## Architecture

### Monorepo layout

- `/next` — Next.js 16 frontend (App Router, React 19, TypeScript, Tailwind)
- `/strapi` — Strapi 5 CMS (REST API, content types, custom middleware)
- `/scripts` — Root-level tooling (env copy script)

### Next.js structure

**Routing** uses Next.js App Router with i18n via URL prefix. The middleware (`next/middleware.ts`) rewrites paths to include the locale for the app router, but strips the default locale (`en`) from visible URLs. Supported locales: `en`, `fr` (see `next/i18n.config.ts`).

Route structure: `next/app/[locale]/(marketing)/` — all public pages live in the `(marketing)` route group.

**Pages:**

- `/` → homepage (`page.tsx` + `MeetswissHomepage` component)
- `/fleet`, `/fleet/[slug]` → vehicle catalog
- `/services`, `/services/[slug]` → service offerings
- `/blog`, `/blog/[slug]` → articles
- `/cities/[slug]` → city-specific pages

**Strapi data layer** (`next/lib/strapi/`):

- `client.ts` — all Strapi fetching. Three exported functions: `fetchCollectionType`, `fetchSingleType`, `fetchDocument`. These automatically use Next.js `'use cache'` with `cacheLife('max')` and named cache tags in production, bypass cache in draft mode, and bypass cache when `ENVIRONMENT=development`.
- `strapiImage.ts` — converts Strapi relative image paths to absolute URLs
- `spreadStrapiData.ts` — flattens Strapi response shape

**Cache invalidation**: `next/app/api/revalidate/` receives webhooks from Strapi and calls `revalidateContent()` from the strapi client. Set matching `REVALIDATE_WEBHOOK_SECRET` in both apps.

**SEO** (`next/lib/seo/`): Per-locale metadata generation. Global SEO settings come from the Strapi `global` single type. Per-page SEO uses the `seo` component on each entry.

**Key env vars for Next.js:**

- `NEXT_PUBLIC_API_URL` — Strapi base URL (e.g. `http://localhost:1337`)
- `IMAGE_HOSTNAME` — hostname for remote image patterns
- `REVALIDATE_WEBHOOK_SECRET` — shared secret for ISR webhooks
- `ENVIRONMENT=development` — disables `'use cache'` in local dev
- `NEXT_IS_DEMO=true` — shows the demo banner

### Strapi content types

Collection types: `pages`, `fleets`, `services`, `articles`, `testimonials`, `faqs`, `logos`, `redirections`

Single types: `global` (navbar, footer, SEO defaults)

Dynamic zone components (used in `pages`): `dynamic-zone.hero`, `dynamic-zone.how-it-works`, `dynamic-zone.faq`, `dynamic-zone.testimonials`, `dynamic-zone.brands`, `dynamic-zone.cta`, `dynamic-zone.features`, `dynamic-zone.form-next-to-section`, `dynamic-zone.related-articles`

Custom middleware lives in `strapi/src/api/*/middlewares/` and handles population depth for each API route.

### Homepage content flow

The homepage page (`next/app/[locale]/(marketing)/page.tsx`) fetches `pages` (filtered by `slug: homepage`), `fleets`, `services`, and `articles` in parallel, then maps raw Strapi data into a typed `MeetswissHomepageContent` shape via `buildHomepageContent()`, and passes it to the `MeetswissHomepage` client component (`next/components/meetswiss/homepage.tsx`). The homepage component is entirely `'use client'` and handles all carousels, the FAQ accordion, and the booking form UI.

### Design tokens

The site uses a dark luxury theme: background `#0a0a0a`, text `#f7f3e8`, gold accents `amber-400` / `#d4a843`. Two Google Fonts: `Manrope` (body, `--font-sans`) and `Bodoni Moda` (display, `--font-luxury`). `cn()` from `next/lib/utils.ts` is the `clsx` + `tailwind-merge` helper used throughout.
