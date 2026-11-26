# Reports

Generated reports, such as audits, kept as a dated record of what was checked
and what was found.

## What goes here

- UI and accessibility audits, for example the output of `/impeccable audit`
  or a `web-design-guidelines` review.
- Performance measurements of key pages: LCP, INP and CLS.
- Summaries of security reviews made with the `security-audit` skill, once
  their findings are fixed.

## Rules

- Name files `YYYY-MM-DD-<kind>-<scope>.md`, for example
  `2026-12-01-accessibility-notice-board.md`.
- Start with what was checked: the scope, the commit or release, the tool and
  the date.
- Link each finding that needs work to an issue.
- Never commit details of a vulnerability that is not fixed in production.
  Report it privately as described in [SECURITY.md](../../SECURITY.md), keep
  the raw output outside the repository, and add a summary here after the
  fix ships.
- A report describes a moment: do not update it later. Write a new one
  instead.
