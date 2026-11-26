# ADR 0006: Quality gates

- Status: Accepted
- Date: 2026-11-26
- Deciders: @MatiasGuaymas, @fededobal

## Context

Two developers review each other's work, and much of that work is written
with Claude Code. Standards that depend on memory drift: formatting, file
size, commit messages in English, branding, docs and changelog entries. Late
feedback is expensive, and a reviewer should spend attention on behavior, not
on mechanics.

## Decision

The same rules run in three layers, from fastest to most authoritative:

1. **Git hooks** with lefthook, installed by `pnpm install`
   ([`lefthook.yml`](../../lefthook.yml)):
   - pre-commit: Biome with auto-fix on staged files (fixed files are
     re-staged), the 500-line limit and the branding guard;
   - commit-msg: Conventional Commits in English;
   - pre-push: `pnpm typecheck`.

   Skipping them with `--no-verify` is forbidden.
2. **Claude Code hooks** ([`.claude/settings.json`](../../.claude/settings.json)):
   they deny workflow-breaking commands (npm package commands, yarn and npx,
   `--no-verify`, commits, pushes and merges on `dev` and `main`), ask
   before destructive ones, block writing `.env` files, the lockfile,
   generated folders and branding, format every edited code file with Biome,
   and remind Claude to update the docs before it finishes. Their rules have
   unit tests.
3. **CI checks**, required by the rulesets on `dev` and `main`:
   - CI: lint, typecheck, branding guard, file size, the Claude Code hook
     tests, and the build;
   - PR checks: the Conventional title, and the docs and changelog gate;
   - Security: the dependency audit and the secret scan, plus a dependency
     review on pull requests.

The **docs and changelog gate** requires every pull request to add a
`CHANGELOG.md` entry under `[Unreleased]` that ends with `#<PR> @<author>`,
and requires a change under `docs/` or to the root `README.md` whenever
`src/` changes. A reviewer can waive each rule with the `skip-changelog` or
`skip-docs` label; release preparation uses the `release` label; promotions
from `dev` into `main` and pull requests opened by bots skip the gate.

Finally, one approval from the other developer is required, and on `dev`
every conversation must be resolved.

## Consequences

- Most problems surface locally within seconds, and CI catches anything that
  slips past a local hook.
- The layers overlap on purpose: a local hook can be missing, but CI cannot be
  skipped.
- Some gates are heuristics. The Spanish check uses a word list, and the docs
  rule accepts any change under `docs/`, so reviewers still judge the
  content.
- The hook tests keep the Claude Code guard rules from regressing.
- Waiver labels need the reviewer's agreement, which keeps exceptions
  visible.

## Alternatives considered

- **CI only.** Slower feedback and more red pull requests.
- **An off-the-shelf commit message linter.** It checks the format but not
  the language, which needed a custom script anyway.
- **Reviewer discipline alone.** Inconsistent, and it spends review time on
  mechanics.
