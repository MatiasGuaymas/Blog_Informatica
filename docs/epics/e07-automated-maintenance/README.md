# E07 Automated maintenance

| Status | Priority | Area | Issue |
|---|---|---|---|
| Planned | Medium | infra | [#49](https://github.com/MatiasGuaymas/Blog_Informatica/issues/49) |

## Goal

Catch rot automatically: broken external links, a failing notice board API and academic-year data going stale, each reported as a GitHub issue that opens, updates and closes itself.

## Problem

- The site links to about 30 external pages (20 on /links, 2 bibliography repositories, and the official plan and electives pages in src/lib/carreras.ts) and nothing checks them.
- The notice board relies on a public API with no published contract; outages or schema changes are noticed only by visitors.
- Year-specific data (2026 calendar events, optativas-2026 URLs) has no reminder to update it.

## Scope

**In scope**

- Scheduled GitHub Actions workflows that open, update and close issues.

**Out of scope**

- Uptime monitoring of the site itself.
- Alerts outside GitHub (chat or email).
- Dependency updates and audits, already handled by .github/dependabot.yml and the Security workflow.

## Success criteria

- A broken link is reported within a week.
- A notice board API failure is reported within 6 hours.
- A staleness issue opens within a week of fewer than 3 calendar events starting in the next 45 days.

## Features

| Key | Feature | Size | Priority | Issue |
|---|---|---|---|---|
| E07-F01 | Schedule a broken-link check for the links and bibliography pages | M | Medium | [#50](https://github.com/MatiasGuaymas/Blog_Informatica/issues/50) |
| E07-F02 | Schedule a health check of the notice board API | S | Medium | [#51](https://github.com/MatiasGuaymas/Blog_Informatica/issues/51) |
| E07-F03 | Schedule a staleness check for academic-year data | S | Medium | [#52](https://github.com/MatiasGuaymas/Blog_Informatica/issues/52) |

## Dependencies

- E01-F08 provides the schema and timeout reused by E07-F02.
- E04-F02 provides the checklist linked by E07-F03.

## Risks

- Slow faculty sites can produce false positives; retries and an unverified state reduce noise.
- GitHub disables scheduled workflows in public repositories after 60 days without activity.
