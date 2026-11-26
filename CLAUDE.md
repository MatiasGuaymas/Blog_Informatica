@AGENTS.md

# Claude Code notes

- **Skills** live in `.claude/skills/` and load on demand; type `/` to list
  them. `release` runs only when invoked as `/release`.
- **Hooks** in `.claude/hooks/`, configured in `.claude/settings.json`:
  - block commands that break the workflow: any npm, yarn or npx command,
    `--no-verify`, committing or pushing to `main` or `dev`;
  - ask before destructive commands such as `git reset --hard`, `rm -rf` or
    force-pushing;
  - block writing `.env` files, the lockfile, generated folders and
    third-party branding;
  - format every edited file with Biome;
  - remind you to update docs when `src/` changed.

  Their rules are tested in CI and by `pnpm test:hooks`.
- **Personal settings** go in `.claude/settings.local.json` and personal notes
  in `CLAUDE.local.md`; both are gitignored.
- **First session on a new machine:** accept the workspace trust dialog (hooks
  stay off until you do), run `pnpm install` (installs the git hooks) and
  `pnpm exec playwright install chromium` (browser checks).
- More context: `docs/guides/working-with-claude.md`.
