# Contributing

Blog Informática UNLP is maintained by @MatiasGuaymas and @fededobal. This
page is the short version of how we work. Each section links to the guide or
the Claude Code skill that holds the details.

- **Found a bug on the site?** Open an issue with the **Bug** form.
- **Found a security problem?** Do not open an issue. Follow
  [SECURITY.md](SECURITY.md).

## Set up

1. Install Node.js 22 ([`.nvmrc`](.nvmrc)) and run `corepack enable` once to
   get the pinned pnpm.
2. Clone the repository outside folders that iCloud syncs.
3. Run `pnpm install`. It also installs the git hooks.
4. Run `pnpm exec playwright install chromium` once, for browser checks.
5. Start the site with `pnpm dev` and open <http://localhost:3000>.

Details and troubleshooting: [Getting started](docs/guides/getting-started.md).

## From issue to merge

1. **Pick an issue.** Take the highest-priority Ready item on the Roadmap
   board, assign yourself and move it to In progress.
   ([Task workflow](docs/guides/task-workflow.md))
2. **Branch from `dev`.**
   `git switch dev && git pull && git switch -c feat/<issue>-<slug>`
3. **Write the spec first when the issue needs one.** User stories and
   Gherkin acceptance criteria live in the issue.
   ([Writing feature specs](docs/guides/writing-feature-specs.md))
4. **Build in small commits** with Conventional Commit messages in English.
5. **Open a draft pull request early** into `dev`, with `Closes #<issue>` in
   the body.
6. **Add the changelog entry** as soon as the pull request has a number.
7. **Check your work.** Run `pnpm check` and `pnpm build`, verify UI changes
   in a real browser, and update the docs in the same pull request.
8. **Ask for a review** when the checks are green: mark the pull request as
   ready. CODEOWNERS makes GitHub request the other maintainer.
9. **Squash-merge** after one approval, green checks and resolved threads.
   The issue closes and the change reaches staging.

Releases promote `dev` to production on request:
[Release process](docs/guides/release-process.md). The full branching model is
in the [Git workflow](docs/guides/git-workflow.md) guide.

## Conventions

### Branches

Name branches `<type>/<issue>-<slug>`, with a short kebab-case English slug,
for example `feat/42-ics-export` or `fix/57-notice-dates`.

| Type | For |
|---|---|
| `feat` | A new capability |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `chore` | Maintenance and tooling |
| `refactor` | Code changes that keep behavior |
| `test` | Tests only |
| `ci` | Workflows and repository checks |
| `perf` | Performance improvements |
| `hotfix` | An urgent production fix, branched from `main` |

Every branch except `hotfix` starts from `dev`. Release preparation uses
`release/vX.Y.Z` branches, created by the release process.

### Commits

- Use Conventional Commits in English: `<type>(<scope>): <imperative subject>`,
  for example `feat(calendar): add an .ics export`.
- Types accepted by the commit-msg hook: `feat`, `fix`, `docs`, `style`,
  `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `release`.
- Scopes: `careers`, `subjects`, `graph`, `notice-board`, `calendar`,
  `bibliography`, `links`, `about`, `seo`, `design`, `infra`, `docs`, `deps`,
  `release`.
- Keep the header under 72 characters; the hook rejects headers over 100.
- The body explains why, wrapped at 72 columns.
- The hook rejects headers that look Spanish. Never skip it with
  `--no-verify`: fix the message and commit again.

### Pull requests

- Target `dev`. The title is a Conventional Commit and becomes the squash
  commit, so CI checks it like a commit message.
- Fill in the [pull request template](.github/pull_request_template.md):
  Summary, `Closes #<issue>`, Changes, How to test, Screenshots or preview,
  the Checklist and Notes for reviewers.
- Copy the `type:` and `area:` labels from the issue.
- For UI changes, add before and after screenshots or the Vercel preview URL.

### Changelog entries

Every pull request adds at least one entry under `## [Unreleased]` in
[CHANGELOG.md](CHANGELOG.md). CI fails without it.

- One line in English that describes the effect for users or developers, not
  the implementation.
- End it with the pull request number and the author's handle:
  `#42 @fededobal`. Pairs list both handles: `#42 @MatiasGuaymas @fededobal`.
- Use these categories, in this order: Added, Changed, Deprecated, Removed,
  Fixed, Security.
- Never edit released sections, except to fix a typo.
- The `skip-changelog` label waives the entry only when the reviewer agrees,
  for example for a typo fix.

```markdown
- Students can export the academic calendar to their calendar app as an .ics file. #42 @fededobal
```

The [changelog-management skill](.claude/skills/changelog-management/SKILL.md)
has more examples.

### Code

- **pnpm only.** Never npm, yarn or npx; use `pnpm dlx` for one-off tools.
- **Strict TypeScript.** No `any` (use `unknown` and narrow), no non-null
  assertions without a comment that explains the invariant, typed public
  signatures, and zod validation for external data.
- **Files under 500 lines.** Split TypeScript files by domain, never by
  number (`Component2.tsx` is not allowed). The known oversized files in
  [`scripts/file-lines-allowlist.json`](scripts/file-lines-allowlist.json) may
  not grow.
- **No mock data in committed code.** Mocks belong in tests.
- **Next.js 16 changed a lot.** Check the docs bundled in
  `node_modules/next/dist/docs/` before relying on older knowledge.

## Reviews

As the reviewer:

1. Read the issue and its acceptance criteria before the diff.
2. Run the change: open the Vercel preview, or
   `gh pr checkout <n> && pnpm dev`.
3. Prefix each comment with its intent: **blocking:**, **suggestion:**,
   **question:** or **nit:**. Use GitHub suggestions for small fixes.
4. Approve when the acceptance criteria are met and the checks are green.
   Request changes only for blocking issues.

As the author:

- Run `/code-review` in Claude Code before asking for a human review.
- Answer every comment and push fixes as new commits. Do not force-push
  during a review.
- Resolve a thread only after addressing it.
- Merge your own pull request after approval:
  `gh pr merge <n> --squash --delete-branch`, or `--auto` to merge when the
  checks pass.

An admin merge bypasses the review and the checks. Use it only in an
emergency, and write the reason in the pull request.

## Definition of Done

- [ ] The acceptance criteria are verified, in a real browser for UI changes.
- [ ] `pnpm check` and `pnpm build` pass.
- [ ] Tests are added or updated where applicable.
- [ ] Docs are updated in the same pull request.
- [ ] `CHANGELOG.md` has an entry ending with `#<PR> @<author>`.
- [ ] The other maintainer reviewed and approved it.
- [ ] It is merged into `dev`.

The repository has no unit test runner yet. The automated tests cover the
Claude Code hook rules: `node --test ".claude/hooks/tests/*.test.mjs"`.

## Language

- **English** (US) for everything written in the repository and on GitHub:
  code, comments, identifiers, docs, commits, pull requests, issues, reviews
  and the changelog.
- **Spanish** for the content students read, that is UI copy and subject
  notes: Argentine voseo, friendly, no heavy slang, no em dashes.
- **Domain vocabulary.** Established Spanish identifiers that mirror UNLP
  terms and routes (`carrera`, `materia`, `correlativa`, `cartelera`...) stay
  as they are; see the [glossary](docs/glossary.md). New identifiers are in
  English.

## Branding

No third-party company, product or template branding may appear anywhere in
the repository: code, docs, assets, metadata, commit messages or pull
requests. The branding guard enforces it in the pre-commit hook, in CI and in
the Claude Code write hook; run it with `pnpm check:terms`. Do not copy files
from other projects: write them from scratch.

## Working with Claude Code

Both maintainers use Claude Code. `CLAUDE.md` loads [AGENTS.md](AGENTS.md) at
the start of every session, the hooks in `.claude/` block commands that break
this workflow, and the skills in `.claude/skills/` carry the detailed
procedures. Changes written with Claude follow the same process and get the
same human review. On a new machine, accept the workspace trust dialog so the
hooks run.

Read [Working with Claude Code](docs/guides/working-with-claude.md) for the
settings, every hook, the skills catalog and the recommended flows.
