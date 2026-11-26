# ADR 0005: Content as code

- Status: Accepted
- Date: 2026-11-26
- Deciders: @MatiasGuaymas, @fededobal

## Context

Most of the site is content: study plans, prerequisites, subject notes,
calendar events, bibliography and links. It changes a few times per term,
mostly at the start of each academic year, and the two developers are also
its editors. A wrong prerequisite or date misleads students, so every change
benefits from review. The site runs on the Vercel Hobby plan and has no
backend of its own.

## Decision

- Content lives in **typed TypeScript modules in `src/lib/`**, plus typed
  constants inside a page file for content used by one page only.
- Content changes **through pull requests**, like code: TypeScript checks the
  shape during `pnpm typecheck` and the build, the reviewer checks the facts,
  and the Vercel preview shows the result before the merge.
- There is **no database, CMS or admin panel**. The `KV_*` and `ADMIN_*`
  variables in `src/env.ts` are unused placeholders.
- **An editable store with an admin panel is deferred to epic E08.** If the
  team adopts it, a new ADR supersedes this one.
- The only runtime data is the official UNLP notice board, fetched on the
  server, sanitized and cached for 5 minutes.

How to edit content is in
[Content and data](../architecture/content-and-data.md).

## Consequences

- Hosting stays free and there is no backend to secure or back up.
- Every content change has a history, a review and a changelog entry.
- Only developers can edit content, and every change waits for a review and a
  deploy.
- Types check the shape but not the meaning: nothing verifies that every
  prerequisite points to an existing subject.
- Some content modules have outgrown the 500-line limit: `carreras.ts` and
  `calendario.ts` are allowlisted until epic E01 splits them.

## Alternatives considered

- **A hosted headless CMS.** It gives non-developers an editor, but adds a
  service, accounts, costs and content that changes outside review.
- **A database with an admin panel**, such as a key-value store behind a
  password-protected panel. It needs authentication, validation and backups;
  epic E08 revisits it.
- **Markdown or MDX files.** Friendlier for long prose, but weaker typing for
  structured data such as plans and prerequisites.
