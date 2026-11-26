# Epics

One brief per epic. Read the brief before picking up any of its features.

## How epics and features work

- An **epic** is a GitHub parent issue titled `Epic: <name>` and labeled `type: epic`, one `area:` and one `priority:` label. It states the goal, the problem, the scope, the success criteria and the risks and dependencies of a body of work.
- A **feature** is a GitHub sub-issue of its epic, labeled `type: feature` or `type: bug` plus one `area:`, one `priority:` and one `size:` label (and `good first issue` when it suits a first contribution). Its title is imperative and carries no key.
- Each feature issue holds the full spec in the house format (`feature-spec` skill): summary, user stories, Gherkin acceptance criteria, use cases when a flow has real alternatives, non-functional requirements, technical notes and a Definition of Done.
- **Specs live in issues while planned.** The issue body is the single source of truth until the work ships; edit the issue instead of keeping copies elsewhere.
- **Specs move to docs once built.** When a feature ships, its behavior is documented in `docs/features/<slug>/README.md` (system design in `docs/architecture/`, decisions as ADRs in `docs/decisions/`), and the issue links to that page.
- **Keys are stable** and go in bodies and docs, never in titles: epics `E01` to `E08`, features `E01-F01`, stories `US-E01F01-01`, use cases `UC-E01F01-01`, non-functional requirements `NFR-E01F01-01`.
- Each brief below lists its features with their issue links; GitHub shows the same list as the epic's sub-issues.

## Brief structure

Every brief in `docs/epics/<key>-<slug>/README.md` uses the same sections, in this order:

1. A table with the status, priority, area and issue link.
2. **Goal**: the outcome, in one or two sentences.
3. **Problem**: who has it and why it matters now, with facts from the code.
4. **Scope**: in scope and out of scope.
5. **Success criteria**: verifiable conditions to close the epic.
6. **Features**: key, title, size, priority and issue link of every feature.
7. **Dependencies** and **Risks**.
8. **Retrospective** (keep, change, try), added when the epic closes.

## Statuses

| Status | Meaning |
|---|---|
| Planned | Scoped and ready to schedule. |
| In progress | At least one feature has an open pull request. |
| Proposed | Under discussion; features stay unscheduled until the decision is accepted. |
| Done | Every feature is closed and the success criteria are met. |

## Index

| Epic | Goal | Status | Issue |
|---|---|---|---|
| [E01 Foundations and quality](e01-foundations-and-quality/README.md) | Make the codebase safe to change: smaller modules, automated tests, hardened responses and a resilient notice board fetch. | Planned | [#5](https://github.com/MatiasGuaymas/Blog_Informatica/issues/5) |
| [E02 Subject content](e02-subject-content/README.md) | Give every regular subject a stable page with notes in a consistent seven-section format. | In progress | [#17](https://github.com/MatiasGuaymas/Blog_Informatica/issues/17) |
| [E03 Prerequisites graph](e03-prerequisites-graph/README.md) | Make the prerequisites graph usable by touch, able to show whole chains, exportable and cheap to load. | Planned | [#27](https://github.com/MatiasGuaymas/Blog_Informatica/issues/27) |
| [E04 Academic calendar](e04-academic-calendar/README.md) | Keep the calendar trustworthy every year and let students take the dates to their own calendar. | Planned | [#32](https://github.com/MatiasGuaymas/Blog_Informatica/issues/32) |
| [E05 Design and UX polish](e05-design-and-ux-polish/README.md) | A documented, consistent and accessible interface with purposeful motion and a finished About page. | Planned | [#37](https://github.com/MatiasGuaymas/Blog_Informatica/issues/37) |
| [E06 Launch and SEO](e06-launch-and-seo/README.md) | Launch on a custom domain with server-rendered content, correct canonical URLs, Search Console and a performance budget. | Planned | [#44](https://github.com/MatiasGuaymas/Blog_Informatica/issues/44) |
| [E07 Automated maintenance](e07-automated-maintenance/README.md) | Catch broken links, notice board API failures and stale academic-year data automatically. | Planned | [#49](https://github.com/MatiasGuaymas/Blog_Informatica/issues/49) |
| [E08 Content editing](e08-content-editing/README.md) | Decide between content as code and an editable store with an admin panel, then build only what the decision justifies. | Proposed | [#53](https://github.com/MatiasGuaymas/Blog_Informatica/issues/53) |
