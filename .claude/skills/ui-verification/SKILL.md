---
name: ui-verification
description: Verify UI changes in a real browser before claiming they work, with a production build served on port 3123, the Playwright smoke script at mobile and desktop sizes, routes to check per area, keyboard, dark mode and reduced motion checks, screenshots for the pull request and stopping the server. Use after any change that affects what a page renders or how it behaves, and before saying a UI task is done.
---

# UI verification

A UI change is done only when it works in a real browser. A passing build or a `curl` is not enough here: the site shell is client-rendered (a known bug), so the server HTML of every page carries the `<head>` but no page markup. What students see exists only after JavaScript runs.

## 1. One-time setup

```bash
pnpm install                              # Playwright is a devDependency
pnpm exec playwright install chromium     # browser binary, once per machine
```

## 2. Choose how to run the site

| Mode | Commands | Use for |
|---|---|---|
| Production-like (default) | `pnpm build`, then `pnpm start -p 3123` | Final checks, screenshots, anything about rendering, caching, metadata or errors |
| Development | `pnpm dev` (port 3000) | Quick looks while coding; pass `--base http://localhost:3000` to the script |

In dev, pages render on every request, the `useSearchParams` client-rendering bailout does not happen, errors open the dev overlay on top of `error.tsx`, and ISR is not exercised. Verify the final state in production mode. `next dev` writes to `.next/dev`, so a dev server and a production build can coexist.

```bash
pnpm build             # foreground, timeout about 10 minutes; it calls the UNLP API
pnpm start -p 3123     # background (in Claude Code, run_in_background)
```

`pnpm start` serves the last build: rebuild after every code change. If the build fails with `ECANCELED`, see the `debugging` skill (iCloud).

## 3. Run the smoke script

From the repository root:

```bash
node .claude/skills/ui-verification/scripts/smoke.mjs
```

It polls the server until it answers, then opens every path in Chromium at two viewports: mobile 390x844 (device scale factor 2, touch) and desktop 1440x900. For each page it records the HTTP status, a redirect source, the title, the first `<h1>`, console errors and uncaught page errors.

| Argument | Default | Meaning |
|---|---|---|
| `--base <url>` | `http://localhost:3123` | Server to test |
| `--paths <list>` | `/`, `/carreras`, `/carreras/apu`, `/materia/cadp`, `/cartelera`, `/calendario`, `/bibliografia`, `/links`, `/sobre-mi` | Comma-separated paths. A missing leading `/` is added; query strings work (`/cartelera?carrera=ls`) |
| `--screenshots <dir>` | off | Saves a full-page PNG per path and viewport into `<dir>`, created if needed |
| `--theme light` or `--theme dark` | none, which renders light | Seeds `localStorage.theme` before each page loads and sets the browser color scheme; file names get a `-light` or `-dark` suffix |
| `--wait <seconds>` | `60` | How long to poll `--base` before giving up, so the script can start right after `pnpm start` |
| `-h`, `--help` | | Prints the usage and exits with code 2 |

Each check prints one line, then indented details (`redirected from`, `! <reason>`, `page error:`, `console error:`, `screenshot:`), and the run ends with `N/M checks passed.`:

```text
PASS  mobile   200  /cartelera  title="Cartelera · Blog Informática UNLP"  h1="Cartelera"
```

| Exit code | Meaning |
|---|---|
| 0 | Every page answered 2xx or 3xx, loaded, threw no page error and did not render the error boundary |
| 1 | A page returned another status, failed to load, threw a page error or showed "Algo salió mal" (something went wrong) |
| 2 | Bad arguments, nothing answering at `--base`, or Playwright or Chromium missing |

- Console errors are printed but do not fail the run. Read them: hydration warnings and failed requests show up there.
- A 404 counts as a failure, so check not-found pages by hand.
- With `--screenshots`, the script scrolls each page and waits 1.2 s before the capture, so sections that `Reveal` animates on scroll are visible.
- Quote `--paths` when it contains `?` or `&`.

```bash
node .claude/skills/ui-verification/scripts/smoke.mjs \
  --paths "/cartelera,/cartelera?carrera=ls&rango=90,/cartelera?page=2" --theme dark
node .claude/skills/ui-verification/scripts/smoke.mjs --base http://localhost:3000 --paths /calendario
```

## 4. Routes to check per area

Cover every route your change can reach, not only the file you edited: `globals.css`, `ui/` primitives, `Reveal` and the shell touch every page.

| Area | Paths | Look at |
|---|---|---|
| Shell | Any page; `/carreras/apu` for a two-level breadcrumb | Sidebar from 640px and its collapse surviving a reload; below 640px the drawer opens from "Abrir menú" (open menu) and closes on a link; active item; no breadcrumb on `/` |
| Home | `/` | Hero, unofficial notice, four career cards, "Últimos anuncios" (missing when the API failed), sections grid |
| Careers | `/carreras`, `/carreras/apu`, `/carreras/atic`, `/carreras/ls`, `/carreras/li` | Year and term blocks, type badges, links to subject pages and to the official optional subject lists |
| Prerequisites graph | A career page, then "Ver grafo de correlativas" (view prerequisites graph) | Dialog at 95vw by 92vh, readable nodes, hover highlight, a node click opens its subject page, "Cerrar" and Escape close |
| Subject page | `/materia/cadp` (with notes), `/materia/epa` (shows "Notas en preparación") | Header, prerequisites, "Aparece en el plan de" |
| Notice board | `/cartelera`, `/cartelera?carrera=ls&rango=90`, `/cartelera?q=parcial`, `/cartelera?page=2`, a `?a=` link copied from the home's latest notices | Filters update the URL, pagination keeps filters, empty state, modal opens and closes, notice bodies readable in dark mode |
| Calendar | `/calendario` | Month arrows, "Hoy" (today), day selection, category filters, "En curso ahora" and "Próximos 30 días" |
| Bibliography, links, about | `/bibliografia`, `/links`, `/sobre-mi` | External links open in a new tab; the photo collage on mobile and desktop |
| SEO and errors | `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/opengraph-image`, `/materia/inexistente` | Status and content type; the 404 page reads "Página no encontrada" (page not found) |

## 5. Keyboard, theme, motion and sizes

Keyboard, at the desktop size without touching the mouse:

- Tab and Shift+Tab move through the sidebar, the header and the content in visual order, and every focused element shows a visible indicator. Known gaps: there is no skip link, and the fallback outline is removed inside dialogs and the drawer (the `[data-slot]` rule in `globals.css`), so check focus there with care.
- Enter follows links and presses buttons; Enter or Space opens a notice card on `/cartelera` (the cards are `role="button"`).
- Escape closes the notice modal, the graph dialog and the mobile drawer; check that focus then returns to the element that opened them.
- Filter chips expose `aria-pressed`; calendar day cells are labeled buttons. The graph nodes are not keyboard reachable today: report it instead of calling the graph accessible.

A scripted check, from the repository root against the running server:

```bash
node --input-type=module -e '
import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3123/cartelera", { waitUntil: "networkidle" });
await page.getByRole("button", { name: /^Ver completo:/ }).first().focus();
await page.keyboard.press("Enter");
await page.getByRole("dialog").waitFor();
await page.keyboard.press("Escape");
await page.getByRole("dialog").waitFor({ state: "hidden" });
console.log("focus:", await page.evaluate(() => document.activeElement?.getAttribute("aria-label")));
await browser.close();
'
```

Dark mode:

- Toggle with the header button "Cambiar tema" (change theme) or run the script with `--theme dark`. The site ignores the OS setting and keeps the choice in `localStorage.theme`.
- Check text contrast on cards and chips, notice bodies with inline colors (`.cartelera-body` resets them), the graph controls, the holiday tint in the calendar, and the logo on its white tile.
- A flash of the light theme before dark applies on load is a known issue: `data-theme` is set after mount.

Reduced motion:

- Emulate it with `browser.newContext({ reducedMotion: "reduce" })` in Playwright, or in Chromium DevTools under Rendering, "Emulate CSS media feature prefers-reduced-motion".
- CSS animations stop; the framer-motion reveals and the progress bar still run (known gap). Motion your change adds must stop.

Sizes:

- The script covers 390px and 1440px. When a layout changes, also check 640px (the sidebar appears), 768px and 1024px (grids and calendar chips change), for example with `browser.newContext({ viewport: { width: 768, height: 1024 } })`.
- No horizontal scroll at 390px; long Spanish words and subject names wrap or truncate cleanly.

## 6. Screenshots for the pull request

```bash
node .claude/skills/ui-verification/scripts/smoke.mjs --paths "/,/cartelera" --screenshots test-results/ui
node .claude/skills/ui-verification/scripts/smoke.mjs --paths "/,/cartelera" --screenshots test-results/ui --theme dark
```

Files are named `<path>-<viewport>[-<theme>].png`, for example `home-mobile.png` or `carreras-apu-desktop-dark.png`, in `test-results/ui`, which git ignores. Open and look at every image before sharing it. For a visual change, capture before and after (run the script with `--base` against the staging or preview URL for the before state when Deployment Protection allows it), in light and dark, mobile and desktop, and attach them to the pull request or link the preview deployment.

## 7. Stop the server

- Started in the background from Claude Code: stop that background task.
- Otherwise find the process on the port and stop it:

```bash
lsof -nP -iTCP:3123 -sTCP:LISTEN    # prints the PID
kill <pid>
```

A forgotten server makes the next `pnpm start -p 3123` fail with `EADDRINUSE`, or worse, lets the script test an old build.

## 8. Report

In the pull request's "How to test", state the mode (production build or preview URL), the routes, themes and sizes checked, the smoke summary line (`N/M checks passed.`), the keyboard checks, and any gap you found but did not fix. Then load `verification-before-completion` before you say the work is done.
