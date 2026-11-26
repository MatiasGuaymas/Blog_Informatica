# Product

<!-- impeccable:product-schema 1 -->

<!-- Written on 2026-11-26 from the repository and the maintainers' brief, without an init interview. Statements marked (inferred) come from the code and still need the maintainers' confirmation. -->

## Platform

web

## Users

Students of the Faculty of Informatics at Universidad Nacional de La Plata (UNLP), Argentina, in its four undergraduate careers: Analista Programador Universitario (APU), Analista en Tecnologías de la Información y la Comunicación (ATIC), Licenciatura en Sistemas (LS) and Licenciatura en Informática (LI).

| Persona | Situation and job |
|---|---|
| Prospective student | Compares the four careers: duration, number of subjects and the 2021 study plan |
| First-year student | Learns the plan, the prerequisites (correlativas), the academic calendar and where the official resources live |
| Advanced student | Checks what a pending subject unlocks, follows course notices, plans enrollment and final exam sessions (mesas de final) |
| Maintainer | One of the two developers who edit content and code through pull requests |

Students use the site on phones and on desktops (inferred from the mobile drawer, the edge swipe and the two-viewport browser checks), and reach many pages through links shared by classmates (inferred).

## Product Purpose

A study companion that puts in one place what students otherwise collect from the official notice board, faculty pages and course channels: the 2021 study plans with their prerequisites, a live mirror of the official notice board, the academic calendar, bibliography repositories, a directory of official links and personal notes per subject.

The site is personal and unofficial. Success means a student finds a plan, a prerequisite, a notice or a date faster than on the official sites (inferred), and trusts what they find because the pages point back to their official sources.

## Positioning

A companion made by a student of the same faculty that adds what the official sources lack, while staying faithful to them:

- The notice board with career filters, text search, date ranges, pagination and links to a single notice, built on the same public API that feeds the official board and refreshed every 5 minutes.
- An interactive prerequisites graph for each career, and plan pages that link each subject to its own page.
- A calendar that answers what is happening now and in the next 30 days, beyond a list of dates.
- Everything in friendly Argentine Spanish, in one site, in light and dark themes.

## Operating Context

- The academic year has two terms (cuatrimestres in the plans, semestres in the official calendar), a final exam session almost every month with enrollment the week before, a winter break in July and summer courses in February. The calendar content covers 2026 and needs a yearly update.
- Students enroll in SIU Guaraní, take courses on the faculty's three course platforms and read announcements on the official notice board at gestiondocente.info.unlp.edu.ar. The site links to all of them and replaces none.
- Content is code: plans, subject notes, calendar events and links are typed TypeScript modules, changed through reviewed pull requests and published with the next deployment.
- The only live data is the official notice board API, cached for 5 minutes.

## Capabilities and Constraints

| Route | Capability |
|---|---|
| `/` | Hero, unofficial notice, career cards, "Últimos anuncios" (latest notices) and a map of every section |
| `/carreras`, `/carreras/[carrera]` | Career selector and each 2021 plan by year and term, with the prerequisites graph |
| `/materia/[slug]` | Subject page with code, name, prerequisites, careers and notes; 25 subjects have a page and 3 have notes |
| `/cartelera` | Live notice board with search, filters, pagination, attachments and links to one notice |
| `/calendario` | Academic calendar with a month view, category filters, ongoing and upcoming events |
| `/bibliografia` | Two public repositories of course books, for APU and LS |
| `/links` | Directory of official sites and platforms in 7 groups |
| `/sobre-mi` | About the author |

- No accounts, database, CMS or admin panel. The `KV_*` and `ADMIN_*` variables in `src/env.ts` are unused placeholders; any login or in-site editing needs a decision first.
- Site copy is Spanish (es-AR); the repository is English. Domain terms follow `docs/glossary.md`.
- Only the 2021 plans are modeled, and notices map to careers by exact subject name.
- The notice board API is public and unversioned: the product has to tolerate it being slow, down or changed.
- Known product gaps: page content is rendered in the browser (the server HTML carries no visible page content), notice times are 3 hours early in production, notice search is accent-sensitive, and canceled notices do not show their cancellation date.

## Brand Commitments

- **Name:** "Blog Informática UNLP", short name "Blog Informática".
- **Status:** personal and unofficial. The home keeps the notice "El material compartido es de carácter personal y no representa contenidos oficiales ni resoluciones aprobadas por ninguna cátedra." (the shared material is personal and does not represent official content). Pages link the official source they draw on: "Plan oficial", "Cartelera oficial", "Calendario académico 2026 oficial".
- **Voice:** Spanish with Argentine voseo, friendly and clear, like a classmate who already knows the faculty: "Elegí una carrera para ver el plan de estudios completo", "Probá ampliar el rango de fechas o sacar algunos filtros.", "La página que buscás no existe o fue movida." No heavy slang and no em dashes. Subject notes and the about page speak in the author's first person ("Todavía no escribí mis recomendaciones para esta materia").
- **Logo:** `public/logo.png`, an open book in blue line art whose spine branches into circuit traces with round nodes, a cursor arrow at the lower right and gray pages behind. It sits on a white rounded tile with a thin ring, in both themes.
- **No third-party branding** anywhere in the repository; the branding guard enforces it.

## Evidence on Hand

- The four 2021 plans (125 plan rows, 52 subject codes) in `src/lib/carreras.ts`.
- 73 events of the 2026 academic calendar in `src/lib/calendario.ts`.
- Editorial notes for 3 subjects (`SI101`, `SI106`, `SI107`) in `materiaDetails`.
- 20 official links in 7 groups in `src/app/(public)/links/page.tsx`, and two bibliography repositories in `src/app/(public)/bibliografia/page.tsx`.
- Photos for the about page in `public/sobre-mi/`.
- The live notices of the official board.
- Absent, never fabricate: usage numbers or analytics (the site ships no analytics), testimonials, any endorsement by the faculty or a cátedra, notes for the subjects that show "Notas en preparación" (notes in progress), and per-page preview images.

## Product Principles

1. **Official first.** Complement the official sources, link back to them, and never present the site as official.
2. **Find it fast.** A plan, a prerequisite, a notice or a date is one or two steps away, and filtered views live in the URL so they can be shared.
3. **Speak like a classmate.** Friendly, precise Argentine Spanish, with official names written exactly as the faculty writes them.
4. **Content as code.** Reviewed, correct content over instant edits: every change goes through a pull request.
5. **For every student.** Light and dark themes, phones and desktops, keyboard and screen readers, at WCAG 2.2 AA.

## Accessibility & Inclusion

- Target: WCAG 2.2 AA, with keyboard access, visible focus, 4.5:1 text contrast, labels on every control and reduced motion respected. The document language is Spanish (`<html lang="es">`).
- Known gaps: the framer-motion reveals ignore `prefers-reduced-motion`; there is no skip link; the notice search box has no label; focus outlines are removed inside dialogs and the mobile drawer; the prerequisites graph nodes cannot be reached with the keyboard; notice cards are `role="button"` containers with links inside; small labels drawn at reduced opacity may fall below 4.5:1.
