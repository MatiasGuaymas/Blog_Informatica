# Docs rules

Read this before you add or change anything in `docs/`. It is written for AI
agents and applies to people too. The
[documentation skill](../.claude/skills/documentation/SKILL.md) holds the full
procedure, including the code-to-docs map.

## Writing

- US English, concise, present tense.
- No emojis. No em or en dashes: use "-" or rewrite the sentence.
- Describe what exists today. Missing or planned behavior goes to "Known
  gaps" or to an issue, never into the description as if it worked.
- Quote Spanish UI text verbatim, with an English gloss the first time:
  "Sin resultados" (no results).
- Spanish domain terms follow the [glossary](glossary.md). Add a term there
  when a page introduces it.
- Prefer tables for comparable data, and concrete numbers over words such as
  "fast" or "many".
- Link code and docs with paths relative to the current file, and make sure
  every link resolves.
- Third-party branding never appears. The branding guard checks every commit,
  and the Claude Code write hook blocks it.

## Structure

| Path | Kind | Put here |
|---|---|---|
| `README.md` | Index | The map of the docs; update it when you add a page |
| `AGENTS.md` | Rules | This file |
| `overview.md` | Explanation | Product, audience, environments, release timeline |
| `glossary.md` | Reference | Spanish domain vocabulary and its English meaning |
| `architecture/` | Explanation and reference | System context, routing, content and data, rendering and caching, deployment |
| `features/<slug>/README.md` | Reference | One page per feature, using the template below |
| `guides/` | How-to | Task-oriented guides for people |
| `decisions/` | Decisions | ADRs, `NNNN-kebab-title.md` |
| `epics/` | Planning | Epic briefs, `<key>-<slug>/README.md`, and the epic index |
| `sources/` | Records | Raw inputs that docs and content are based on |
| `reports/` | Records | Generated reports such as audits |

Feature slugs: `home`, `careers`, `subject-page`, `prerequisites-graph`,
`notice-board`, `academic-calendar`, `bibliography`, `links`, `about`, `seo`.
A new feature gets a new folder; a new top-level area also needs an entry in
[README.md](README.md) and in the documentation skill.

Guides explain a process for people and link to the skill that holds the
detailed checklist. Do not copy a skill's checklist into a guide: the skill is
the source of truth for agents.

## Feature page template

Every page in `features/` uses these sections, in this order:

| Section | Content |
|---|---|
| Title and summary table | `# <Feature name>`, a one-sentence summary as a quote, then a table with **Routes**, **Status** and **Key files** |
| Why it exists | The student problem the feature solves |
| User stories | A table of stories with IDs `US-<PREFIX>-NN` |
| Acceptance criteria | Gherkin scenarios grouped by story, two to four per story, at least one edge case |
| Use cases | Only for flows with meaningful alternatives; leave the section out otherwise |
| How it works | Data flow, key types and components, a diagram when it helps |
| States and variants | Loading, empty and error states, responsive behavior, dark mode |
| Non-functional notes | Performance, rendering, accessibility, SEO, security |
| Known gaps | What is missing or wrong today, linked to issues when they exist |

Story, use case and requirement IDs use the feature prefix: `HOME`, `CAR`,
`SUB`, `GRAPH`, `NB`, `CAL`, `BIB`, `LINK`, `ABOUT`, `SEO`. The rules for
stories and Gherkin are in the
[feature-spec skill](../.claude/skills/feature-spec/SKILL.md).

````markdown
# <Feature name>

> <One sentence: what the feature does for students.>

| | |
|---|---|
| **Routes** | `/<route>` |
| **Status** | Live since v<X.Y.Z> |
| **Key files** | [page.tsx](../../../src/app/(public)/<route>/page.tsx) |

## Why it exists

<The problem, in two or three short paragraphs.>

## User stories

| ID | As a | I want to | So that |
|---|---|---|---|
| US-<PREFIX>-01 | <persona> | <action> | <outcome> |

## Acceptance criteria

### US-<PREFIX>-01 - <short story title>

<A gherkin code block with a Feature and two to four Scenarios.>

## Use cases

<Only when the flow has meaningful alternatives.>

## How it works

<Files, data flow and types. One sentence, then a Mermaid diagram if it helps.>

## States and variants

<Loading, empty, error, responsive, dark mode.>

## Non-functional notes

- **Performance.** <...>
- **Accessibility.** <...>
- **SEO.** <...>

## Known gaps

- <What is missing today.>
````

## Mermaid

- Use fenced `mermaid` blocks: GitHub renders them and agents can edit them as
  text.
- Pick the type that fits: `flowchart` for structure and pipelines,
  `sequenceDiagram` for request flows, `classDiagram` for types,
  `stateDiagram-v2` for UI or workflow states, `gitGraph` for branching.
- Draw C4-style views with `flowchart` subgraphs, not the experimental C4
  syntax.
- Put exactly one sentence before each diagram that says what it shows.
- Keep labels short and quoted (`A["Notice board"]`), with no HTML, and stay
  around 15 nodes at most. Split a larger picture into two diagrams.
- Avoid init directives, custom themes and click handlers, so the diagram
  renders the same on GitHub and in editors.
- Update a diagram in the same pull request as the change it describes.

## Decision records

- Use the MADR shape from the [decisions index](decisions/README.md): Status,
  Date, Deciders, Context, Decision, Consequences, Alternatives considered.
- Name the file `NNNN-kebab-title.md`. The next number is the highest plus
  one.
- Status is Proposed while the pull request is open, Accepted once merged,
  and Superseded by NNNN when a newer ADR replaces it.
- Never rewrite an accepted ADR. Write a new one that supersedes it and change
  only the status line of the old one.
- Add every ADR to the index table in [decisions/README.md](decisions/README.md)
  in the same pull request.

## Code-to-docs map

The map of which code change updates which page lives in the
[documentation skill](../.claude/skills/documentation/SKILL.md#code-to-docs-map),
so there is a single copy. Two checks rely on it:

- The Claude Code Stop hook reminds you before you finish when files in
  `src/` changed and nothing in `docs/` or the root `README.md` did.
- The "Docs and changelog" check in CI fails a pull request that changes
  `src/` without touching `docs/` or the root `README.md`, unless a reviewer
  adds the `skip-docs` label.

## Before you finish

- Every relative link and anchor resolves.
- Every diagram renders in the GitHub preview or an editor preview.
- Known gaps reflect the change.
- Index pages are current: [README.md](README.md), the decisions index and the
  epic index.
- `pnpm check:terms` passes.
