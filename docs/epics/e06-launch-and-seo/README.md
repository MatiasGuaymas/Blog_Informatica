# E06 Launch and SEO

| Status | Priority | Area | Issue |
|---|---|---|---|
| Planned | High | seo | [#44](https://github.com/MatiasGuaymas/Blog_Informatica/issues/44) |

## Goal

Launch on a custom domain with content that search engines can read, correct canonical URLs, Search Console monitoring and measurable performance.

## Problem

- Every statically prerendered page ships without visible content: NavigationLoadingProvider calls useSearchParams() and wraps all page content in `<Suspense fallback={null}>` in src/app/layout.tsx, so Next.js renders that content on the client only. In a production build the HTML body of /, /carreras, /calendario, /bibliografia, /links and /sobre-mi holds just a client-rendered Suspense boundary (`<!--$!-->`) and no visible text.
- Without NEXT_PUBLIC_SITE_URL, src/lib/site.ts falls back to VERCEL_URL (a per-deployment host) and then to https://blog-informatica.vercel.app, which is not the production URL in README.md (https://blog-informatica-mu.vercel.app).
- The metadata carries no Search Console verification and the sitemap marks every URL as modified at build time.
- First-load JS is about 277 KB gzip on most routes and there is no budget.

## Scope

**In scope**

- Server rendering of page content.
- Custom domain and canonical URL configuration.
- Search Console registration and sitemap.
- Performance budget enforced in CI.

**Out of scope**

- Paid promotion.
- Structured data beyond the current JSON-LD.
- Internationalization.

## Success criteria

- The raw HTML of every static route contains its main heading.
- Canonical URLs and the sitemap use the custom domain.
- The sitemap is processed with no errors.
- p75 field values are at or below LCP 2.5 s, INP 200 ms and CLS 0.1, and JavaScript budgets are enforced in CI.

## Features

| Key | Feature | Size | Priority | Issue |
|---|---|---|---|---|
| E06-F01 | Server-render page content instead of bailing out to the client (bug) | M | High | [#45](https://github.com/MatiasGuaymas/Blog_Informatica/issues/45) |
| E06-F02 | Configure the custom domain and NEXT_PUBLIC_SITE_URL | S | High | [#46](https://github.com/MatiasGuaymas/Blog_Informatica/issues/46) |
| E06-F03 | Register the site in Google Search Console and submit the sitemap | S | Medium | [#47](https://github.com/MatiasGuaymas/Blog_Informatica/issues/47) |
| E06-F04 | Set and enforce a performance budget for Core Web Vitals | M | Medium | [#48](https://github.com/MatiasGuaymas/Blog_Informatica/issues/48) |

## Dependencies

- E06-F01 ships with E04-F04.
- E06-F03 depends on E06-F01 and E06-F02.

## Risks

- Hydration mismatches surface once pages are server-rendered (calendar dates, theme toggle).
- Buying the domain needs a decision on cost and on who renews it.
- Field data needs real traffic before it is meaningful.
