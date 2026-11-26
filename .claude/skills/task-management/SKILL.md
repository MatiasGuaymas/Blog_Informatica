---
name: task-management
description: Plan and track work as epics and features on GitHub (issues, sub-issues, labels, the Roadmap board). Use when creating or refining epics and features, picking up a task, or closing finished work.
---

# Task management

## Model

| Level | On GitHub | Contains | In the repository |
|---|---|---|---|
| Epic | Issue labeled `type: epic`, titled `Epic: <name>` | Goal, problem, scope, success criteria | `docs/epics/<key>-<slug>/README.md` |
| Feature | Sub-issue of its epic, `type: feature` or `type: bug` | User stories, Gherkin acceptance criteria, use cases, non-functional requirements, Definition of Done (`feature-spec` skill) | `docs/features/<slug>/README.md` once built |
| Task | A checklist item inside the feature, or a sub-issue of it when someone else takes it | - | - |

Keys: epics `E01`, `E02`...; features `E01-F01`. The key goes in the body and the docs, not in the title.

Labels (`.github/labels.json`, applied with `pnpm labels:sync`): `type:`, `area:`, `priority:`, `size:`, plus `good first issue`, `blocked`, `release`, `skip-changelog`, `skip-docs`.

## Create an epic

1. Draft the brief in `docs/epics/<key>-<slug>/README.md` (structure: `docs/epics/README.md`).
2. Create the issue:
   ```bash
   gh issue create --title "Epic: <name>" --label "type: epic" --label "area: <area>" \
     --label "priority: <level>" --body-file <file>
   ```

## Create a feature and link it to its epic

1. Write it with the `feature-spec` skill.
2. Create the issue:
   ```bash
   gh issue create --title "<imperative, specific title>" --label "type: feature" \
     --label "area: <area>" --label "priority: <level>" --label "size: <S|M|L>" --body-file <file>
   ```
3. Link it as a sub-issue. The GitHub CLI has no flag for this yet; the REST API takes the issue id, not its number:
   ```bash
   CHILD_ID=$(gh api repos/MatiasGuaymas/Blog_Informatica/issues/<feature> --jq .id)
   gh api -X POST repos/MatiasGuaymas/Blog_Informatica/issues/<epic>/sub_issues -F sub_issue_id="$CHILD_ID"
   ```
4. List an epic's features:
   ```bash
   gh api repos/MatiasGuaymas/Blog_Informatica/issues/<epic>/sub_issues --jq '.[] | "#\(.number) [\(.state)] \(.title)"'
   ```

## Definition of Ready

A feature can start when its stories meet INVEST, every story has Gherkin acceptance criteria, the size is S or M (split L features), dependencies are resolved, and UI work has design notes.

## Pick up work

1. Take a Ready feature with the highest priority; prefer finishing an epic over starting a new one.
2. Assign yourself, move it to In progress on the board, and branch from `dev` (`git-workflow` skill).
3. Open a draft pull request early with `Closes #<n>`.
4. Limit yourself to two features in progress at a time.

## Definition of Done

Acceptance criteria verified; lint, typecheck and build pass; tests added or updated where applicable; docs updated; CHANGELOG entry with the PR number and author; reviewed and approved by the other developer; merged into `dev`.

## Close

Merging the pull request into `dev` (the default branch) closes the feature. Close an epic when all its sub-issues are done and its success criteria are met; update its brief and the index in `docs/epics/README.md`.

## Board

The GitHub Project "Roadmap" has a Board view by Status (Backlog, Ready, In progress, In review, Done), a Table view grouped by parent epic, and a Roadmap view. Add an issue with:

```bash
gh project item-add <project-number> --owner MatiasGuaymas --url <issue-url>
```

## Working together

- A weekly 20-minute sync: review the board, choose the next features, unblock each other.
- Pair on large or unfamiliar features.
- At the end of each epic, a short retrospective (keep, change, try) recorded in the epic brief.
