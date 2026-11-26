# ADR 0001: Record architecture decisions

- Status: Accepted
- Date: 2026-11-26
- Deciders: @MatiasGuaymas, @fededobal

## Context

Two developers change this project, and both work with Claude Code. Decisions
about structure, process and tooling are easy to lose in chat threads and pull
request comments, and an agent only knows what is written in the repository.
Before changing how something works, a person or an agent needs to know why it
works that way and what was already ruled out.

## Decision

We record every significant decision as an architecture decision record (ADR)
in `docs/decisions/`, using the MADR shape:

- Sections: Status, Date and Deciders, then Context, Decision, Consequences
  and Alternatives considered.
- File names follow `NNNN-kebab-title.md`. The next number is the highest
  plus one.
- Status is Proposed while the pull request is open, Accepted once it merges,
  and Superseded by NNNN when a newer ADR replaces it.
- An accepted ADR is never rewritten. A new ADR supersedes it, and the old one
  changes only its status line.
- The ADR is part of the pull request that implements the decision and is
  listed in the [decisions index](README.md).
- A decision deserves an ADR when it changes the structure of the code or the
  docs, the workflow, a dependency with lasting impact, or anything costly to
  reverse.

## Consequences

- The reasons behind the project are versioned and reviewed with the code.
- Claude Code and new developers can read them instead of guessing.
- Superseded records keep the history of how decisions evolved.
- Writing an ADR adds a little work to the pull requests that need one, and
  the index must stay current.

## Alternatives considered

- **Pull request descriptions and issue comments only.** They are hard to find
  later, and agents do not read them unless pointed at them.
- **A wiki.** It lives outside the repository, is not reviewed with the code,
  and agents do not load it.
- **One running decision log file.** It grows without structure and cannot
  give each decision its own status.
