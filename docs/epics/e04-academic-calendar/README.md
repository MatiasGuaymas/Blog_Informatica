# E04 Academic calendar

| Status | Priority | Area | Issue |
|---|---|---|---|
| Planned | High | calendar | [#32](https://github.com/MatiasGuaymas/Blog_Informatica/issues/32) |

## Goal

Keep the academic calendar trustworthy every year and let students take the dates with them.

## Problem

- The 73 events are hand-entered for 2026 in src/lib/calendario.ts and the year is hardcoded in headings, metadata, the official link, the links page and the electives URLs. Few events remain after December 2026 and there is no documented process to load 2027.
- Students cannot add the dates to their own calendar app.
- The official calendar has to be retyped every year.
- CalendarioView computes today with new Date() during render while /calendario is statically prerendered, so once the page is server-rendered (E06-F01) its HTML will carry the build date.

## Scope

**In scope**

- .ics feed and per-event download.
- Yearly update process with data checks.
- A spike on parsing the official calendar.
- Hydration-safe date handling.

**Out of scope**

- Filtering events by career (events have no career field today).
- Push or email notifications.
- Exam dates per subject.

## Success criteria

- 2027 events are live before the 2027 introductory course starts in February.
- The .ics feed passes an RFC 5545 validator and imports into at least two calendar apps.
- No hydration errors on /calendario.

## Features

| Key | Feature | Size | Priority | Issue |
|---|---|---|---|---|
| E04-F01 | Export academic calendar events to .ics | M | Medium | [#33](https://github.com/MatiasGuaymas/Blog_Informatica/issues/33) |
| E04-F02 | Define a repeatable yearly update process for calendar data | M | High | [#34](https://github.com/MatiasGuaymas/Blog_Informatica/issues/34) |
| E04-F03 | Investigate parsing the official calendar PDF | S | Low | [#35](https://github.com/MatiasGuaymas/Blog_Informatica/issues/35) |
| E04-F04 | Make the calendar's today-dependent UI hydration-safe (bug) | S | High | [#36](https://github.com/MatiasGuaymas/Blog_Informatica/issues/36) |

## Dependencies

- E01-F02 (per-year data module) supports E04-F01 and E04-F02.
- E04-F04 must ship together with E06-F01.

## Risks

- The faculty may publish next year's calendar late or change its format.
- All-day events are easy to shift by a day with time zones or an inclusive end date.
