# ADR 0004: Vendor agent skills

- Status: Accepted
- Date: 2026-11-26
- Deciders: @MatiasGuaymas, @fededobal

## Context

Both developers use Claude Code, and skills shape what it does: how it plans,
debugs, reviews, designs and audits. Several useful skills are published by
others in public repositories. A skill is instructions plus, sometimes,
scripts that run on a developer's machine, so it deserves the same scrutiny as
a dependency. Both developers need the same set at the same version, and
changes to it must be visible in review.

## Decision

- Third-party skills are **vendored**: copied into `.claude/skills/<name>/`
  and committed with the repository. They are not installed per machine and
  not symlinked.
- They are installed and updated with a pinned version of the skills CLI in
  copy mode (`pnpm dlx skills@1.9.0`).
- [`skills-lock.json`](../../skills-lock.json) records the source, commit,
  path and content hash of each skill.
- Each folder keeps its upstream license files, and
  [THIRD-PARTY.md](../../.claude/skills/THIRD-PARTY.md) lists every skill
  with its source, commit, license and local changes.
- Every addition or update is reviewed before it is committed, like
  third-party code: scripts, network access and instructions. Local changes
  are re-applied after each update and listed in THIRD-PARTY.md.
- Large assets that the skills do not need by default stay out of the
  repository: the `assets/` folder of `design-taste-frontend` is gitignored.
- The project rules in `AGENTS.md` take precedence over instructions inside a
  vendored skill.

How to update or add a skill is in
[Working with Claude Code](../guides/working-with-claude.md#update-vendored-skills).

## Consequences

- Both developers get the same skills at the same commit, with no setup.
- Every change to a skill shows up as a diff in a pull request.
- The repository grows by the size of the vendored folders.
- Updates are manual pull requests, and local changes must be re-applied each
  time.
- Some vendored skills run helpers on the developer's machine, such as a local
  preview server, a launcher that downloads a checksum-verified binary and
  browser-based checks. Reviews must cover them.
- Three skills have no license file upstream; THIRD-PARTY.md records that.

## Alternatives considered

- **Per-developer installs**, at user level or as plugins. Versions drift
  between machines, and nobody reviews what changed.
- **Symlinks to a shared install.** They break on a fresh clone and on the
  other developer's machine, change silently with upstream, and do not show
  in diffs.
- **Git submodules.** They pin a commit, but local changes become awkward, the
  review happens outside the main diff, and every clone needs extra steps.
