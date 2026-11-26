---
name: git-workflow
description: Branches, commits, pull requests, reviews and merges in this repository. Use before creating a branch, committing, opening, reviewing or merging a pull request, or syncing a branch with dev.
---

# Git workflow

Two long-lived branches, both protected by GitHub rulesets:

| Branch | Role | Deploys to | Changes only through |
|---|---|---|---|
| `dev` | Integration, default branch | Staging: the Vercel branch URL of `dev` | Squash-merged pull requests: 1 approval, green checks, resolved threads |
| `main` | Production | <https://blog-informatica-mu.vercel.app> | Release pull requests from `dev` (merge commit), 1 approval |

Never commit on `dev` or `main`, never push to them, never merge into them locally. The Claude Code hooks and the rulesets block it.

## 1. Start from an issue

Every change has an issue (feature, bug or chore); see the `task-management` skill.

```bash
gh issue edit <n> --add-assignee @me
git switch dev && git pull
git switch -c <type>/<issue>-<slug>      # e.g. feat/42-ics-export
```

Branch types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `perf`, plus `release` and `hotfix` for the release process. The slug is short kebab-case English.

## 2. Commit

- Conventional Commits in English: `<type>(<scope>): <imperative subject>`. Keep the header under 72 characters (hard limit 100).
- Scopes: `careers`, `subjects`, `graph`, `notice-board`, `calendar`, `bibliography`, `links`, `about`, `seo`, `design`, `infra`, `docs`, `deps`, `release`.
- The body explains why and summarizes what was asked. Wrap at 72 columns.
- Small, focused commits. Hooks run on every commit (Biome, file size, branding guard, message check) and on push (typecheck). Never use `--no-verify`: fix the cause and commit again.

## 3. Open the pull request early

```bash
git push -u origin HEAD
gh pr create --draft --base dev --title "<type>(<scope>): <subject>" --body-file <file>
```

- The title is a Conventional Commit: it becomes the squash commit on `dev`.
- Fill the template: Summary, `Closes #<issue>`, Changes, How to test, Screenshots or preview URL, Checklist.
- Once the number exists, add the CHANGELOG entry ending with `#<PR> @<your-handle>` (`changelog-management` skill).
- Copy the `type:` and `area:` labels from the issue.
- When checks are green: `gh pr ready <n>` and request the other developer: `gh pr edit <n> --add-reviewer <handle>`.

## 4. Checks

| Required check | What it does | Run locally |
|---|---|---|
| Lint, typecheck and repository checks | Biome, `tsc`, branding guard, file size, hook tests | `pnpm check` |
| Build | `next build` | `pnpm build` |
| Conventional title | Title format and English | `node scripts/check-commit-message.mjs --title "<title>"` |
| Docs and changelog | Changelog entry for this PR; docs when `src/` changes | see `documentation` skill |
| Dependency audit | High or critical advisories in production deps | `pnpm audit --prod --audit-level=high` |
| Secret scan | gitleaks over the history | - |

Vercel also comments a preview URL on every pull request. Labels `skip-docs` and `skip-changelog` waive their check only when the reviewer agrees.

## 5. Review

As the reviewer:

1. Read the issue and its acceptance criteria before the diff.
2. Run it: open the Vercel preview, or `gh pr checkout <n> && pnpm dev`.
3. Comment with an intent prefix: **blocking:**, **suggestion:**, **question:**, **nit:**. Use GitHub suggestions for small fixes.
4. Approve when the acceptance criteria are met and checks are green. Request changes only for blocking issues.

As the author: answer every comment, push fixes as new commits (no force-push during review), and resolve a thread only after addressing it. Before asking for a review, run `/code-review` in Claude Code; the `requesting-code-review` and `receiving-code-review` skills help on both sides.

## 6. Merge

```bash
gh pr merge <n> --squash --delete-branch     # or --auto to merge when checks pass
```

The author merges after approval. `--admin` bypasses the rules: emergencies only, with the reason written in the pull request.

## 7. Keep the branch up to date

```bash
git fetch origin && git rebase origin/dev
git push --force-with-lease                  # your own branch only
```

GitHub's "Update branch" button works too. In CHANGELOG conflicts keep both entries.

## 8. Hotfixes

An urgent production bug: branch `hotfix/<issue>-<slug>` from `main`. In the same branch, bump the patch version in `package.json` and add its `CHANGELOG.md` section (the Release workflow tags any new version that reaches `main`). Open the pull request into `main` and merge it with a merge commit. Then open a pull request from `main` into `dev` so the fix is not lost, and put `Closes #<issue>` there: issues close only when a change reaches the default branch.

## Deployments

| Event | Result |
|---|---|
| Pull request opened or updated | Vercel preview deployment |
| Merge into `dev` | Staging updates |
| Release pull request merged into `main` | Production deployment, tag and GitHub Release |
