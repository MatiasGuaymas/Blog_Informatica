---
name: changelog-management
description: Write CHANGELOG.md entries in English following Keep a Changelog, each ending with the pull request number and the author's GitHub handle. Use when a pull request needs its changelog entry or when reviewing one.
---

# Changelog management

`CHANGELOG.md` follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/). Its audience is developers. The product timeline for readers lives in `docs/overview.md`.

## Rules

1. Every pull request adds at least one entry under `## [Unreleased]`. CI enforces it ("Docs and changelog"). The `skip-changelog` label waives it only when the reviewer agrees (typo fixes, CI-only tweaks).
2. Write in English, one line per entry, from the user's or developer's point of view: describe the effect, not the implementation.
3. End every entry with the pull request number and the author handle: `#42 @fededobal`. Pairs list both: `#42 @MatiasGuaymas @fededobal`.
4. Add the entry after opening the pull request, since you need its number.
5. Use these categories, in this order, creating the heading when missing: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
6. Never edit released sections except to fix a typo.

## Examples

| Good | Why |
|---|---|
| `- Students can export the academic calendar to their calendar app as an .ics file. #42 @fededobal` | Effect for users, PR and author |
| `- The notice board shows a friendly message when the UNLP API does not answer within 5 seconds. #51 @MatiasGuaymas` | Observable behavior |

| Bad | Problem |
|---|---|
| `- Refactored CalendarioView.tsx` | Implementation detail, no PR or author |
| `- Agrega export .ics #42 @fededobal` | Not English |

## At release time

The `release` skill moves the `[Unreleased]` entries into `## [X.Y.Z] - YYYY-MM-DD` and updates the compare links at the bottom of the file. The Release workflow publishes that section as the GitHub Release notes.
