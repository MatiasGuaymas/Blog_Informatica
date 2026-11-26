# AGENTS

Rules for every AI agent (and human) working in this repository. They are
loaded at the start of each Claude Code session through `CLAUDE.md`. Detailed
procedures live in skills under `.claude/skills/`; this file tells you which
one to use.

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

## What this project is

A study companion for the four undergraduate programs of the Faculty of
Informatics at UNLP (APU, ATIC, Licenciatura en Sistemas, Licenciatura en
Informática): study plans, subject pages, an interactive prerequisites graph,
the live UNLP notice board, the academic calendar, bibliography and links.

- **Stack:** Next.js 16 (App Router, React Server Components), React 19,
  TypeScript strict, Tailwind CSS v4, shadcn/ui with Base UI, framer-motion,
  `@xyflow/react`, zod, Biome, pnpm. Deployed on Vercel.
- **Content is code:** study plans, subject notes, calendar events and links
  are typed TypeScript modules in `src/lib/` that change through pull
  requests. There is no database and no admin panel; the KV and admin
  variables in `src/env.ts` are unused placeholders (see epic E08).
- **External data:** the notice board is fetched from the official UNLP API
  on the server, sanitized with `sanitize-html` and cached with ISR.
- **Team:** two developers, @MatiasGuaymas and @fededobal, both using Claude Code.

## Mandatory rules

1. **Never commit without the user's confirmation**, unless they explicitly
   asked you to work autonomously. Never commit on `dev` or `main`.
2. **Never skip git hooks.** `--no-verify` is forbidden: fix what the hook
   reports, re-stage and commit again.
3. **`main` and `dev` change only through reviewed pull requests.** Never push
   to them and never merge into them locally (`git-workflow` skill).
4. **Every change starts from a GitHub issue** and ends in a pull request
   with `Closes #<n>` (`task-management` skill).
5. **pnpm only.** Never use npm, yarn or npx: use `pnpm <script>`, `pnpm add` and `pnpm dlx` for one-off tools. The Bash hook blocks them.
6. **Strict TypeScript:** no `any` (use `unknown` and narrow), no non-null
   assertions without a comment explaining the invariant, typed public
   signatures, zod validation for external data.
7. **TypeScript files stay under 500 lines.** Split by domain, never by number
   (`Component2.tsx` is forbidden). Known oversized files are listed in
   `scripts/file-lines-allowlist.json` and may not grow.
8. **No mock data in committed code.** Mocks belong in tests only.
9. **Docs change with the code** in the same pull request (`documentation` skill).
10. **Every pull request adds a CHANGELOG entry** ending with `#<PR> @<author>`
    (`changelog-management` skill).
11. **Verify in a real browser** before claiming a UI change works
    (`ui-verification` skill), and run `pnpm check` and `pnpm build`.
12. **Use timeouts** for commands that can block (builds, installs, servers).

## Language

- **English** for everything written in the repository and on GitHub: code
  comments, identifiers, documentation, commits, pull requests, issues,
  reviews and the changelog. The commit-msg hook and CI reject Spanish
  commit messages and pull request titles.
- **Spanish** for the site content students read (UI copy and subject notes):
  Argentine voseo, friendly, no heavy slang, no em dashes.
- **Domain vocabulary:** established Spanish identifiers that mirror UNLP
  terms and routes (`carrera`, `materia`, `correlativa`, `cartelera`...) stay
  as they are; see `docs/glossary.md`. New identifiers are English.

## Branding

No third-party company, product or template branding may appear anywhere in
the repository: code, docs, assets, metadata, commit messages or pull
requests. The branding guard (`scripts/check-forbidden-terms.mjs`, run by the
pre-commit hook, CI and the Claude Code write hook) enforces it. Do not copy
files from other projects; write them from scratch.

## Workflow at a glance

1. Pick an issue from the Roadmap board and assign yourself.
2. Branch from `dev`: `git switch dev && git pull && git switch -c feat/<issue>-<slug>`.
3. Spec first if needed (`feature-spec` skill), then build.
4. `pnpm check`, `pnpm build`, browser verification, docs updated.
5. Open a pull request into `dev` with a Conventional Commit title in English,
   add the CHANGELOG entry, get one approval and green checks, squash-merge.
6. Releases promote `dev` to `main` (`release` skill, run on request only).

`dev` deploys to staging (its Vercel branch URL) and `main` deploys to
production (<https://blog-informatica-mu.vercel.app>).

## Skills

Project skills load on demand from `.claude/skills/`; type `/` in Claude Code
to list them. Third-party skills are vendored with their licenses
(`.claude/skills/THIRD-PARTY.md`).

| Area | Skill | Use when |
|---|---|---|
| Planning | `task-management` | Creating epics and features, picking up or closing work |
| Planning | `feature-spec` | Writing user stories, Gherkin acceptance criteria, use cases |
| Planning | `user-stories`, `test-scenarios` | Story-writing and test-scenario techniques (vendored) |
| Planning | `brainstorming`, `writing-plans`, `executing-plans` | Shaping a non-trivial change before and while coding (vendored) |
| Process | `git-workflow` | Branches, commits, pull requests, reviews, merges |
| Process | `changelog-management` | Writing the CHANGELOG entry of a pull request |
| Process | `release` | Promoting `dev` to production (manual only: `/release`) |
| Process | `documentation` | Any change to behavior, structure or decisions |
| Code | `frontend-development` | Anything in `src/` |
| Code | `vercel-react-best-practices`, `vercel-composition-patterns` | React and Next.js performance and component APIs (vendored) |
| Quality | `ui-verification` | Checking a change in a real browser |
| Quality | `debugging`, `systematic-debugging` | Diagnosing errors (project playbooks, then method) |
| Quality | `verification-before-completion` | Before saying something is done (vendored) |
| Quality | `requesting-code-review`, `receiving-code-review` | Both sides of a review (vendored) |
| Security | `security-audit` | Security questions, focused reviews, full audits on request (vendored) |
| Design | `impeccable` | Auditing, critiquing and polishing existing UI (`/impeccable audit`, `polish`...) |
| Design | `design-taste-frontend` | Visual direction for new pages and redesigns |
| Design | `emil-design-eng`, `animate`, `improve-animations`, `review-animations`, `find-animation-opportunities`, `animation-performance` | Motion and micro-interactions (`review-animations` is manual only) |
| Design | `web-design-guidelines` | Accessibility and interface guideline reviews |

Design skills read `PRODUCT.md` and `DESIGN.md` at the repository root; keep
them current when the visual system changes. Built-in Claude Code commands:
`/code-review` before asking for a human review, `/security-review` for
changes that touch external data, HTML or dependencies.

## Quick reference

| Task | Command |
|---|---|
| Install (also installs git hooks) | `pnpm install` |
| Dev server | `pnpm dev` |
| All local checks | `pnpm check` (lint, typecheck, branding guard, file size, hook tests) |
| Build | `pnpm build` |
| Format | `pnpm format` |
| Hook tests | `pnpm test:hooks` |
| Browser for checks (once) | `pnpm exec playwright install chromium` |
| Sync labels | `pnpm labels:sync` |

## Where things are

| Path | What |
|---|---|
| `src/app/` | Routes (App Router), metadata routes, layouts |
| `src/components/` | UI components; primitives in `src/components/ui/` |
| `src/lib/` | Content modules, data fetching, site config, helpers |
| `docs/` | Documentation (start at `docs/README.md`) |
| `.claude/` | Claude Code settings, hooks and skills |
| `.github/` | Workflows, templates, labels, Dependabot, CODEOWNERS |
| `scripts/` | Repository checks and release helpers |
