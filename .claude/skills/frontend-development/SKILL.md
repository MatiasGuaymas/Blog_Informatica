---
name: frontend-development
description: Project conventions for writing, reviewing or refactoring anything in src/ (routes and layouts, Server and Client Components, content modules in src/lib, Tailwind v4 tokens, Base UI primitives, framer-motion, metadata, strict types, file size, naming and Spanish UI copy). Use before you add, change, review or refactor any file under src/.
---

# Frontend development

One Next.js 16 App Router app: React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui primitives on Base UI, framer-motion, `@xyflow/react`, `sanitize-html` and zod, built with pnpm and deployed on Vercel. Content is typed TypeScript in `src/lib/`; the only runtime data source is the UNLP notice board API. `docs/architecture/` explains why the code is shaped this way; this skill is the working checklist.

## 1. Read the bundled Next.js docs first

The installed Next.js (16.4) ships its docs as Markdown in `node_modules/next/dist/docs/`. They are the source of truth, not memory: read the page for every Next.js API you touch before you write code, and search the folder for anything not listed here.

| Topic | File under `node_modules/next/dist/docs/01-app/` |
|---|---|
| Server and Client Components | `01-getting-started/05-server-and-client-components.md`, `02-guides/server-and-client-boundary.md` |
| Caching, `revalidate`, `fetch` | `02-guides/caching-without-cache-components.md` (this app does not enable `cacheComponents`), `03-api-reference/04-functions/fetch.md` |
| ISR | `02-guides/incremental-static-regeneration.md` |
| Metadata | `03-api-reference/04-functions/generate-metadata.md`, `03-api-reference/03-file-conventions/01-metadata/` |
| Query strings | `03-api-reference/04-functions/use-search-params.md` |
| Builds and the CLI | `02-guides/building.md`, `03-api-reference/06-cli/next.md` |

In this version `params` and `searchParams` are Promises: type them `Promise<...>` and `await` them, as `materia/[slug]/page.tsx` and `cartelera/page.tsx` do.

## 2. Where things live

```text
src/
  env.ts                    zod schema for KV_* and ADMIN_* (unused placeholders)
  app/
    layout.tsx              <html lang="es">, Poppins, metadata, viewport, JSON-LD, Toaster
    globals.css             Tailwind entry, tokens, dark theme, custom classes
    loading.tsx error.tsx global-error.tsx not-found.tsx
    sitemap.ts robots.ts manifest.ts opengraph-image.tsx icon.png apple-icon.png
    (public)/layout.tsx     shell: sidebar, header, main
    (public)/page.tsx       /  (revalidate = 300)
    (public)/carreras/      /carreras and /carreras/[carrera] (apu, atic, ls, li)
    (public)/materia/[slug] /materia/<slug>, 25 slugs
    (public)/cartelera/     /cartelera, dynamic because it reads searchParams
    (public)/calendario/ bibliografia/ links/ sobre-mi/
  components/
    ui/                     shadcn/ui primitives on Base UI
    motion/                 Reveal, StaggerList
    cartelera/ calendario/ correlativas/   feature components by domain
    icons/                  custom SVG icons
    Header.tsx DesktopSidebar.tsx MobileSidebarTrigger.tsx Breadcrumb.tsx ThemeToggle.tsx ...
  lib/
    carreras.ts calendario.ts cartelera.ts site.ts utils.ts
```

Import through the `@/` alias for `src/` (`@/lib/carreras`, `@/components/ui/dialog`).

## 3. Server and Client Components

Server Components are the default. Every `page.tsx` and layout is one, and so are `Header.tsx` and `CarteleraPagination.tsx`: they read content modules or call `fetchCartelera()` and pass plain data down. Add `"use client"` only for state, effects, browser APIs or animation, as low in the tree as possible.

| Client component | Why it is one |
|---|---|
| `ThemeToggle`, `DesktopSidebar` | `localStorage` |
| `Breadcrumb` | `usePathname()` |
| `CarteleraFilters` | `useSearchParams()` and `router.replace` |
| `AnuncioCard`, `AutoOpenAnuncioModal` | dialog state, `ResizeObserver` |
| `CalendarioView` | month, selected day and filter state |
| `CorrelativasGraphTrigger`, `CorrelativasGraph` | dialog state, `@xyflow/react` |
| `Reveal`, `StaggerList`, `LoadingScreen` | framer-motion |

Patterns to copy:

- A Server Component renders client islands: `Header` renders `Breadcrumb`, `ThemeToggle` and the mobile menu button.
- The server fetches and filters, the client interacts: `cartelera/page.tsx` passes `materias` to `CarteleraFilters` and one `mensaje` to each `AnuncioCard`. Props must be serializable (`Date` is fine, functions are not).
- Server-only code stays out of client files: `node:fs` (`sobre-mi/page.tsx`), `sanitize-html` and the API fetch in `src/lib/cartelera.ts`. Client components import only pure helpers from that module, such as `formatRelative`.
- What a client component imports ships to the browser: `Breadcrumb` imports `carreras` for its labels, so the plan data loads on every page. Pass the few values a client component needs as props.
- Heavy widgets load on demand: `CorrelativasGraph` mounts only when its dialog opens but is imported statically; use `next/dynamic` for new heavy client widgets.

Known bug, do not build on it: the root layout wraps every page in `<Suspense fallback={null}>` around `NavigationLoadingProvider`, which calls `useSearchParams()`, and `(public)/layout.tsx` wraps the shell in `ClientOnlyMobileSidebarProvider` (`next/dynamic` with `ssr: false`). Together they keep page content out of the server HTML. Do not add root-level `useSearchParams()` or more `ssr: false` wrappers, and keep new components server-renderable: read `localStorage`, `window` or `new Date()` in an effect, never during render. `ThemeToggle`, `CalendarioView` and `AnuncioCard` (relative dates) already break this and will need changes when the shell is fixed (see the `debugging` skill).

## 4. Content and data modules

| Module | Holds | Watch out for |
|---|---|---|
| `src/lib/carreras.ts` | `Carrera`, `PlanRow`, the four 2021 plans, `materiaSlugs` (25), `materiaDetails` (3), lookup helpers | Shared first and second year blocks; `cantidadAsignaturas` is typed by hand |
| `src/lib/calendario.ts` | `eventosCalendario` (2026), date helpers, category order, labels and classes | `YYYY-MM-DD` strings go through `parseLocalDate()`; `new Date("2026-03-09")` parses as UTC and shifts the day |
| `src/lib/cartelera.ts` | API types, `fetchCartelera()`, sanitizer, `parseFecha()`, `mensajeId()`, filters | No timeout, no try/catch, no zod; dates parsed in the server time zone |
| `src/lib/site.ts` | `SITE`, `absoluteUrl()`, `pageMetadata()` | `SITE.url` is resolved at build or server start |
| `src/lib/utils.ts` | `cn()` | Its other exports are unused |
| `src/env.ts` | Server env schema | Imported by `next.config.ts` only |

Rules:

- Content is code: change the module and ship it through a pull request. There is no CMS, database or admin panel. The `KV_*` and `ADMIN_*` variables are unused placeholders: do not read them or build on them without a decision record.
- No mock data in committed code. Empty states are real states ("Notas en preparación").
- Keep references consistent by hand: every code in `correlativas`, `materiaSlugs` and `materiaDetails` must exist as a plan `codigo`. Nothing checks it at runtime.
- Page-local content (bibliography repositories, link groups, the about page) lives as typed constants in its page; move it to `src/lib/` when a second file needs it.
- A new page also updates five hand-written lists: `DesktopSidebar.tsx`, `MobileSidebarTrigger.tsx`, `navItems` in the home page, `segmentLabels` in `Breadcrumb.tsx` and `STATIC_PATHS` in `sitemap.ts`.
- Validate external data with zod at the boundary, bound every request in time and handle failure. `fetchCartelera()` predates this rule; new fetches follow this shape:

```ts
import { z } from "zod";

const NoticeSchema = z.object({ titulo: z.string(), fecha: z.string() });
const ResponseSchema = z.object({ mensajes: z.array(NoticeSchema) });
type Notice = z.infer<typeof NoticeSchema>;

export async function fetchNotices(url: string): Promise<Notice[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return ResponseSchema.parse(await res.json()).mensajes;
  } catch (error) {
    console.error("Notice fetch failed", error);
    return [];
  }
}
```

## 5. Styling

Tailwind v4 is configured in CSS only. `src/app/globals.css` imports `tailwindcss` and `tw-animate-css`, declares tokens on `:root`, redefines them under `[data-theme="dark"]` and maps them to utilities in `@theme inline`. There is no `tailwind.config` file.

| Need | Utilities |
|---|---|
| Surfaces | `bg-background`, `bg-card`, `bg-muted`, `bg-sidebar` |
| Text | `text-foreground`, `text-muted-foreground`, `text-primary` |
| Lines and focus | `border-border`, `border-input`, `ring-ring` |
| Actions and brand | `bg-primary text-primary-foreground`, `bg-secondary`, `bg-accent`, `border-primary-weak` |
| Soft highlights, chips | `bg-pastel-blue`, `bg-pastel-mint`, `bg-pastel-rose`, `bg-pastel-amber`, often with `/40` or `/60` |
| Errors | `text-destructive`, `bg-destructive/10` |
| Radius | `rounded-lg` 10px (buttons, inputs), `rounded-xl` 14px (nav items, tiles), `rounded-2xl` 18px (cards), `rounded-full` (chips) |
| Type | `font-sans` is Poppins (`next/font`, weights 300 to 800); `font-mono` for codes and acronyms |

`--success` and `--warning` have no utilities; the `--shadow-*` and `--anim-*` variables feed custom classes.

- Dark mode: `ThemeToggle` stores `theme` in `localStorage` and sets `data-theme` on `<html>`; the OS preference is ignored. `dark:` is a custom variant bound to `[data-theme="dark"]`. Token utilities switch on their own; add `dark:` only for raw palette colors (`text-amber-700 dark:text-amber-200`).
- Reusable classes in `globals.css`: `.cartelera-body` and `.cartelera-body-preview` (sanitized notice HTML), `.scrollbar-thin`, `.scrollbar-hide`, `.glass`, `.card-interactive`, `.hover-lift`, `.press-scale`, `.btn-shine`, `.animate-fade-in-up` and its siblings, `.stagger-1` to `.stagger-6`, `.skeleton`, `.gallery-tile`, `.correlativas-graph`. Except `.gallery-tile` (in `@layer base`), they are unlayered, so they beat Tailwind utilities on the same element.
- Merge conditional classes with `cn()` from `@/lib/utils` (clsx plus tailwind-merge).
- Write complete class strings: Tailwind cannot see `bg-${color}`. Map values to full strings, as `CATEGORIA_STYLES` in `calendario.ts` does.

Primitives in `src/components/ui/` (shadcn/ui style `base-nova` on `@base-ui/react`):

- In use: `button` (variants `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`; sizes `xs`, `sm`, `default`, `lg`, `icon*`), `dialog`, `sheet` and `toast` (`Toaster` is mounted in the root layout, nothing calls `toast` yet). The others (`accordion`, `select`, `tabs`, `popover`...) exist but no route uses them.
- Import from the file (`@/components/ui/dialog`). Compose with Base UI's `render` prop, there is no `asChild`: `<SheetTrigger render={<button type="button" aria-label="Abrir menú" />}>`.
- `DialogContent` and `SheetContent` label their close button "Close" by default: pass `closeLabel="Cerrar"`. The notice and graph dialogs do; the mobile drawer does not yet.
- Add a primitive with `pnpm exec shadcn add <name>`, then translate its visible and ARIA text.
- Focus: `globals.css` removes the fallback outline for everything inside a `[data-slot]` primitive, so links and buttons you place in a dialog or sheet need their own `focus-visible:` ring.

## 6. Motion

- `Reveal` (`src/components/motion/Reveal.tsx`): fade plus 16px rise over 0.55 s, ease `[0.22, 1, 0.36, 1]`. Use `trigger="mount"` above the fold; the default `"view"` animates once when scrolled into view.
- `StaggerList`: renders a `ul` and wraps each child in an animated `li` (14px rise, `staggerMs` default 70). Pass the items directly, not your own `li`.
- `LoadingScreen` draws the 2px navigation progress bar. CSS tokens: `--anim-duration-fast` 100ms, `--anim-duration` 200ms, `--anim-duration-slow` 320ms, `--anim-duration-slower` 450ms, `--anim-ease-out`.
- Reduced motion, honestly: the CSS side respects `prefers-reduced-motion` (`.animate-*`, `.card-interactive`, `.hover-lift`, `.press-scale`, `.btn-shine`, `.gallery-tile`, smooth scrolling). The framer-motion code does not: `Reveal`, `StaggerList` and `LoadingScreen` animate for everyone, and nothing uses `MotionConfig` or `useReducedMotion`. Motion you add or touch must handle it, for example with `useReducedMotion()` to drop the offset.
- Animate `transform` and `opacity`. Load the `animate` skill for new motion and `animation-performance` for jank.

## 7. Metadata and SEO

- Every page except the home exports `metadata = pageMetadata({ title, description, path })` from `@/lib/site`. Pass the bare title ("Carreras"); the root `title.template` appends " · Blog Informática UNLP". `pageMetadata` sets the canonical URL and the `openGraph` and `twitter` fields, repeating `/opengraph-image` because a page-level `openGraph` replaces the root one. Never set `openGraph` by hand.
- Dynamic routes use `generateMetadata`, return `{}` for unknown params, and the page calls `notFound()` (`carreras/[carrera]/page.tsx`).
- Metadata routes in `src/app/`: `sitemap.ts` (`STATIC_PATHS`, careers, `getAllMateriaSlugs()`), `robots.ts`, `manifest.ts`, `opengraph-image.tsx` (`next/og`, Node.js runtime, prerendered), `icon.png`, `apple-icon.png`. Add every new static route to `STATIC_PATHS`.
- The root layout renders the JSON-LD graph from `SITE`. Titles and descriptions are Spanish.

## 8. TypeScript

- `strict` is on (TypeScript 6). No `any`: use `unknown` and narrow, or a zod schema. Biome only warns on `any`; the project rule is stricter.
- No non-null assertion without a comment that explains the invariant. `cartelera.ts` has one without (`map.get(row.nombre)!`); do not copy it.
- Type props with an interface next to the component and type every exported signature.
- Model content with unions and exhaustive maps (`TipoMateria`, `EventoCategoria`, `Record<EventoCategoria, string>`), so a new value fails the typecheck wherever it is not handled. Use `satisfies` to check literals without widening (`satisfies EdgeData` in `CorrelativasGraph.tsx`).

## 9. File size and splitting

- TypeScript files stay at or under 500 lines (`scripts/check-file-lines.mjs`, run by `pnpm check`, the pre-commit hook and CI).
- Known debt in `scripts/file-lines-allowlist.json` may not grow: `src/lib/carreras.ts` (954), `src/lib/calendario.ts` (922), `src/components/correlativas/CorrelativasGraph.tsx` (862), `src/components/calendario/CalendarioView.tsx` (757). The split is tracked in epic E01; the pull request that splits a file removes its entry.
- Split by domain, never by number: `carreras.ts` into the shared blocks, one module per career and the slug helpers; `CalendarioView.tsx` into the month grid, the ongoing block and the upcoming list. `Component2.tsx` is forbidden.
- Helpers may live in their page (`SectionHeader` in the home page) until a second file needs them; then move them to `src/components/<domain>/`.

## 10. Naming

- Identifiers, comments and docs are English. Existing Spanish comments are legacy; write new ones in English.
- The Spanish domain vocabulary in `docs/glossary.md` (`carrera`, `materia`, `correlativas`, `cartelera`, `anuncio`, `mensaje`, `calendario`, `evento`...) stays Spanish inside English names: `getCarreraBySlug`, `fetchCartelera`, `CorrelativasGraph`, `AnuncioCard`. Do not translate it (`Career`, `NoticeBoard`) and do not add Spanish words outside it (`aplicarFiltros` and `esHoy` are legacy). Identifiers drop accents and ñ (`anio`, `codigo`).
- Route folders are Spanish because they mirror UNLP terms. Components are `PascalCase.tsx` grouped by domain folder; primitives are lowercase files in `ui/`.

## 11. UI copy

- Everything students read is Spanish, including `aria-label`, `alt` and `title`: Argentine voseo ("Elegí", "Probá", "mirá", "buscás"), friendly and clear, no heavy slang, no em dashes. Use a comma, colon or period instead, and a middle dot between meta items ("3 años · 24 asignaturas").
- Headings in sentence case ("Calendario académico", "Últimos anuncios"); eyebrows and chips get their uppercase from CSS, not from the text.
- Official names exactly as the faculty writes them (subjects, careers, codes), and the glossary terms.
- Empty and error states suggest the next step: "Sin resultados" with "Probá ampliar el rango de fechas o sacar algunos filtros.".
- Dates in es-AR through the helpers: `formatRango` and `formatFechaLarga` in `calendario.ts`, `formatRelative` and `formatFechaCompleta` in `cartelera.ts`.
- Fix when you touch them: the graph node tooltip joins its parts with an em dash, and the toast and drawer close buttons say "Close".

## 12. Before you open the pull request

- [ ] `pnpm check` passes (Biome, `tsc`, branding guard, file size, hook tests).
- [ ] `pnpm build` passes. Give it a timeout of several minutes and network access: the home prerender calls the UNLP API. `ECANCELED` in an iCloud-synced clone means evicted `node_modules` files (`debugging` skill).
- [ ] Checked in a real browser with the `ui-verification` skill: mobile and desktop, light and dark, keyboard.
- [ ] Docs updated in the same pull request (`documentation` skill): the feature page and its "States and variants", `docs/glossary.md` for a new domain term, `DESIGN.md` when the visual system changed.
- [ ] CHANGELOG entry (`changelog-management` skill), and screenshots or the preview URL in the pull request.
- [ ] `/code-review` before asking for a human review; `/security-review` when the change touches external data or HTML.
