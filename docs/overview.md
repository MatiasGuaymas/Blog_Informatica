# Blog Informática UNLP

Blog Informática UNLP is a study companion for students of the Faculty of
Informatics at Universidad Nacional de La Plata (UNLP), Argentina. It puts in
one place what students otherwise collect from the official notice board,
faculty web pages and course channels: the 2021 study plans with their
prerequisites, a live feed of official announcements, the academic calendar,
bibliography repositories, a directory of official links and personal notes
per subject.

- **Production:** <https://blog-informatica-mu.vercel.app>
- **Run it locally:** [README](../README.md)
- **How it is built:** [Architecture](architecture/README.md)
- **What changed:** [CHANGELOG](../CHANGELOG.md)

## Audience

The site serves students and prospective students of the four undergraduate
careers of the faculty. Figures come from
[`src/lib/carreras.ts`](../src/lib/carreras.ts).

| Career | Short name | Duration | Subjects |
| --- | --- | --- | --- |
| Analista Programador Universitario | APU | 3 years | 24 |
| Analista en Tecnologías de la Información y la Comunicación | ATIC | 3 years | 24 |
| Licenciatura en Sistemas | LS | 5 years | 37 |
| Licenciatura en Informática | LI | 5 years | 37 |

## Identity

| Field | Value |
| --- | --- |
| Name | Blog Informática UNLP |
| Short name | Blog Informática |
| Site language | Spanish (`es-AR`, voseo), informal and friendly tone |
| Repository language | English for code, documentation, commits and pull requests |
| Author | Matías Guaymas |
| Status | Personal and unofficial |

The home page states the unofficial status in a notice: "El material
compartido es de carácter personal y no representa contenidos oficiales ni
resoluciones aprobadas por ninguna cátedra." (The shared material is personal
and does not represent official content or resolutions approved by any
course.)

## Editing model

- **Readers** see everything without an account. The site has no login.
- **Content is code.** Study plans, subject slugs, editorial notes, calendar
  events and site settings are typed TypeScript modules in
  [`src/lib`](../src/lib/). Page-specific content (bibliography repositories,
  the link directory, the about page) lives as typed constants inside the page
  file. See [Content and data](architecture/content-and-data.md).
- **Changing content** means editing the module and opening a pull request.
  The change goes live with the next deployment, see
  [Deployment](architecture/deployment.md).
- **No CMS, database or admin panel.** [`src/env.ts`](../src/env.ts) declares
  `KV_*` and `ADMIN_*` variables, but no code reads them: they are unused
  placeholders.
- **The only live data** is the official UNLP notice board, which the server
  fetches and caches for 5 minutes.

## Stack

Exact versions live in [`package.json`](../package.json).

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16, App Router | File-based routes, Server Components, static generation and ISR in one project |
| UI library | React 19 | Server Components render content on the server; client components only where needed |
| Language | TypeScript, strict mode | Content modules are typed, so `pnpm typecheck` rejects malformed content |
| Bundler | Turbopack, the Next.js default | Fast dev server and builds with no extra configuration |
| Styling | Tailwind CSS v4 | Utility classes, with theme tokens as CSS variables in [`globals.css`](../src/app/globals.css) |
| UI primitives | shadcn/ui components on Base UI | Accessible dialog, sheet and toast primitives kept as source in [`src/components/ui`](../src/components/ui/) |
| Icons | lucide-react | One consistent icon set |
| Animation | framer-motion | Reveal-on-scroll sections, staggered lists and the navigation progress bar |
| Graph | @xyflow/react | Interactive prerequisites graph with custom nodes and edges |
| HTML sanitizing | sanitize-html | Notice bodies arrive as HTML from an external API |
| Environment validation | @t3-oss/env-nextjs with zod | Declares server variables and validates them at build time |
| Lint and format | Biome | One tool for linting, formatting and import sorting |
| Package manager | pnpm 10 | Pinned through the `packageManager` field |
| Hosting | Vercel | Git-based deployments, a preview per pull request, CDN, ISR and image optimization |

## Environments

| Environment | Git branch | URL | Deploys when |
| --- | --- | --- | --- |
| Production | `main` | <https://blog-informatica-mu.vercel.app> | A release pull request from `dev` merges into `main` |
| Staging | `dev` | The stable branch URL, `<project>-git-dev-<scope>.vercel.app` | A pull request is squash-merged into `dev` |
| Preview | Pull request branch | One deployment per pull request | Every push to the pull request |

Details in [Deployment](architecture/deployment.md).

## Route map

Every page lives in the `(public)` route group and shares the sidebar and
header shell. The route tree, layouts and metadata routes are in
[Routing and layouts](architecture/routing-and-layouts.md); rendering modes
are explained in
[Rendering and caching](architecture/rendering-and-caching.md#rendering-strategy-per-route).

| Route | What it shows | Rendering |
| --- | --- | --- |
| `/` | Hero, unofficial notice, career cards, "Últimos anuncios" (Latest notices) and a grid of all sections | ISR, every 5 minutes |
| `/carreras` | Career selector | Static |
| `/carreras/[carrera]` | Study plan by year and term, with the prerequisites graph | Static, 4 paths |
| `/materia/[slug]` | Subject page: code, name, prerequisites, careers and notes | Static, 25 paths |
| `/cartelera` | Live notice board with filters, pagination and deep links | Dynamic, per request |
| `/calendario` | Academic calendar with month view, ongoing and upcoming events | Static |
| `/bibliografia` | GitHub repositories with course books | Static |
| `/links` | Directory of official faculty sites and platforms | Static |
| `/sobre-mi` | About the author | Static |

The site also serves `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`,
`/opengraph-image`, `/icon.png` and `/apple-icon.png`.

## Timeline

User-facing capabilities by month, newest first. From version 0.1.0 on, the
[CHANGELOG](../CHANGELOG.md) records every change.

### 2026-11-26 - Version 0.1.0

First versioned release, published as the baseline of the site running in
production.

### 2026-05 - Home as a site map

The home page gets a clean hero, four compact career cards (short name, full
name, duration and number of subjects), a live "Últimos anuncios" list that
deep-links into the notice board, and a grid with the six public sections, so
the home works as a site map.

### 2026-05 - Deep links to notices

Any notice can be shared as `/cartelera?a=<id>`. The page opens that notice in
a modal on load and removes the parameter when the modal closes. The id
combines the notice date and a slug of its title, because the official API
exposes no ids.

### 2026-05 - Interactive prerequisites graph

Each of the four careers gets a visual prerequisites graph built with
@xyflow/react: one column per term, a custom layout that reduces edge
crossings, edges that skip columns routed above or below the cards, and hover
highlighting. The "Ver grafo de correlativas" (View prerequisites graph) link
on each career page opens it.

### 2026-04 - Friendly subject URLs

Subjects get readable URLs such as `/materia/epa` instead of institutional
codes. 25 subjects have a slug.

### 2026-04 - Live official notice board

The notice board shows the announcements of the official UNLP notice board,
refreshed every 5 minutes. Notice bodies are sanitized and each notice is
mapped to the careers whose plan includes its subject. Readers filter by text,
subject, career, date range, attachments and canceled notices, page through
12 notices at a time, and open a modal with the full body and attachments.

### 2026-04 - SEO baseline

Every page has its own title, description, canonical URL and social preview
image. The site publishes a sitemap, robots rules, a web app manifest, a
generated Open Graph image and structured data that describes the site, its
author and the faculty.

### 2026-03 - Four careers

The site covers the four careers of the faculty under the name Blog
Informática UNLP, with the `/carreras` and `/materia` routes and a blue and
pastel palette.

### 2026-03 - Site shell

A collapsible desktop sidebar, a mobile drawer that closes with a swipe, a
header with breadcrumbs, a light and dark theme toggle, fade-up animations and
the Poppins typeface.

### 2026-02 - Project start

Work on Blog Informática UNLP begins as a Next.js App Router site for the
students of the faculty.

## Documented features

- [Home](features/home/) - landing page that doubles as a site map
- [Careers](features/careers/) - career selector and the 2021 study plans
- [Subject page](features/subject-page/) - per-subject page and the slug system
- [Prerequisites graph](features/prerequisites-graph/) - interactive graph per career
- [Notice board](features/notice-board/) - live official announcements with filters and deep links
- [Academic calendar](features/academic-calendar/) - month view, ongoing and upcoming events
- [Bibliography](features/bibliography/) - GitHub repositories with course books
- [Links](features/links/) - directory of official sites and platforms
- [About](features/about/) - author bio and photo gallery
- [SEO](features/seo/) - metadata, structured data, sitemap, robots, manifest and Open Graph image
