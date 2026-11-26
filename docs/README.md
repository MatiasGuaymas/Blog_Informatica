# Documentation

Everything about Blog Informática UNLP beyond the code: what the product is,
how it is built, how each feature behaves, how the team works and why. The
docs are written in English and change in the same pull request as the code
they describe. Before editing them, read [AGENTS.md](AGENTS.md).

## Areas

| Area | Kind | What you find |
|---|---|---|
| [overview.md](overview.md) | Explanation | The product, its audience, the environments and the release timeline |
| [glossary.md](glossary.md) | Reference | Spanish domain vocabulary (`carrera`, `materia`, `cartelera`...) and its English meaning |
| [architecture/](architecture/README.md) | Explanation and reference | System context, routing and layouts, content and data, rendering and caching, deployment |
| [features/](features/) | Reference | One page per feature: user stories, acceptance criteria, how it works, known gaps |
| [guides/](#guides) | How-to | Step-by-step guides for setup, the workflow, specs, Claude Code, design and releases |
| [decisions/](decisions/README.md) | Decisions | Architecture decision records (ADRs) and their template |
| [epics/](epics/README.md) | Planning | Epic briefs and the epic index |
| [sources/](sources/README.md) | Records | Raw inputs that docs and content are based on |
| [reports/](reports/README.md) | Records | Generated reports, such as audits |
| [AGENTS.md](AGENTS.md) | Rules | How to write and structure docs, for agents and people |

## Start here

A reading path for a new developer, in order:

1. [Root README](../README.md): what the site is and how to run it.
2. [Overview](overview.md): who the site serves and how it is deployed.
3. [Getting started](guides/getting-started.md): set up your machine and run
   the checks.
4. [Task workflow](guides/task-workflow.md) and
   [Git workflow](guides/git-workflow.md): how an issue becomes a merged pull
   request.
5. [Architecture](architecture/README.md): the shape of the system.
6. [Glossary](glossary.md) and one feature page, for example the
   [notice board](features/notice-board/README.md): the domain and the depth
   of a feature page.
7. [Working with Claude Code](guides/working-with-claude.md): the settings,
   hooks and skills both maintainers use.
8. [Decisions](decisions/README.md): why things are the way they are.

## Find the right page

| I want to... | Read |
|---|---|
| Run the site locally | [Getting started](guides/getting-started.md) |
| Pick up work or plan an epic | [Task workflow](guides/task-workflow.md) |
| Branch, commit, open or merge a pull request | [Git workflow](guides/git-workflow.md) |
| Write user stories and acceptance criteria | [Writing feature specs](guides/writing-feature-specs.md) |
| Use Claude Code in this repository | [Working with Claude Code](guides/working-with-claude.md) |
| Design or polish a page | [Design workflow](guides/design-workflow.md) |
| Ship a release or a hotfix | [Release process](guides/release-process.md) |
| Change content such as plans or calendar events | [Content and data](architecture/content-and-data.md) |
| Record a decision | [Decisions](decisions/README.md) |
| Report a vulnerability | [Security policy](../SECURITY.md) |

## Guides

| Guide | Covers | Detailed skill |
|---|---|---|
| [Getting started](guides/getting-started.md) | Prerequisites, install, git hooks, first run, troubleshooting | - |
| [Git workflow](guides/git-workflow.md) | Branches, environments, commits, pull requests, checks, reviews, hotfixes | [git-workflow](../.claude/skills/git-workflow/SKILL.md) |
| [Task workflow](guides/task-workflow.md) | Epics, features, labels, the Roadmap board, Ready and Done | [task-management](../.claude/skills/task-management/SKILL.md) |
| [Writing feature specs](guides/writing-feature-specs.md) | User stories, Gherkin, use cases, requirements, traceability | [feature-spec](../.claude/skills/feature-spec/SKILL.md) |
| [Working with Claude Code](guides/working-with-claude.md) | Settings, the trust dialog, hooks, skills, recommended flows | [documentation](../.claude/skills/documentation/SKILL.md) for keeping it current |
| [Design workflow](guides/design-workflow.md) | Design, motion and accessibility skills, `PRODUCT.md` and `DESIGN.md` | [impeccable](../.claude/skills/impeccable/SKILL.md), [design-taste-frontend](../.claude/skills/design-taste-frontend/SKILL.md) |
| [Release process](guides/release-process.md) | Versioning, release steps, automation, rollback | [release](../.claude/skills/release/SKILL.md) |

## Features

| Feature | Route |
|---|---|
| [Home](features/home/README.md) | `/` |
| [Careers](features/careers/README.md) | `/carreras`, `/carreras/[carrera]` |
| [Subject page](features/subject-page/README.md) | `/materia/[slug]` |
| [Prerequisites graph](features/prerequisites-graph/README.md) | A dialog on `/carreras/[carrera]` |
| [Notice board](features/notice-board/README.md) | `/cartelera` |
| [Academic calendar](features/academic-calendar/README.md) | `/calendario` |
| [Bibliography](features/bibliography/README.md) | `/bibliografia` |
| [Links](features/links/README.md) | `/links` |
| [About](features/about/README.md) | `/sobre-mi` |
| [SEO](features/seo/README.md) | Metadata routes and the `<head>` of every page |
