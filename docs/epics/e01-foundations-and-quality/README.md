# E01 Foundations and quality

| Status | Priority | Area | Issue |
|---|---|---|---|
| Planned | High | infra | [#5](https://github.com/MatiasGuaymas/Blog_Informatica/issues/5) |

## Goal

Make the codebase safe to change for two developers: modules small enough to review, unit and smoke tests on every pull request, hardened HTTP responses and a notice board fetch that cannot break a build.

## Problem

- Four TypeScript modules exceed the 500-line rule and sit in `scripts/file-lines-allowlist.json`: `src/lib/carreras.ts` (954 lines), `src/lib/calendario.ts` (922), `CorrelativasGraph.tsx` (862) and `CalendarioView.tsx` (757).
- CI (`.github/workflows/ci.yml`) runs lint, typecheck, repository checks, hook tests and the build, but the application code has no tests: the notice board filters have no unit tests and no route is smoke-tested.
- `next.config.ts` sends no security headers or Content Security Policy, while the notice board injects third-party HTML.
- `fetchCartelera()` has no timeout and no try/catch, so a hung or failing API stalls or fails static generation of the home page.
- Roughly 360 comment lines in about 28 files are in Spanish, and `src/env.ts` declares KV and admin variables that nothing reads.

## Scope

**In scope**

- One split per oversized TypeScript module, keeping public import paths stable.
- Vitest unit tests and Playwright smoke tests in the existing CI workflow.
- Security headers and a CSP in `next.config.ts`.
- Timeout and graceful fallback for the notice board fetch.
- English comments in src/ (UI strings stay in Spanish) and removal of unused env and admin placeholders.

**Out of scope**

- Splitting `src/app/globals.css` (1117 lines): tracked in E05-F06 because it holds the design tokens.
- Renaming established Spanish domain identifiers; only comments change.
- Removing components that nothing imports (AnimatedBackground, BreadcrumbContext, Dropdown, ErrorModal, the skeletons folder and six ui primitives); candidates for a later cleanup.

## Success criteria

- `scripts/file-lines-allowlist.json` lists no file and `pnpm check` passes.
- Unit and smoke suites run in CI on every pull request into dev and main.
- Every HTML response carries the agreed security headers, with zero CSP violations on the main routes.
- A notice board API outage never fails or stalls a build.

## Features

| Key | Feature | Size | Priority | Issue |
|---|---|---|---|---|
| E01-F01 | Split src/lib/carreras.ts into domain modules | M | Medium | [#6](https://github.com/MatiasGuaymas/Blog_Informatica/issues/6) |
| E01-F02 | Split src/lib/calendario.ts into data, date helper and formatting modules | M | Medium | [#7](https://github.com/MatiasGuaymas/Blog_Informatica/issues/7) |
| E01-F03 | Split CorrelativasGraph.tsx into layout, routing and view modules | M | Medium | [#8](https://github.com/MatiasGuaymas/Blog_Informatica/issues/8) |
| E01-F04 | Split CalendarioView.tsx into section components | M | Medium | [#9](https://github.com/MatiasGuaymas/Blog_Informatica/issues/9) |
| E01-F05 | Add Vitest with unit tests for notice board filters and subject slugs | M | High | [#10](https://github.com/MatiasGuaymas/Blog_Informatica/issues/10) |
| E01-F06 | Add Playwright smoke tests for the main routes | M | High | [#11](https://github.com/MatiasGuaymas/Blog_Informatica/issues/11) |
| E01-F07 | Add security headers and a Content Security Policy | M | Medium | [#12](https://github.com/MatiasGuaymas/Blog_Informatica/issues/12) |
| E01-F08 | Add a timeout and graceful fallback to the notice board fetch (bug) | S | High | [#13](https://github.com/MatiasGuaymas/Blog_Informatica/issues/13) |
| E01-F09 | Translate source code comments in src/ to English | M | Low | [#14](https://github.com/MatiasGuaymas/Blog_Informatica/issues/14) |
| E01-F10 | Remove unused KV and admin placeholders | S | Low | [#15](https://github.com/MatiasGuaymas/Blog_Informatica/issues/15) |
| E01-F11 | Parse notice board dates in the Argentina time zone and read cancellation dates | S | High | [#16](https://github.com/MatiasGuaymas/Blog_Informatica/issues/16) |
| E01-F12 | Fix strict-typing, markup and copy issues found during the documentation review | S | Low | [#58](https://github.com/MatiasGuaymas/Blog_Informatica/issues/58) |

## Dependencies

- E01-F01 must follow the open seven-section pull request (E02-F01), which edits the same file.
- E01-F10 depends on the decision in E08-F01.

## Risks

- Splits and the comment translation touch the same files; sequence them per file to avoid conflicts.
- A strict CSP can break hydration or notice images; roll it out in Report-Only mode first.
