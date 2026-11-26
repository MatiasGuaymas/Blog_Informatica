# Third-party skills

These skills were written by others and are vendored (copied) into this
repository so that every developer gets the same set. Each folder keeps its
upstream license. Provenance, exact commits and content hashes are recorded in
[`skills-lock.json`](../../skills-lock.json). All of them were reviewed before
being committed (scripts, network access, instructions).

| Skill | Source | Commit | License | Local changes |
|---|---|---|---|---|
| `security-audit` | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) | `c1c8a8c` | MIT | None |
| `animate` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `64eb3de` | MIT | None |
| `animation-performance` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `64eb3de` | MIT | None |
| `emil-design-eng` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `64eb3de` | MIT | None |
| `find-animation-opportunities` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `64eb3de` | MIT | None |
| `improve-animations` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `64eb3de` | MIT | None |
| `review-animations` | [emilkowalski/skills](https://github.com/emilkowalski/skills) | `64eb3de` | MIT | None |
| `design-taste-frontend` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | `d1a2bb4` | MIT | Frontmatter Stop hook removed (it could block the agent from finishing), `scripts/` removed (browser gate, remote icon and photo fetchers), `assets/` (37 MB) not vendored and gitignored, paths rewritten to `.claude/skills/`. A note in SKILL.md says so. |
| `brainstorming` | [obra/superpowers](https://github.com/obra/superpowers) | `22f0b46` | MIT | Plans saved to `docs/plans/` instead of `docs/superpowers/`. Its optional visual companion embeds a tracking image unless `SUPERPOWERS_DISABLE_TELEMETRY=1`, which `.claude/settings.json` sets for everyone. |
| `receiving-code-review` | [obra/superpowers](https://github.com/obra/superpowers) | `22f0b46` | MIT | References to skills that are not vendored point to project skills. |
| `requesting-code-review` | [obra/superpowers](https://github.com/obra/superpowers) | `22f0b46` | MIT | Base branch `origin/dev` instead of `origin/main`; plan paths under `docs/plans/`. |
| `systematic-debugging` | [obra/superpowers](https://github.com/obra/superpowers) | `22f0b46` | MIT | References to skills that are not vendored point to project skills. |
| `verification-before-completion` | [obra/superpowers](https://github.com/obra/superpowers) | `22f0b46` | MIT | References to skills that are not vendored point to project skills. |
| `writing-plans` | [obra/superpowers](https://github.com/obra/superpowers) | `22f0b46` | MIT | Plans saved to `docs/plans/`; hand-offs to skills that are not vendored point to the git-workflow skill. |
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `2fc5e14` | Apache-2.0 (`LICENSE`, `NOTICE.md`) | `scripts/` removed: it downloads and runs a closed-source engine binary, can install hooks and calls an image API. Engine commands (context, live, generate, hooks, doctor, screenshots) are unavailable; the Setup step and a note in SKILL.md say so. |
| `test-scenarios` | [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | `9af7bfd` | MIT | None |
| `user-stories` | [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | `9af7bfd` | MIT | None |
| `vercel-composition-patterns` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | `5a37a63` | MIT (declared in the skill frontmatter; no license file upstream) | None |
| `vercel-react-best-practices` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | `5a37a63` | MIT (declared in the skill frontmatter; no license file upstream) | None |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | `5a37a63` | None declared upstream; published for installation with the skills CLI | None |

## Security review

Before committing, every vendored skill was reviewed for executable code, network access, hook installation and instructions that conflict with this repository's process. Skills that execute downloaded code or install hooks on their own were reduced to their written guidance (see Local changes). `executing-plans` from the same collection was not vendored: it depends on skills that are not vendored and can merge into the base branch locally.

## Updating

```bash
DO_NOT_TRACK=1 pnpm dlx skills@1.9.0 update -p -y
```

After an update: re-apply the local changes listed above, review the diff
like any third-party code, run `pnpm check`, and open a pull request.

## Restoring the taste skill assets locally

```bash
DO_NOT_TRACK=1 pnpm dlx skills@1.9.0 add Leonxlnx/taste-skill -s design-taste-frontend -a claude-code --copy -y
```

The `assets/` folder is gitignored, so it stays on your machine.

## Project skills

Every other folder in `.claude/skills/` (for example `git-workflow`,
`feature-spec`, `task-management`) is written and maintained by this
project.
