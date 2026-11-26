---
name: debugging
description: Project playbooks for diagnosing failures in this Next.js 16 site, used after the vendored systematic-debugging skill sets the method. Covers build failures (including the iCloud ECANCELED case), type errors, client-side rendering bailouts and hydration warnings, stale data and revalidation, notice board API failures or hangs, the Open Graph image, Tailwind v4 styles, production-only bugs, Vercel deployment logs and regression checks. Use when a build, check, page or deployment fails or behaves unexpectedly.
---

# Debugging

Load the vendored `systematic-debugging` skill first. It owns the method: reproduce, find the root cause before proposing a fix, test one hypothesis at a time, verify. This skill adds the map of this repository: the failures that actually happen here, how to observe them and where the fix belongs.

## Ground rules

- Reproduce in the mode where it fails. Many bugs here exist only in a production build: use `pnpm build` and `pnpm start -p 3123`, not `pnpm dev` (section 8).
- Read the bundled Next.js page for the API involved (`node_modules/next/dist/docs/`, listed in the `frontend-development` skill).
- Give blocking commands a timeout (builds, installs, servers) and quote the repository path: it contains a space.
- After the fix: add a regression check (section 10), update the docs that described the old behavior, and close the loop in the issue.

| Symptom | Section |
|---|---|
| `pnpm build` fails or hangs | 1 |
| `pnpm typecheck` or the build reports type errors | 2 |
| Server HTML without page content, or hydration warnings | 3 |
| Data, notices or dates look old or wrong | 4 |
| Notice board empty, hanging or showing the error page | 5 |
| Link previews show the wrong image, text or host | 6 |
| A Tailwind class has no effect | 7 |
| Works in `pnpm dev`, breaks after `pnpm build` or on Vercel | 8 |
| You need the logs of a preview or production deployment | 9 |

## 1. Build failures

| Symptom | Cause | Fix |
|---|---|---|
| `ECANCELED` while reading a file under `node_modules` | The clone sits in an iCloud-synced folder (Desktop or Documents). iCloud evicts files it considers unused and leaves "dataless" placeholders, and Node's reads of them are cancelled. Confirm with `ls -lO "<file from the error>"`: the flags column shows `dataless`. | Now: `rm -rf node_modules .next && pnpm install`, which restores real files from the pnpm store. Lasting: move the clone outside iCloud (for example `~/code/`) and reinstall; while it stays in iCloud the eviction comes back. |
| Invalid environment variables error when `dev` or `build` starts | `next.config.ts` imports `src/env.ts`, which validates `KV_*` and `ADMIN_*` | Unset them; they are unused placeholders. |
| The build waits on prerendering `/` and then fails | The home prerender calls the UNLP API and `fetchCartelera()` sets no timeout; Next.js allows a page 60 seconds (`staticPageGenerationTimeout`), retries, then fails | Check the network and the API (section 5), then rebuild. |
| The build passes but the home lacks "Últimos anuncios" (latest notices) | The API answered with a non-2xx status: `fetchCartelera()` logged `Cartelera fetch failed: <status>` and returned `[]` | Section 5. |
| "Missing Suspense boundary with useSearchParams" | A client component reads the query string on a prerendered route outside `<Suspense>` | Read `use-search-params.md`. Prefer the page's `searchParams` prop, or wrap that component, not the page, in `<Suspense>`. |
| A module error about `fs`, `node:fs` or `sanitize-html` in a client chunk | A client component imports server-only code | Keep the import in a Server Component and pass data as props. |
| `pnpm check` fails in CI | Biome, `tsc`, branding guard, file size or hook tests | Run `pnpm check` locally; the first failing step stops the chain. |

Production builds minify server code. For readable prerender stack traces run `pnpm exec next build --debug-prerender` (never deploy that output), and limit the build to the failing route with `--debug-build-paths=/cartelera`. Both are described in `node_modules/next/dist/docs/01-app/02-guides/building.md`.

## 2. Type errors

- `pnpm typecheck` runs `tsc --noEmit` in strict mode (TypeScript 6). The pre-push hook runs it, and `next build` type-checks again.
- `next dev` and `next build` generate route types under `.next/` that `tsconfig.json` includes. After renaming or deleting a route, stale generated types can report errors for files that no longer exist: run `pnpm exec next typegen` or delete `.next`.
- Frequent causes in this codebase:
  - `params` or `searchParams` typed as plain objects instead of `Promise<...>`.
  - A new member of `EventoCategoria`, `TipoMateria` or `Cuatrimestre` not handled in a `Record<...>` map (`CATEGORIA_LABELS`, `CATEGORIA_STYLES`, `PRIORIDAD` in `CalendarioView.tsx`). `CATEGORIAS_ORDEN` is a plain array and will not complain.
  - Content typos the types catch: `anio` outside 1 to 5, a misspelled `tipo`.
  - Base UI props: use the namespace types (`DialogPrimitive.Popup.Props`) and the `render` prop; there is no `asChild`.
- What types cannot catch: `res.json()` returns `any`, and the `as ApiResponse` cast in `cartelera.ts` hides shape changes until runtime. Parse with zod instead of widening a cast.
- Never silence an error with `any`, `@ts-ignore` or an unexplained `!`.

## 3. Client-side rendering bailouts and hydration warnings

Symptom: the server HTML has the full `<head>` but no page markup. `curl -s http://localhost:3123/carreras | grep -c "<h1"` prints 0 (the page text is still in the response, but only inside the inlined RSC payload scripts), the HTML carries a `BAILOUT_TO_CLIENT_SIDE_RENDERING` marker, and the content appears only after JavaScript runs. This is the tracked bug, and it has two causes that both need fixing:

1. `src/app/layout.tsx` wraps all pages in `<Suspense fallback={null}>` around `NavigationLoadingProvider`, which calls `useSearchParams()`. On prerendered routes Next.js renders everything up to that boundary in the browser.
2. `src/app/(public)/layout.tsx` wraps the shell in `ClientOnlyMobileSidebarProvider`, a `next/dynamic` import with `ssr: false`. Nothing inside it renders on the server, on any route, including the dynamic `/cartelera`. Fixing cause 1 alone does not bring content back.

Fix direction, in its own issue: render only the progress bar inside a Suspense boundary as a sibling of `children` instead of a wrapper, make the drawer context a regular client provider, and keep `ssr: false` for leaf widgets that truly need it. Verify with `curl` against a production build that each route's `<h1>` is in the HTML.

Hydration warnings: today they can only come from what renders above the shell (`<html>`, `<body>`, the JSON-LD script, the providers in the root layout), often from attributes that browser extensions inject; the `ui-verification` smoke script uses a clean browser profile. Once the shell renders on the server, these components will mismatch because they read browser-only values during render:

| Component | Value read during render | Fix |
|---|---|---|
| `ThemeToggle` | `localStorage` in the `useState` initializer | Start from a fixed value, read storage in an effect, set `data-theme` before paint with a small inline script in the root layout |
| `CalendarioView` | `new Date()` for today, the month and the selected day | Initialize after mount, or pass the date from the server |
| `AnuncioCard` | `formatRelative()` and `formatFechaCompleta()` (current time and time zone) | Format after mount, or format on the server in `America/Argentina/Buenos_Aires` |

`suppressHydrationWarning` on `<html>` covers only that element's own attributes. Do not spread it to hide real mismatches.

## 4. Stale data and revalidation

| Route or data | Freshness | Set in |
|---|---|---|
| `/` | ISR: regenerated in the background at most every 300 s, when requested | `export const revalidate = 300` in `(public)/page.tsx` |
| `/cartelera` | Rendered on every request because it reads `searchParams`; its `revalidate = 300` only sets the fetch default | `cartelera/page.tsx` |
| Notice API response, shared by `/` and `/cartelera` | Data Cache for 300 s, served stale while it refreshes; only HTTP 200 is stored | `REVALIDATE_SECONDS` in `src/lib/cartelera.ts` |
| `/carreras`, `/carreras/[carrera]`, `/materia/[slug]`, `/calendario`, `/bibliografia`, `/links`, `/sobre-mi`, metadata routes | Static until the next deployment | Content modules and page constants |
| `SITE.url`, sitemap `lastModified`, `/sobre-mi` photo checks | Fixed at build time | `site.ts`, `sitemap.ts`, `sobre-mi/page.tsx` |
| Calendar "today" | Browser clock, refreshed every minute | `CalendarioView.tsx` |

- Content was edited but the site shows the old version: content is code and ships with the next deployment. Check that the pull request merged and its deployment finished (section 9). There is no on-demand revalidation endpoint.
- The home lags behind the notice board: it regenerates only when visited after its window, and relative times such as "hace 2 horas" are frozen when the page is generated.
- Every notice time is 3 hours early and every age 3 hours older: not a cache problem. `parseFecha()` builds dates in the server time zone (UTC on Vercel) from Argentina times. Reproduce with `TZ=UTC` (section 8).
- Locally, `pnpm dev` renders pages on every request and a hard refresh bypasses the fetch cache. With `pnpm start`, ISR pages and fetch results persist under `.next`; `rm -rf .next` and rebuild to start clean.

## 5. Notice board API failures or hangs

`fetchCartelera()` requests `https://gestiondocente.info.unlp.edu.ar/cartelera/data/0/500` (public, no authentication). It handles exactly one failure: a non-2xx status logs `Cartelera fetch failed: <status>` and returns `[]`. It has no timeout or `AbortSignal`, no try/catch, no zod validation, and it parses dates in the server time zone.

| Symptom | Likely cause |
|---|---|
| `/cartelera` shows "Sin resultados" (no results) with default filters and `/` lacks "Últimos anuncios" | Non-2xx from the API with nothing cached; the UI cannot tell it from "no matches", so read the logs |
| "Algo salió mal" (something went wrong) on `/cartelera` | Network error, invalid JSON or a changed response shape with nothing cached, or a malformed date that makes `mensajeId()` throw |
| `/cartelera` or the build hangs | The API is slow or silent and nothing bounds the wait |
| Canceled notices never show their cancellation date | `fecha_anulacion` arrives in ISO 8601, `parseFecha()` expects `DD/MM/YYYY HH:mm` |
| Notices without career chips or missing under a career filter | `carrerasDeMateria()` matches subject names exactly (accents, "Redictado - " prefixes) |

Check the API directly, with a time limit, and compare the keys with `MensajeRaw` in `src/lib/cartelera.ts`:

```bash
curl -sS -m 20 -o /dev/null -w "%{http_code} %{time_total}s %{size_download} bytes\n" \
  https://gestiondocente.info.unlp.edu.ar/cartelera/data/0/500
curl -sS -m 20 https://gestiondocente.info.unlp.edu.ar/cartelera/data/0/3 \
  | node -e 'let s="";process.stdin.on("data",(d)=>{s+=d}).on("end",()=>{const j=JSON.parse(s);console.log(j.total,Object.keys(j.mensajes[0]),j.mensajes[0].fecha)})'
```

Then read the server output (the `pnpm start` terminal, or the runtime logs on Vercel) for `Cartelera fetch failed` or a stack trace.

The fix belongs in `src/lib/cartelera.ts`, in its own issue: `signal: AbortSignal.timeout(...)` on the fetch, a try/catch that returns an explicit error state the page can show instead of an empty list, a zod schema with `safeParse` that drops malformed items, and date parsing in `America/Argentina/Buenos_Aires`. Keep `next: { revalidate: 300 }`; a `signal` only opts the call out of render-pass memoization (`fetch.md`).

## 6. Open Graph image and link previews

`src/app/opengraph-image.tsx` renders one 1200x630 PNG with `next/og`, prerendered at build time. Every page points `og:image` and `twitter:image` at `/opengraph-image` through the root metadata or `pageMetadata()`.

| Symptom | Cause | Fix |
|---|---|---|
| Previews show a per-deployment host in `og:url` or printed on the image | `NEXT_PUBLIC_SITE_URL` is unset in that environment, so `SITE.url` falls back to `VERCEL_URL` | Set it for Production in the Vercel project and redeploy; it is read at build time |
| A page lost its preview image | It sets `openGraph` or `twitter` itself, and page metadata replaces the root object | Build its metadata with `pageMetadata()` |
| The image text is not in Poppins | `ImageResponse` loads no font file and falls back to the font bundled with `next/og` | Pass the font data through the `fonts` option (`01-metadata/opengraph-image.md`) |
| The build fails in `opengraph-image.tsx` | An exception or unsupported CSS; every element with more than one child needs `display: "flex"` | Fix the markup; errors here always fail the build |
| A chat keeps showing an old preview | The chat app caches previews | Confirm the live tags first, then wait or use the app's refresh |

The head is static HTML, so inspect it without a browser:

```bash
curl -s http://localhost:3123/links | grep -o '<meta property="og:[^>]*>'
curl -sI http://localhost:3123/opengraph-image
```

Keep the default Node.js runtime for the image route.

## 7. Tailwind v4 styles not applying

Tailwind v4 runs through `@tailwindcss/postcss` (`postcss.config.mjs`) and is configured only in `src/app/globals.css`.

| Symptom | Cause | Fix |
|---|---|---|
| A class built at runtime (`bg-${color}`) does nothing | Tailwind generates only classes it finds as complete strings in source files | Map values to full class strings, as `CATEGORIA_STYLES` in `calendario.ts` does |
| `bg-success`, `text-warning` or a new token class does nothing | Only variables mapped in `@theme inline` get utilities | Add `--color-<name>: var(--<name>);` to `@theme inline`, with light and dark values |
| `dark:` classes never apply | The variant matches `[data-theme="dark"]` on an ancestor, not the OS setting or a `dark` class, and the attribute appears only after `ThemeToggle` mounts | Check `<html data-theme>` in the browser; in Playwright seed `localStorage.theme` (`smoke.mjs --theme dark`) |
| A utility loses to a rule from `globals.css` | Most custom rules there are unlayered, and unlayered CSS beats every utility in `@layer utilities` regardless of specificity | Move the rule into `@layer components`, turn it into an `@utility`, or change the custom class |
| No focus outline inside a dialog, sheet or other primitive | `[data-slot] :focus-visible { outline: none }` in `globals.css` | Give the element a `focus-visible:ring-*` class |
| Notice bodies look off | Allowlisted inline styles survive sanitizing; `.cartelera-body` neutralizes font sizes and families, and in dark mode colors and backgrounds | Adjust the `.cartelera-body` rules, not the sanitizer |
| Graph controls or nodes look wrong | The library stylesheet is imported in `CorrelativasGraph.tsx` and themed under `.correlativas-graph` | Change the overrides in `globals.css` |
| A change does not show in dev | Stale dev output | Restart `pnpm dev`, and delete `.next` if needed |

The v4 important modifier goes at the end (`max-w-[95vw]!`); `AnuncioCard.tsx` and `CorrelativasGraphTrigger.tsx` still use the older leading form.

## 8. Production-only bugs

Reproduce against a production server, with timeouts:

```bash
pnpm build                    # about 10 minutes at most; needs network for the home prerender
pnpm start -p 3123            # run in the background and stop it when done
```

| Works in dev, fails in production | Why |
|---|---|
| Page content missing from the HTML | The `useSearchParams` bailout happens only when a route is prerendered (section 3) |
| Old content or old notices | Static pages and the ISR copy of `/` are built once (section 4) |
| A photo added to `public/sobre-mi` does not appear | The `existsSync` check runs at build time on that static page |
| Absolute URLs point at another host | `SITE.url` is resolved at build (section 6) |
| Notice times are 3 hours early | Vercel runs in UTC, your machine in Argentina time. Reproduce with `TZ=UTC pnpm build && TZ=UTC pnpm start -p 3123` |
| "Algo salió mal" with only an "Error ID" | Production hides error messages and `error.tsx` logs only in development. Search the server output for that digest |

## 9. Vercel deployment logs

- Every push to a pull request gets a preview deployment, linked from the Vercel comment and from `gh pr checks <n>`. Staging follows `dev`; production follows `main`.
- Build logs: in the Vercel dashboard open the project, then Deployments, pick the deployment (filter by branch) and read its build output. Compare the route table with your local `pnpm build`: `○` static, `●` prerendered from `generateStaticParams`, `ƒ` dynamic. `/cartelera` must be `ƒ`.
- Runtime logs: the project's Logs view filters by deployment, path, status and level. Look for `Cartelera fetch failed`, stack traces and the digest shown as "Error ID" on the error page. The Hobby plan keeps runtime logs only for a short time, so reproduce and read them right away.
- Environment variables per environment are in the project settings. Only `NEXT_PUBLIC_SITE_URL` is expected, and it matters in Production.
- CI failures are not in Vercel: `gh run view <run-id> --log-failed`.
- Production broken and the previous deployment was good: use Instant Rollback in the dashboard (`docs/architecture/deployment.md`). Never deploy production from the CLI.

## 10. Add a regression check

There is no unit test runner for `src/` yet; `pnpm test:hooks` covers only `.claude/hooks`. Use the strongest check available today:

1. Make the bug unrepresentable: a zod schema at the boundary, a union with an exhaustive `Record`, `satisfies`, or a helper like `pageMetadata()` that owns the rule.
2. Cover the route in the browser: run the `ui-verification` smoke script with the failing path, query string included. For a route that should always be checked, add it to `DEFAULT_PATHS` in `.claude/skills/ui-verification/scripts/smoke.mjs`.
3. Record the behavior as a Gherkin scenario in the feature page's acceptance criteria (`feature-spec` skill), named so a future end-to-end test can match it.
4. For hook rules add a case to `.claude/hooks/tests/rules.test.mjs`; for repository checks extend the script in `scripts/`.

A test runner is a new dependency and a decision: propose it in an issue and an ADR instead of slipping it into a bug fix. The pull request's "How to test" lists the reproduction steps and the check that now guards them.
