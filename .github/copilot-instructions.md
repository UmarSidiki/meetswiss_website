# Copilot Instructions for LaunchPad

## Build, test, and lint commands

Use **Yarn** from the repository root (this repo is configured for Yarn 4 with `node_modules` linking).

| Goal                                                                            | Command                                                             |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Install root dependencies                                                       | `yarn install`                                                      |
| Bootstrap both apps (`next/` + `strapi/`) and create `.env` files from examples | `yarn setup`                                                        |
| Seed Strapi with demo content                                                   | `yarn seed`                                                         |
| Run full local stack (starts Strapi, waits for `:1337`, then starts Next.js)    | `yarn dev`                                                          |
| Run only Next.js app                                                            | `yarn next`                                                         |
| Run only Strapi app                                                             | `yarn strapi`                                                       |
| Build Next.js                                                                   | `cd next && yarn build`                                             |
| Build Strapi admin/backend                                                      | `cd strapi && yarn build`                                           |
| Lint frontend code                                                              | `cd next && yarn lint`                                              |
| Check formatting across repo                                                    | `yarn check:format`                                                 |
| Fix formatting across repo                                                      | `yarn fix:format`                                                   |
| Run full test suite                                                             | **No test script is currently configured**                          |
| Run a single test                                                               | **Not available (no test runner/test files configured in scripts)** |

## High-level architecture

- This is a **two-app monorepo**: `strapi/` is the CMS backend and content model; `next/` is the website frontend. Root scripts orchestrate both.
- The Next.js app uses the **App Router with locale-prefixed routes** (`app/[locale]/...`). `proxy.ts` redirects non-localized requests to a locale path based on request language.
- Most frontend pages fetch content from Strapi and render **dynamic zones** via `next/components/dynamic-zone/manager.tsx`, which maps Strapi `__component` values to React components.
- Strapi defines content in `strapi/src/api/**/content-types/**/schema.json` and reusable blocks in `strapi/src/components/**`. Key page/content types are localized (i18n plugin enabled).
- Strapi routes for content-heavy APIs (page/article/product/global/blog-page/product-page) apply custom `*-populate` middlewares that set `ctx.query.populate` so nested relations/media are returned in one query.
- Frontend data access is centralized in `next/lib/strapi/client.ts` (`fetchCollectionType`, `fetchSingleType`, `fetchDocument`), which handles published vs draft status and Next.js cache tagging.
- Preview flow is wired end-to-end: Strapi preview uses `PREVIEW_SECRET`, Next routes `/api/preview` and `/api/exit-preview` toggle draft mode, and `next/components/preview.tsx` listens for Strapi postMessage updates.
- Redirects are CMS-driven: Next `next.config.mjs` fetches Strapi `redirections` and converts them into locale-aware Next.js redirects.

## Key conventions in this repository

- **Use Strapi helper fetchers, not ad-hoc fetch calls** for CMS content in Next pages/components. This preserves draft-mode behavior and cache tagging strategy.
- For localized dynamic routes, pages compute a `localizedSlugs` map from Strapi `localizations` and render `ClientSlugHandler`; `LocaleSwitcher` relies on this state to build cross-locale links.
- When adding/changing CMS fields or relations used by the frontend, update the matching Strapi `*-populate` middleware, otherwise data will be missing at runtime.
- When introducing a new UI section (especially dynamic-zone blocks), keep frontend and backend in sync across:
  1. Strapi component schema (`strapi/src/components/dynamic-zone/*.json`)
  2. Relevant Strapi populate middleware(s)
  3. Next dynamic zone mapping (`next/components/dynamic-zone/manager.tsx`)
- If a UI section is removed, remove its Strapi schema/references and related frontend mapping/files in the same change to avoid dead code and stale content models.
- Global navigation/footer/UI strings come from the Strapi `global` single type and are locale-specific; avoid hardcoding these values in frontend layout components.
- Keep SEO wiring complete when adding pages/sections: include Strapi `seo` data in schemas/populate and use Next `generateMetadata` + `generateMetadataObject` so metadata stays localized and consistent.
- Keep `PREVIEW_SECRET` consistent between `next/.env` and `strapi/.env`; `yarn setup` generates/copies env files and aligns this for local development.
- Frontend imports follow the `@/` alias (`next/tsconfig.json`), and formatting/import ordering is enforced by root Prettier config (`@trivago/prettier-plugin-sort-imports`).
