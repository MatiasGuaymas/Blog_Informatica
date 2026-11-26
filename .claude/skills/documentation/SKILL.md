---
name: documentation
description: Write and maintain the project documentation in docs/ (English, Diataxis structure, Mermaid diagrams, ADRs, code-to-docs map). Use when a change affects behavior, structure, workflow or a decision, or when asked to document something.
---

# Documentation

Documentation is part of the Definition of Done: the pull request that changes behavior updates its docs. CI fails when `src/` changes without docs (label `skip-docs` by reviewer agreement), and a Claude Code Stop hook reminds you before you finish.

## Structure (Diataxis)

| Path | Kind | Content |
|---|---|---|
| `docs/README.md` | Index | Map of the docs |
| `docs/AGENTS.md` | Rules | Read before editing docs |
| `docs/overview.md` | Explanation | Product, audience, environments, release timeline |
| `docs/glossary.md` | Reference | Spanish domain vocabulary and its English meaning |
| `docs/architecture/` | Explanation and reference | System context, routing, content and data, rendering and caching, deployment |
| `docs/features/<slug>/` | Reference | One page per feature: stories, acceptance criteria, how it works |
| `docs/guides/` | How-to | Getting started, git workflow, task workflow, writing feature specs, working with Claude, design workflow, release process |
| `docs/decisions/` | Decisions | ADRs, `NNNN-kebab-title.md` |
| `docs/epics/` | Planning | Epic briefs and index |
| `docs/sources/`, `docs/reports/` | Records | Raw inputs and generated reports such as audits |

## Code-to-docs map

| When you change | Update |
|---|---|
| A route in `src/app/(public)/` or its components | `docs/features/<feature>/README.md` |
| A module in `src/lib/` | `docs/architecture/content-and-data.md` and the feature page |
| A new route | `docs/architecture/routing-and-layouts.md`, a feature page, the sitemap |
| Caching, `revalidate` or external fetches | `docs/architecture/rendering-and-caching.md` |
| `next.config.ts`, environment variables, Vercel | `docs/architecture/deployment.md` and the README |
| `.github/`, `scripts/`, `lefthook.yml` | `docs/guides/git-workflow.md` or `docs/guides/release-process.md` |
| `.claude/` (hooks, skills, settings) | `docs/guides/working-with-claude.md` and the skills table in `AGENTS.md` |
| An architectural decision | A new ADR in `docs/decisions/` |
| A release with user-facing changes | The Timeline in `docs/overview.md` |

Feature pages: `home` (/), `careers` (/carreras), `subject-page` (/materia/[slug]), `prerequisites-graph`, `notice-board` (/cartelera), `academic-calendar` (/calendario), `bibliography` (/bibliografia), `links` (/links), `about` (/sobre-mi), `seo`.

## Writing rules

- US English, concise, present tense. No emojis, no em or en dashes.
- Describe what exists. Missing pieces go to "Known gaps" or to an issue.
- Link code with paths relative to the doc. Use tables for comparable data and concrete numbers.
- Quote Spanish UI text verbatim, with an English gloss the first time.
- Third-party branding never appears anywhere (enforced by the branding guard).

## Diagrams

- Use Mermaid fenced blocks: GitHub renders them and agents can edit them as text.
- Choose the type: `flowchart` (structure, pipelines), `sequenceDiagram` (request flows), `classDiagram` (types), `stateDiagram-v2` (UI states), `gitGraph` (branching).
- Draw C4-style views with `flowchart` subgraphs, not the experimental C4 syntax.
- One sentence before each diagram says what it shows. Short quoted labels, no HTML, about 15 nodes at most.
- Update a diagram in the same pull request as the change it describes.

## Architecture decision records

Use the MADR shape in `docs/decisions/NNNN-kebab-title.md`: Status (Proposed, Accepted, Superseded by NNNN), Context, Decision, Consequences, Alternatives considered. The next number is the highest plus one. Supersede an accepted ADR with a new one instead of rewriting it.
