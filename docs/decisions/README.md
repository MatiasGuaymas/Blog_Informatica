# Decisions

Architecture decision records (ADRs) explain why the project works the way it
does. Each one captures a single decision, the context that forced it, its
consequences and the alternatives that lost. Read the relevant ADR before you
change something it covers. [ADR 0001](0001-record-architecture-decisions.md)
explains the practice.

## Index

| ADR | Title | Status | Date |
|---|---|---|---|
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted | 2026-11-26 |
| [0002](0002-branching-and-environments.md) | Branching and environments | Accepted | 2026-11-26 |
| [0003](0003-english-for-project-artifacts.md) | English for project artifacts | Accepted | 2026-11-26 |
| [0004](0004-vendor-agent-skills.md) | Vendor agent skills | Accepted | 2026-11-26 |
| [0005](0005-content-as-code.md) | Content as code | Accepted | 2026-11-26 |
| [0006](0006-quality-gates.md) | Quality gates | Accepted | 2026-11-26 |

## Write a new ADR

1. Take the next number: the highest in the index plus one.
2. Copy the template below into `NNNN-kebab-title.md`.
3. Open it in the pull request that implements the decision, with status
   Proposed, and add it to the index.
4. Set the status to Accepted before merging.

Write an ADR when a decision changes the structure of the code or the docs,
the workflow, a dependency with lasting impact, or anything that would be
costly to reverse. Smaller choices belong in the pull request description.

| Status | Meaning |
|---|---|
| Proposed | Under discussion in an open pull request |
| Accepted | In force |
| Superseded by NNNN | Replaced by a newer ADR, which links back |

Never rewrite an accepted ADR. Write a new one that supersedes it, and change
only the status line of the old one.

## Template

The template follows the MADR shape.

```markdown
# ADR NNNN: <Decision title in sentence case>

- Status: Proposed
- Date: YYYY-MM-DD
- Deciders: @<handle>, @<handle>

## Context

The problem, the forces at play and the facts that make a decision necessary.
Link the issue or epic that raised it.

## Decision

What we decided, in the present tense, specific enough to check in a review.

## Consequences

What becomes easier and what becomes harder, including the costs we accept.

## Alternatives considered

- **<Alternative>.** Why we did not choose it.
```
