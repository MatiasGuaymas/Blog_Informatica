# E02 Subject content

| Status | Priority | Area | Issue |
|---|---|---|---|
| In progress | High | content | [#17](https://github.com/MatiasGuaymas/Blog_Informatica/issues/17) |

## Goal

Give every regular subject of the four 2021 study plans a useful page: a consistent seven-section format, a stable URL and honest notes written by students who took it.

## Problem

- Only 3 of the 45 regular subjects have editorial notes (SI101, SI106, SI107); 22 more have a page that only shows "Notas en preparación" (notes in progress).
- 20 regular subjects have no slug, so their plan rows and graph nodes are not clickable: SI304, SO410, AT310, AT311, PPS-ATIC, OI309 and every subject of years 4 and 5.
- `MateriaDetail` only has resumen, recomendaciones and links today (the open pull request in E02-F01 extends it), and there is no written guide for authors.

## Scope

**In scope**

- The seven-section page schema (open pull request).
- An authoring guide.
- Slugs for the 20 regular subjects without one.
- Notes in six batches grouped by year and career.

**Out of scope**

- Pages for the 5 elective placeholders (OPT-*) and the 2 theses (OI503-LS, OI503-LI).
- An editing interface (E08).
- Subjects outside the 2021 plans.

## Success criteria

- All 45 regular subjects have a page (25 today plus 20 new slugs).
- No regular subject page shows "Notas en preparación" when the epic closes.
- Every batch reviewed by the other maintainer for tone and accuracy.

## Features

| Key | Feature | Size | Priority | Issue |
|---|---|---|---|---|
| E02-F01 | Render the seven-section subject page schema | M | High | [#18](https://github.com/MatiasGuaymas/Blog_Informatica/issues/18) |
| E02-F02 | Write the subject content authoring guide | S | High | [#19](https://github.com/MatiasGuaymas/Blog_Informatica/issues/19) |
| E02-F03 | Add slugs for the 20 subjects without a subject page | S | High | [#20](https://github.com/MatiasGuaymas/Blog_Informatica/issues/20) |
| E02-F04 | Write editorial notes for first-year subjects | L | High | [#21](https://github.com/MatiasGuaymas/Blog_Informatica/issues/21) |
| E02-F05 | Write editorial notes for second-year subjects | L | High | [#22](https://github.com/MatiasGuaymas/Blog_Informatica/issues/22) |
| E02-F06 | Write editorial notes for shared third-year subjects | L | Medium | [#23](https://github.com/MatiasGuaymas/Blog_Informatica/issues/23) |
| E02-F07 | Write editorial notes for third-year electives and career-specific subjects | M | Medium | [#24](https://github.com/MatiasGuaymas/Blog_Informatica/issues/24) |
| E02-F08 | Write editorial notes for Licenciatura en Sistemas years 4 and 5 | L | Low | [#25](https://github.com/MatiasGuaymas/Blog_Informatica/issues/25) |
| E02-F09 | Write editorial notes for Licenciatura en Informática years 4 and 5 | M | Low | [#26](https://github.com/MatiasGuaymas/Blog_Informatica/issues/26) |

E02-F01 is in progress in an open pull request.

## Dependencies

- E02-F01 merges before any note batch; E02-F03 blocks the batches for subjects without a slug.
- E01-F01 (split of carreras.ts) should follow E02-F01 to avoid conflicts.

## Risks

- Authors may not have taken every subject (especially the Licenciatura en Informática years 4 and 5); "Mi opinión" (my opinion) is written only from first-hand experience.
- Material links can break or point to files that must not be shared; the guide defines what can be linked.
