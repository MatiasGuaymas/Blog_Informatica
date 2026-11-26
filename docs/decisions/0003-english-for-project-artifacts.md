# ADR 0003: English for project artifacts

- Status: Accepted
- Date: 2026-11-26
- Deciders: @MatiasGuaymas, @fededobal

## Context

The site serves Spanish-speaking students, so its content is Spanish. The
repository is different: code, comments, documentation, commit messages, pull
requests, issues, reviews and the changelog. When those mix languages, search
gets harder, the history reads inconsistently, and the instructions that
guide Claude Code compete with each other. The framework, libraries and tools
the project depends on all document themselves in English.

## Decision

- **English** (US) for everything written in the repository and on GitHub:
  code comments, identifiers, documentation, commits, pull requests, issues,
  reviews and the changelog.
- **Spanish** for the content students read: UI copy and subject notes, with
  Argentine voseo, a friendly tone, no heavy slang and no em dashes.
- **Domain vocabulary stays Spanish** where it mirrors UNLP terms and routes:
  established identifiers such as `carrera`, `materia`, `correlativa` and
  `cartelera` keep their names, and the [glossary](../glossary.md) explains
  them. New identifiers are English.
- Documentation quotes Spanish UI text verbatim, with an English gloss the
  first time it appears.
- The commit-msg hook and the "Conventional title" check reject commit
  messages and pull request titles that look Spanish.

## Consequences

- One language for everything a developer or an agent reads in the
  repository.
- Routes such as `/carreras` and `/cartelera` stay as students know them, so
  shared links keep working.
- Identifiers can mix both languages, such as `fetchCartelera`; the glossary
  keeps that readable.
- Many older comments in `src/` are still Spanish. Their translation is
  tracked in epic E01.
- The Spanish check is a word-list heuristic, so it can miss some cases;
  reviewers remain the backstop.

## Alternatives considered

- **Spanish everywhere.** It matches the audience, but it splits the project
  from the language of its tools, and commit types such as `feat` and `fix`
  are English anyway.
- **English everywhere, including routes and identifiers.** It would break
  the URLs students share and the direct mapping to UNLP terms.
- **No rule.** The history and the docs would keep mixing languages.
