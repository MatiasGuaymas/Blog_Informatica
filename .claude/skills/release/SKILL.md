---
name: release
description: Cut a release that promotes dev to production (main) with a version bump, changelog section, git tag and GitHub Release. Run only when a developer explicitly asks for a release.
disable-model-invocation: true
---

# Release

Production (`main`) changes only through releases. A release ships everything merged into `dev` since the last tag.

## Versioning

Semantic Versioning, `0.x` while the product is pre-1.0:

| Bump | When |
|---|---|
| Minor (`0.X.0`) | New user-facing capabilities |
| Patch (`0.0.X`) | Fixes, documentation or internal changes only |
| `1.0.0` | Agreed by both developers (for example, the custom domain launch) |

## Steps

1. **Check readiness.** `dev` is green (`gh run list --branch dev --limit 5`), staging works (smoke-test the `dev` branch URL with the `ui-verification` skill), and no blocker is open for this release.
2. **Prepare on a branch from `dev`.**
   ```bash
   git switch dev && git pull && git switch -c release/vX.Y.Z
   ```
   - Set `version` in `package.json` to `X.Y.Z` (edit the field; nothing to install).
   - In `CHANGELOG.md`, move the `[Unreleased]` entries under a new `## [X.Y.Z] - YYYY-MM-DD` heading, keep an empty `## [Unreleased]` above it, and update the links at the bottom:
     `[Unreleased]: https://github.com/MatiasGuaymas/Blog_Informatica/compare/vX.Y.Z...dev` and
     `[X.Y.Z]: https://github.com/MatiasGuaymas/Blog_Informatica/compare/vPREVIOUS...vX.Y.Z`.
   - Add the user-facing capabilities of this release to the Timeline in `docs/overview.md`.
   - Commit: `chore(release): vX.Y.Z`.
3. **Merge the preparation into `dev`.**
   ```bash
   gh pr create --base dev --title "chore(release): vX.Y.Z" --label release --body-file <notes>
   ```
   The `release` label skips the changelog check. Squash-merge after approval.
4. **Promote `dev` to `main`.**
   ```bash
   gh pr create --base main --head dev --title "release: vX.Y.Z" --label release --body-file <notes>
   gh pr merge <n> --merge          # merge commit, after approval
   ```
   The body is the changelog section of the version.
5. **Verify.** The Release workflow creates tag `vX.Y.Z` and the GitHub Release (`gh release view vX.Y.Z`). The Vercel production deployment of `main` succeeds. Smoke-test production.
6. **If production breaks,** use Vercel's instant rollback to the previous production deployment, then fix forward with a hotfix (`git-workflow` skill).
