# E08 Content editing

| Status | Priority | Area | Issue |
|---|---|---|---|
| Proposed | Low | content | [#53](https://github.com/MatiasGuaymas/Blog_Informatica/issues/53) |

## Goal

Decide how editorial content is edited in the long run, as code reviewed in pull requests or in an editable store with an admin panel, and implement only what that decision justifies.

## Problem

- All content lives in TypeScript: plans, slugs and notes in src/lib/carreras.ts, 73 events in src/lib/calendario.ts, and the links and bibliography lists inside their page components.
- Placeholders for an editable store and admin auth exist (KV_* and ADMIN_* in src/env.ts, an Admin nav group pointing to a nonexistent /admin route) with no decision behind them.
- Content has TypeScript types but no runtime validation.

## Scope

**In scope**

- A decision record backed by a spike.
- A validated content model that serves either option.
- The follow-up implementation, conditional on the decision.

**Out of scope**

- Accounts or logins for readers.
- Comments or community submissions on the site.

## Success criteria

- Both maintainers accept the decision record.
- All editorial content is validated in CI.
- The conditional follow-up is implemented or explicitly closed.

## Features

| Key | Feature | Size | Priority | Issue |
|---|---|---|---|---|
| E08-F01 | Decide between content as code and an editable store with an admin panel | M | Medium | [#54](https://github.com/MatiasGuaymas/Blog_Informatica/issues/54) |
| E08-F02 | Define a validated content model for editorial data | M | Medium | [#55](https://github.com/MatiasGuaymas/Blog_Informatica/issues/55) |
| E08-F03 | Implement the content editing approach chosen in the decision record | L | Low | [#56](https://github.com/MatiasGuaymas/Blog_Informatica/issues/56) |

This epic is Proposed: its features stay unscheduled until E08-F01 is accepted, except E08-F02, which helps either outcome.

## Dependencies

- E08-F01 unblocks E01-F10 and E08-F03.
- E08-F02 can start independently of the decision.

## Risks

- An admin panel adds an attack surface (authentication, CSRF, secrets) and running cost.
- Content as code requires Git skills from every editor.
