# E05 Design and UX polish

| Status | Priority | Area | Issue |
|---|---|---|---|
| Planned | Medium | design | [#37](https://github.com/MatiasGuaymas/Blog_Informatica/issues/37) |

## Goal

A consistent, accessible and calm interface: a written design context, audited screens, purposeful motion, WCAG 2.2 AA conformance and a finished About page.

## Problem

- There is no written design context; tokens live only in `src/app/globals.css` (52 custom properties in :root), a 1117-line file full of utilities that nothing references.
- The theme is applied after hydration and ignores prefers-color-scheme, so dark-mode users see a light flash; Reveal and StaggerList ignore prefers-reduced-motion and start content at opacity 0.
- Known accessibility issues: a role="button" notice card that contains links, a Link wrapping a Button on the 404 and error pages, and placeholder alt text ("Foto 1" and similar) in the About gallery.
- The About page hides two sections that were never written.

## Scope

**In scope**

- DESIGN.md as shared design context.
- Interface audit with the top fixes.
- Motion and micro-interaction review.
- WCAG 2.2 AA audit and fixes.
- About page copy.
- Split and cleanup of globals.css.

**Out of scope**

- A new visual identity or rebrand.
- New product features.
- Translating the UI out of Spanish.

## Success criteria

- DESIGN.md exists and design skills and contributors use it.
- Zero critical or serious axe violations on the main routes in both themes.
- prefers-reduced-motion and prefers-color-scheme are respected.
- The About page has no placeholders and no stylesheet partial exceeds 500 lines.

## Features

| Key | Feature | Size | Priority | Issue |
|---|---|---|---|---|
| E05-F01 | Establish the design context for design skills in DESIGN.md | S | High | [#38](https://github.com/MatiasGuaymas/Blog_Informatica/issues/38) |
| E05-F02 | Audit the interface and fix the top findings | L | Medium | [#39](https://github.com/MatiasGuaymas/Blog_Informatica/issues/39) |
| E05-F03 | Refine motion and micro-interactions | M | Medium | [#40](https://github.com/MatiasGuaymas/Blog_Informatica/issues/40) |
| E05-F04 | Audit and fix accessibility against WCAG 2.2 AA | L | High | [#41](https://github.com/MatiasGuaymas/Blog_Informatica/issues/41) |
| E05-F05 | Write the About page copy and replace its placeholders | S | Medium | [#42](https://github.com/MatiasGuaymas/Blog_Informatica/issues/42) |
| E05-F06 | Split globals.css into layered partials and drop unused utilities | M | Low | [#43](https://github.com/MatiasGuaymas/Blog_Informatica/issues/43) |

## Dependencies

- E05-F01 comes before E05-F02, E05-F03 and E05-F06.
- E05-F04 adds checks to the Playwright suite from E01-F06.

## Risks

- Design decisions can become subjective; DESIGN.md is the tie-breaker.
- The About copy depends on its author's availability.
