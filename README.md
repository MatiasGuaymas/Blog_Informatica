# Blog Informática UNLP

[![CI](https://github.com/MatiasGuaymas/Blog_Informatica/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/MatiasGuaymas/Blog_Informatica/actions/workflows/ci.yml?query=branch%3Adev)
[![Security](https://github.com/MatiasGuaymas/Blog_Informatica/actions/workflows/security.yml/badge.svg?branch=dev)](https://github.com/MatiasGuaymas/Blog_Informatica/actions/workflows/security.yml?query=branch%3Adev)

A study companion for students of the Faculty of Informatics at Universidad
Nacional de La Plata (UNLP). It gathers in one place what students of the four
undergraduate careers (APU, ATIC, Licenciatura en Sistemas and Licenciatura en
Informática) otherwise collect from several official sites: the 2021 study
plans with their prerequisites, a page per subject, the live notice board, the
academic calendar, bibliography and the official faculty links. The site is
personal and unofficial, and its content is written in Spanish for its readers.

| Environment | URL | Deploys from |
|---|---|---|
| Production | <https://blog-informatica-mu.vercel.app> | `main` |
| Staging | The Vercel branch URL of `dev`, in the form `<project>-git-dev-<scope>.vercel.app` | `dev` |
| Preview | One deployment per pull request, linked from the pull request | The pull request branch |

More about environments in [Deployment](docs/architecture/deployment.md).

## Features

| Feature | Route | What students get |
|---|---|---|
| [Careers and study plans](docs/features/careers/README.md) | `/carreras`, `/carreras/[carrera]` | The 2021 study plans of the four careers by year and term, with electives linked to the official listing |
| [Subject pages](docs/features/subject-page/README.md) | `/materia/[slug]` | A page per subject with a friendly URL, its named prerequisites, its careers and editorial notes |
| [Prerequisites graph](docs/features/prerequisites-graph/README.md) | A dialog on `/carreras/[carrera]` | An interactive graph of each career's prerequisites, one column per term |
| [Live notice board](docs/features/notice-board/README.md) | `/cartelera` | The official UNLP notice board, refreshed every 5 minutes, with sanitized HTML, filters, pagination and a shareable link per notice |
| [Academic calendar](docs/features/academic-calendar/README.md) | `/calendario` | The academic calendar with a month view and lists of ongoing and upcoming events |
| [Bibliography](docs/features/bibliography/README.md) | `/bibliografia` | GitHub repositories with course books |
| [Links](docs/features/links/README.md) | `/links` | A directory of official faculty sites and course platforms |
| [About](docs/features/about/README.md) | `/sobre-mi` | The author's bio and a photo gallery |

The [home page](docs/features/home/README.md) works as a site map with a
preview of the latest notices. Every page shares a responsive shell with a
sidebar, breadcrumbs and dark mode, and the site ships an
[SEO baseline](docs/features/seo/README.md): metadata, structured data, a
sitemap and an Open Graph image.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) and React 19 |
| Language | TypeScript in strict mode |
| Styling and UI | Tailwind CSS v4, shadcn/ui components on Base UI, lucide-react icons |
| Motion and graph | framer-motion, `@xyflow/react` |
| Data safety | zod for environment validation, sanitize-html for notice bodies |
| Tooling | Biome (lint and format), lefthook (git hooks), pnpm 10, Node.js 22 |
| Hosting and CI | Vercel, GitHub Actions |

Exact versions live in [`package.json`](package.json).

## Quick start

You need Node.js 22 ([`.nvmrc`](.nvmrc)) and pnpm. Corepack, which ships with
Node.js, provides the pnpm version pinned in `package.json`.

```bash
git clone https://github.com/MatiasGuaymas/Blog_Informatica.git
cd Blog_Informatica
corepack enable   # once per machine
pnpm install      # also installs the git hooks
pnpm dev          # http://localhost:3000
```

Keep the clone outside folders that iCloud syncs (Desktop and Documents, when
iCloud Drive syncs them): when iCloud evicts files from `node_modules`,
`next build` fails with `ECANCELED`. The complete setup, including the browser
used for UI checks, is in [Getting started](docs/guides/getting-started.md).

## Scripts

| Command | Runs | Use it to |
|---|---|---|
| `pnpm dev` | `next dev` | Start the development server at <http://localhost:3000> |
| `pnpm build` | `next build` | Build for production, as Vercel and CI do |
| `pnpm start` | `next start` | Serve the production build locally |
| `pnpm lint` | `biome check` | Lint, check formatting and import order |
| `pnpm format` | `biome format --write` | Format the codebase |
| `pnpm typecheck` | `tsc --noEmit` | Type-check the project |
| `pnpm check` | `lint`, `typecheck`, `check:terms`, `check:lines` | Run every local check before a pull request |
| `pnpm check:terms` | `node scripts/check-forbidden-terms.mjs --all` | Scan tracked files for forbidden third-party branding |
| `pnpm check:lines` | `node scripts/check-file-lines.mjs --all` | Enforce the 500-line limit for TypeScript files |
| `pnpm labels:sync` | `node scripts/github/sync-labels.mjs` | Apply [`.github/labels.json`](.github/labels.json) to the GitHub repository (needs an authenticated `gh`) |
| `prepare` | `node scripts/install-git-hooks.mjs` | Runs on `pnpm install` and installs the git hooks; skipped in CI and on Vercel |

## Environment variables

Local development needs no variables.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No | Absolute site URL used for canonical links, Open Graph tags, the sitemap and robots. When unset, [`src/lib/site.ts`](src/lib/site.ts) falls back to `https://$VERCEL_URL` on Vercel and to a built-in default elsewhere. Set it to <https://blog-informatica-mu.vercel.app> for Production on Vercel. |

To override it locally, put it in `.env.local`, which git ignores.
[`src/env.ts`](src/env.ts) also declares optional `KV_*` and `ADMIN_*`
variables: they are unused placeholders for epic E08, so leave them unset. A
malformed value fails the build. Values per environment are in
[Deployment](docs/architecture/deployment.md#environment-variables-per-environment).

## Project structure

```text
.
├── src/
│   ├── app/           Routes (App Router), layouts and metadata routes
│   │   └── (public)/  Public pages that share the sidebar and header
│   ├── components/    UI components; primitives in components/ui/
│   └── lib/           Content modules, data fetching, site config, helpers
├── public/            Static images and icons
├── docs/              Documentation, starting at docs/README.md
├── scripts/           Repository checks and release helpers
├── .claude/           Claude Code settings, hooks and skills
├── .github/           Workflows, issue forms, labels, Dependabot, CODEOWNERS
├── AGENTS.md          Rules for AI agents and humans
├── CHANGELOG.md       One entry per pull request
└── lefthook.yml       Git hooks
```

## How we work

Work is planned on GitHub as epics and features, tracked as issues and
sub-issues on the Roadmap board. Every change starts from an issue, is built on
a branch from `dev`, and lands through a pull request with a Conventional
Commit title in English, a changelog entry, updated docs, green checks and one
approval from the other maintainer. `dev` is staging; a release promotes it to
`main`, which is production. Both maintainers work with Claude Code, using the
shared settings, hooks and skills in `.claude/`.

- [Contributing](CONTRIBUTING.md): the short version of the whole process
- [Task workflow](docs/guides/task-workflow.md): epics, features, the board
- [Git workflow](docs/guides/git-workflow.md): branches, commits, pull requests
- [Release process](docs/guides/release-process.md): from `dev` to production
- [Working with Claude Code](docs/guides/working-with-claude.md): settings, hooks and skills

## Documentation

- [Documentation index](docs/README.md), with a reading path for new developers
- [Overview](docs/overview.md): product, audience, environments and timeline
- [Architecture](docs/architecture/README.md): how the site is built and delivered
- [Decisions](docs/decisions/README.md): architecture decision records
- [Changelog](CHANGELOG.md): every change since v0.1.0
- [Security policy](SECURITY.md): how to report a vulnerability
- [AGENTS.md](AGENTS.md): rules for AI agents working in this repository

## Language

The site content is in Spanish, with Argentine voseo, for its readers.
Everything else in the repository and on GitHub is in English: code, comments,
documentation, commits, pull requests, issues, reviews and the changelog.
Spanish domain terms that mirror UNLP routes, such as `carrera`, `materia` and
`cartelera`, are explained in the [glossary](docs/glossary.md).
