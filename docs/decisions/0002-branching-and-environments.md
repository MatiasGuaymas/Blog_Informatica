# ADR 0002: Branching and environments

- Status: Accepted
- Date: 2026-11-26
- Deciders: @MatiasGuaymas, @fededobal

## Context

Two developers merge work into the same site, which Vercel deploys from git.
Students use production, so it must stay stable, while merged work needs a
place to be checked before it ships. Both developers want a readable history
in which every change maps to an issue, a pull request and a changelog entry,
and they want the rules enforced by tools instead of memory.

## Decision

- **`dev` is the integration branch**, the default branch of the repository,
  and the staging environment, served at its Vercel branch URL
  (`<project>-git-dev-<scope>.vercel.app`).
- **`main` is production**, served at <https://blog-informatica-mu.vercel.app>.
  It changes only through release pull requests from `dev` and hotfix pull
  requests.
- **Feature branches** start from `dev`, are named `<type>/<issue>-<slug>`
  and are **squash-merged into `dev`**. Each pull request becomes one commit
  whose message is the pull request title, a Conventional Commit that CI
  checks.
- **Releases are merge commits into `main`**, so `main` receives the commits
  of `dev` unchanged. The Release workflow tags the version on `main`.
- **Hotfixes** branch from `main`, merge into `main`, and return to `dev`
  through a second pull request.
- **Rulesets** protect both branches. `dev`: pull requests only, squash merges
  only, one approval, required checks and resolved conversations. `main`:
  pull requests only, merge commits, one approval and required checks. The
  admin bypass works only through pull requests, never through direct pushes.
- **Local guards** back the rulesets: the Claude Code hooks deny commits on
  `dev` and `main`, pushes to them, and merges into them unless the merge is
  fast-forward only (`--ff-only`).
- **Every pull request gets a Vercel preview.**

The workflow guide is [Git workflow](../guides/git-workflow.md), and the
procedure Claude follows is the
[git-workflow skill](../../.claude/skills/git-workflow/SKILL.md).

## Consequences

- Staging always shows what the next release contains.
- `dev` has one commit per pull request, which keeps the history readable and
  makes reverts simple.
- `main` contains every commit of `dev` plus one merge commit per release, so
  promotions merge cleanly.
- A hotfix needs two pull requests, one into `main` and one back into `dev`.
- Every change waits for the other developer's approval; CODEOWNERS requests
  the review automatically.
- The Vercel project runs on the Hobby plan, which deploys commits from both
  developers only because the repository is public. Making it private would
  block those deployments, so the Bash hook asks before any visibility change.

## Alternatives considered

- **Trunk-based development on `main` only.** Simple, but there is no staging:
  every merge reaches students immediately.
- **A full branching model with long-lived release branches.** It adds
  ceremony that two developers do not need.
- **Squash merges into `main`.** Each release would create commits that `dev`
  does not have, so the branches would diverge and every release would need a
  back-merge.
- **Rebase or merge commits into `dev`.** They keep work-in-progress commits
  in the shared history, and the pull request title would not be the commit
  message.
