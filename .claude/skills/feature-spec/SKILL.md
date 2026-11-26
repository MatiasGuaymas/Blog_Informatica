---
name: feature-spec
description: Write feature specifications with user stories (INVEST), Gherkin acceptance criteria, use cases and verifiable requirements (ISO/IEC/IEEE 29148). Use when drafting or refining a feature issue, splitting an epic into features, or documenting a built feature.
---

# Feature specifications

The house standard for every feature: in its GitHub issue while planned, and in `docs/features/<slug>/README.md` once built. It builds on the vendored `user-stories` and `test-scenarios` skills and adds Gherkin, use cases and the quality gate below.

## Anatomy, in this order

1. **Summary**: two or three sentences on what changes for students.
2. **User stories**: a table with IDs.
3. **Acceptance criteria**: Gherkin scenarios per story.
4. **Use cases**: only for flows with meaningful alternatives.
5. **Non-functional requirements.**
6. **Technical notes** (issue) or **How it works** (docs).
7. **Definition of Done** (issue).

## IDs and traceability

| Item | In issues | In docs/features |
|---|---|---|
| Story | `US-E02F03-01` | `US-<PREFIX>-01` |
| Use case | `UC-E02F03-01` | `UC-<PREFIX>-01` |
| Non-functional requirement | `NFR-E02F03-01` | `NFR-<PREFIX>-01` |

Feature prefixes: `HOME`, `CAR` (careers), `SUB` (subject page), `GRAPH`, `NB` (notice board), `CAL`, `BIB`, `LINK`, `ABOUT`, `SEO`. The chain epic, feature issue, story, scenario, test and pull request (`Closes #`) must stay traceable: name end-to-end tests after the scenario they verify.

## User stories

- Format: **As a** `<persona>`, **I want to** `<action>`, **so that** `<outcome>`.
- Personas: prospective student, first-year student, advanced student, and maintainer (a developer editing content).
- INVEST: Independent, Negotiable, Valuable, Estimable, Small (a few days at most), Testable.
- Split large stories by workflow step, data variation, happy path versus edge cases, or device. Never split by technical layer.

## Acceptance criteria in Gherkin

- One `Scenario` per behavior. `Given` holds only the context that matters, `When` exactly one action, `Then` an observable outcome (visible text, URL, element state); use `And` for more.
- Two to four scenarios per story, including at least one edge or negative case: empty data, external API down, small screen, keyboard only.
- Quote Spanish UI text exactly, with an English gloss the first time: `Then I see "Sin resultados" (no results)`.
- No implementation details: "calls fetchCartelera" is not observable.

```gherkin
Scenario: Filter notices by career
  Given the notice board lists notices for several careers
  When I select "Licenciatura en Sistemas" in the career filter
  Then I see only notices tagged with that career
  And the URL contains the selected filter

Scenario: No notice matches the filters
  Given the notice board lists notices
  When I search for a term that matches no notice
  Then I see "Sin resultados" (no results)
```

## Use cases

Use them when a flow has real alternatives or failure paths.

| Field | Value |
|---|---|
| Primary actor | Student |
| Preconditions | ... |
| Trigger | ... |
| Postconditions | ... |

Then **Main success scenario** (numbered steps) and **Extensions** numbered after the step they branch from (`2a.`, `2a1.`).

## Non-functional requirements checklist

| Area | Default target |
|---|---|
| Performance | LCP under 2.5 s and INP under 200 ms on a mid-range phone over 4G, CLS under 0.1; ship client JavaScript only for interactivity |
| Accessibility | WCAG 2.2 AA: keyboard access, visible focus, 4.5:1 text contrast, labels, reduced motion respected |
| SEO | Metadata through `pageMetadata`, JSON-LD when relevant, sitemap entry for new routes |
| Security | Sanitize external HTML, validate external data with zod, no secrets in code |
| Copy | Spanish (Argentine voseo, friendly), no em dashes |

## Quality gate (ISO/IEC/IEEE 29148)

Before a feature moves to Ready, check every requirement:

| Characteristic | Question |
|---|---|
| Necessary | Would anyone miss it if it were removed? |
| Unambiguous | Does it have exactly one reading? No "fast" or "intuitive". |
| Verifiable | Can a test or a reviewer check it? |
| Feasible | Is it possible with this stack and our time? |
| Singular | Does it state one thing only? |
| Consistent | Does it contradict another requirement? |
| Traceable | Is it linked to its epic and story ID? |

## Templates

- Issue: `.github/ISSUE_TEMPLATE/feature.yml`.
- Docs: follow the section order of any page in `docs/features/` (structure described in `docs/AGENTS.md`).
