---
name: Blog Informática UNLP
description: Study companion for students of the Faculty of Informatics at UNLP, in calm faculty blue with pastel highlights, blue-tinted neutrals and rounded cards.
colors:
  primary: "oklch(0.55 0.18 245)"
  primary-foreground: "oklch(1 0 0)"
  primary-weak: "oklch(0.88 0.07 240)"
  ring: "oklch(0.6 0.14 245)"
  background: "oklch(0.99 0.008 240)"
  foreground: "oklch(0.18 0.025 245)"
  card: "oklch(1 0 0)"
  muted: "oklch(0.96 0.025 240)"
  muted-foreground: "oklch(0.5 0.04 240)"
  secondary: "oklch(0.94 0.04 240)"
  secondary-foreground: "oklch(0.32 0.12 245)"
  accent: "oklch(0.92 0.06 240)"
  accent-foreground: "oklch(0.32 0.12 245)"
  border: "oklch(0.91 0.03 240)"
  sidebar: "oklch(0.97 0.015 240)"
  pastel-blue: "oklch(0.92 0.06 240)"
  pastel-mint: "oklch(0.92 0.06 165)"
  pastel-rose: "oklch(0.92 0.06 15)"
  pastel-amber: "oklch(0.94 0.07 80)"
  destructive: "oklch(0.62 0.18 25)"
  success: "oklch(0.7 0.15 160)"
  warning: "oklch(0.82 0.13 80)"
  primary-dark: "oklch(0.74 0.13 240)"
  primary-foreground-dark: "oklch(0.16 0.025 245)"
  primary-weak-dark: "oklch(0.36 0.09 240)"
  ring-dark: "oklch(0.74 0.13 240)"
  background-dark: "oklch(0.16 0.025 245)"
  foreground-dark: "oklch(0.94 0.008 240)"
  card-dark: "oklch(0.2 0.028 245)"
  muted-dark: "oklch(0.24 0.025 245)"
  muted-foreground-dark: "oklch(0.68 0.025 240)"
  secondary-dark: "oklch(0.26 0.03 245)"
  secondary-foreground-dark: "oklch(0.94 0.008 240)"
  accent-dark: "oklch(0.32 0.06 240)"
  accent-foreground-dark: "oklch(0.94 0.008 240)"
  border-dark: "oklch(0.3 0.025 245)"
  sidebar-dark: "oklch(0.14 0.025 245)"
  pastel-blue-dark: "oklch(0.36 0.07 240)"
  pastel-mint-dark: "oklch(0.36 0.07 165)"
  pastel-rose-dark: "oklch(0.36 0.07 15)"
  pastel-amber-dark: "oklch(0.4 0.08 80)"
  destructive-dark: "oklch(0.66 0.2 25)"
  success-dark: "oklch(0.68 0.15 160)"
  warning-dark: "oklch(0.78 0.13 80)"
typography:
  display:
    fontFamily: "Poppins, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Poppins, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.11
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: '"cv11", "ss01"'
  label:
    fontFamily: "Poppins, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "0.1em"
  micro:
    fontFamily: "Poppins, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.12em"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.1em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  full: "9999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "8": "2rem"
  "10": "2.5rem"
  "12": "3rem"
  "16": "4rem"
  "20": "5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    height: "2.25rem"
    padding: "0 0.625rem"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: "2.25rem"
    padding: "0 0.625rem"
  button-ghost:
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: "2.25rem"
    padding: "0 0.625rem"
  chip-filter:
    backgroundColor: "{colors.pastel-blue}"
    textColor: "{colors.primary}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.75rem"
  chip-filter-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.75rem"
  badge-type:
    backgroundColor: "{colors.pastel-amber}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "0.125rem 0.5rem"
  card-link:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.2xl}"
    padding: "1.25rem"
  input-search:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "0.5rem 0.75rem 0.5rem 2.25rem"
  nav-item:
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.xl}"
    padding: "0.625rem 0.75rem"
  nav-item-active:
    backgroundColor: "{colors.pastel-blue}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xl}"
    padding: "0.625rem 0.75rem"
  icon-tile:
    backgroundColor: "{colors.pastel-blue}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xl}"
    size: "2.5rem"
---

<!-- Scanned from src/app/globals.css, src/components and the pages on 2026-11-26. Keys ending in -dark are the values under [data-theme="dark"]. The North Star and the descriptive color names are provisional until the maintainers confirm them. -->

# Design System: Blog Informática UNLP

## Overview

**Creative North Star: "The Blue Study Notebook"** (provisional)

The site feels like a tidy notebook shared by a classmate: calm faculty blue on cool, near-white paper, soft pastel highlights, generously rounded cards and plain, friendly type. Students come to find a plan, a notice or a date, so clarity and scanability lead and personality lives in the details: small uppercase eyebrows, pastel chips, gentle fade-up reveals and a glowing progress bar during navigation.

Density follows the surface. The home and the section pages are airy grids of cards; the study plans, the notice board and the calendar are dense but structured lists and grids. The dark theme is a deep navy, never grey or black, with a lighter blue for everything interactive.

**Key Characteristics:**
- One blue carries every interactive cue; pastels add highlights and code categories.
- Neutrals keep a blue tint (hue 240 to 245) in both themes.
- Cards with 18px corners and a 1px border, flat until hovered.
- Poppins everywhere, with small uppercase eyebrows above page and section titles.
- Fade-up reveals and quick 150 to 300ms state transitions.

## Colors

A cool, blue-led palette: one saturated blue, blue-tinted neutrals and four pastels, mirrored by a navy dark theme.

### Primary
- **Faculty Blue** (`primary`, `primary-dark`): links, primary buttons, active navigation text and its side bar, eyebrows, active filter chips, the today marker in the calendar and the progress bar. The dark value is lighter and softer so it reads on navy.
- **Soft Blue Edge** (`primary-weak`): the hover border of `.hover-lift` and `.card-interactive`, blockquote rules in notice bodies and the scrollbar thumb.
- **Focus Blue** (`ring`): focus rings and outlines, always drawn at reduced alpha (30% to 40%).

### Secondary
- **Pale Blue Fills** (`secondary`, `accent`, with their `-foreground` text colors): pills, hovered rows and quiet emphasis.

### Tertiary
- **Pastel Blue, Mint, Rose and Amber** (`pastel-*`): icon tiles, chips and soft highlights. Pastel blue is the default highlight; amber marks subject type badges and the unofficial notice; mint, rose and amber also code calendar categories (enrollment, holidays, exams).
- **Alert Red** (`destructive`): error states and destructive buttons.
- **Status** (`success`, `warning`): status dots only; they have no Tailwind utilities.
- Calendar categories add raw Tailwind palette colors for dots and chip text: primary blue for classes, amber for exams, emerald for enrollment, rose for holidays, stone for breaks and violet for other events.

### Neutral
- **Cool Paper** (`background`): the page, a near-white with a blue tint. Its dark counterpart, **Night Navy** (`background-dark`), carries the dark theme.
- **Card White** (`card`): cards, panels and dialogs; a lifted navy in the dark theme.
- **Ink** (`foreground`): body text, a deep blue-black.
- **Mist and Slate** (`muted`, `muted-foreground`): subtle fills, secondary text, meta lines and placeholders.
- **Hairline** (`border`): 1px borders, dividers and input outlines.
- **Sidebar** (`sidebar`): the navigation column, slightly darker than the cards in the dark theme.

### Named Rules
**The One Blue Rule.** Interactive and brand cues use the primary blue and its pastel. Amber, mint, rose, stone and violet code categories and states; they never mark a link or a primary action.

**The Tinted Neutral Rule.** Every neutral keeps the 240 to 245 blue hue. The dark theme is navy, and the only pure white surfaces are cards in the light theme and the logo tile.

## Typography

**Display Font:** Poppins (self-hosted by next/font in weights 300 to 800, with a generated metric-matched fallback)
**Body Font:** Poppins
**Label/Mono Font:** the system monospace stack, for subject codes and career acronyms

**Character:** A geometric, rounded sans that reads friendly at body sizes and confident in the extra bold hero; monospace codes add a quiet technical note.

### Hierarchy
- **Display** (800, 2.25rem on phones and 3.75rem from 640px, line-height 1, tracking -0.025em): the home hero "Blog Informática", with part of it in a blue gradient; the about hero tops out at 3rem.
- **Headline** (700, 1.875rem rising to 2.25rem, tracking -0.025em): the `h1` of every section page.
- **Section** (700, 1.5rem rising to 1.875rem): home section titles; plan years use 1.5rem and calendar blocks 1.25rem.
- **Title** (600, 1rem to 1.25rem, tight leading): card, notice and link titles.
- **Body** (400, 1rem): running text; lead paragraphs use the muted color and stop at 65ch, and the home hero lead grows to 1.125rem and 1.25rem at line-height 1.625.
- **Small** (0.875rem and 0.75rem): descriptions inside cards, meta lines and footers.
- **Label** (600, 0.75rem, uppercase, tracking 0.1em, primary): the eyebrow above page and section titles.
- **Micro** (600, 10px to 11px, uppercase, tracking 0.1em to 0.2em): chips, sidebar group labels and, in monospace, codes and acronyms.

### Named Rules
**The Eyebrow Rule.** Every page header and home section starts with a small uppercase blue eyebrow, then the title, then a muted lead paragraph no wider than 65ch.

**The Sentence Case Rule.** Titles are written in sentence case; uppercase comes only from CSS on eyebrows, chips and labels.

## Layout

- **Shell:** a sticky sidebar from 640px (256px wide, 64px collapsed, the choice persisted), a sticky 56px header with a translucent blurred background, and the main area padded 16px on phones, 24px from 640px and 40px from 768px horizontally, 24px to 32px vertically. Below 640px the sidebar becomes a drawer that slides in from the left over about three quarters of the screen.
- **Content column:** one centered column, `max-w-5xl` (64rem) on section pages and `max-w-3xl` (48rem) on the subject page; paragraphs stop at 65ch.
- **Rhythm:** page blocks sit 40px apart (32px on the notice board, 48px on the links page, 64px to 80px on the home and the about page); 16px to 20px separate a section header from its content.
- **Grids:** one column on phones; two from 640px for most card grids and the notices (from 768px on the links and bibliography pages, from 1024px for plan blocks); three from 1024px for the home sections grid. Card rows keep equal heights (`auto-rows-fr`); gaps are 12px to 16px.
- **Breakpoints:** Tailwind defaults at 640, 768 and 1024px. Calendar day cells show category chips from 1024px and colored dots below; the prerequisites graph dialog takes 95% of the viewport.

### Named Rules
**The Single Column Rule.** Content sits in one centered column under the header. Width comes from `max-w-5xl`, never from full-bleed sections.

## Elevation & Depth

Flat at rest, layered by tone and hairlines. Shadows answer hover and mark overlays; the header and dialog backdrops add translucency and blur.

### Shadow Vocabulary
- **Soft** (the `shadow-sm` utility): the logo tile and active filter chips.
- **Medium** (`hover:shadow-md`): hovered notice cards, plan blocks, link cards and calendar cards.
- **Large** (`hover:shadow-lg`, and `box-shadow: var(--shadow-lg)` in `.hover-lift` and `.card-interactive`): hovered section cards; `shadow-lg` also sits on the drawer and on toasts.
- **Glow** (`box-shadow: 0 0 24px oklch(0.55 0.18 245 / 0.18)`, the `--shadow-glow` variable): `.glow-on-hover`. The progress bar has its own glow (`0 0 8px` of the primary color at 60%).

`globals.css` declares `--shadow-sm`, `--shadow-md` and `--shadow-lg` on `:root` with very low alphas (0.03 to 0.08) and stronger dark versions (0.4 to 0.55) so they read on navy. They live outside `@theme`, so check computed styles before assuming the `shadow-*` utilities use them. The header uses 85% of the background color with a strong backdrop blur, and dialogs dim the page with 10% black and a light blur.

### Named Rules
**The Flat-Until-Touched Rule.** Surfaces rest flat with a 1px border. Hover adds a 2px to 4px lift, a stronger border (primary at 40%) and a medium or large shadow. Nothing floats at rest except overlays.

## Shapes

Generously rounded, soft geometry: 18px corners for cards, panels, callouts and the calendar; 14px for navigation items, icon tiles, dialogs and the search box; 10px for buttons, inputs and small tiles; full pills for chips, filters, badges and the subject select. Lines are 1px hairlines; the active navigation item adds a 3px blue bar rounded on its right side. Icons are lucide line icons, mostly at 16px to 20px. Section cards show a blurred pastel blue blob in their top right corner on hover.

## Components

### Buttons
- **Shape:** gently rounded (10px); heights of 28, 32, 36 (default) and 40px, plus square icon sizes.
- **Primary:** Faculty Blue fill with white text, a faint top-to-bottom sheen and a slow light sweep on hover (`.btn-shine`, off under reduced motion); a press scales it to 0.97.
- **Hover / Focus:** 150ms color and shadow transitions; a 1.5px focus ring in the ring color at 30%.
- **Secondary / Ghost / Tertiary:** outline (hairline border on the page color), secondary (pale blue fill), ghost (transparent with a muted hover fill), destructive (red tint) and link styles.
- Pages mostly use link cards and pills; the `Button` primitive appears on the error and not-found pages and as the dialog close button. Small bordered buttons on the card color (10px corners, 12px text) handle secondary actions such as "Hoy" (today) and the month arrows in the calendar.

### Chips
- **Style:** full pills with 10px to 11px uppercase semibold text. Filter chips sit on pastel blue at 40% with blue text, or on muted grey-blue for date ranges; career chips use monospace on pastel blue at 60%; type badges use monospace on pastel amber; calendar category chips pair a pastel fill with a 6px dot.
- **State:** a selected filter turns solid blue with white text and a soft shadow, and exposes `aria-pressed`. Canceled notices get a rose "Anulado" (canceled) badge with 10px corners.

### Cards / Containers
- **Corner Style:** 18px.
- **Background:** card white (lifted navy in the dark theme); the home sections grid and the unofficial notice use the card color at 50% and 60%.
- **Shadow Strategy:** flat at rest, medium or large shadow on hover (Flat-Until-Touched Rule).
- **Border:** 1px hairline that turns primary at 40% on hover.
- **Internal Padding:** 20px, 24px on large cards; list rows 12px by 16px.
- **Link cards:** the whole card is the link; a corner arrow nudges right and turns blue on hover.
- **Callouts:** pastel blue at 30% to 40% with a primary 20% border and a pastel icon tile ("Notas en preparación", the bibliography note); the unofficial notice uses a neutral card with an amber icon tile.
- **Plan blocks:** a pastel blue header strip with an 11px uppercase term label over divided rows, codes in monospace.

### Inputs / Fields
- **Style:** the notice search is a 14px rounded field on the page color with a hairline border and a leading search icon; the subject select is a pill with 12px text; switches are 28 by 16px tracks on visually hidden checkboxes; the `Input` primitive is 36px high with 10px corners.
- **Focus:** a 2px blue ring at 30% and a primary border at 40% on the search and select; a 1.5px ring at 30% on the primitives.
- **Error / Disabled:** primitives use a red ring and border for `aria-invalid` and 50% opacity when disabled.

### Navigation
- **Sidebar:** the sidebar surface with a right hairline; a brand row with the logo tile, the name and a micro "UNLP"; items with 14px corners, 14px medium text and 18px icons. The active item has a pastel blue fill, blue text and a 3px left bar; hover adds a muted fill and a 2px nudge to the right. Group labels ("Recursos") are uppercase micro text. Collapsing animates the width over 300ms and leaves icons with tooltips.
- **Header:** sticky and 56px tall, translucent with blur; breadcrumbs from 640px with chevron separators; a 36px square theme toggle.
- **Mobile:** a 36px menu button opens a left sheet with the same items; a swipe to the left closes it and a swipe from the left edge opens it.

### Dialogs
The page-colored panel has 14px corners and a 10% foreground ring, and enters with a quick fade and zoom from 95% (100ms) over a dimmed, lightly blurred backdrop. The notice modal is up to 48rem wide and 85% of the viewport tall, with a bordered header and a scrolling body; the graph dialog fills 95% of the viewport. The close button is a ghost icon button labeled "Cerrar" (close).

### Prerequisites Graph
One column per term, headed by "Año N" and "1° cuat" or "2° cuat". Nodes are 220 by 96px cards with 14px corners, the code in blue monospace and the name in 12px semibold. Edges are orthogonal lines in the muted text color at 35% opacity with closed arrowheads. Hovering a node turns its edges blue and dims unrelated nodes to 50%. The canvas controls take the card, border and secondary colors.

### Calendar Month View
A seven-column grid with 72px minimum cells and hairline dividers. Today is a filled blue circle, the selected day a pastel blue fill with an inset blue ring, and national holidays a rose tint. Ranges longer than 14 days leave the grid and appear as "En curso ahora" (happening now) cards with a progress bar.

### Motion
- Sections fade up 16px over 550ms on the curve cubic-bezier(0.22, 1, 0.36, 1); lists stagger their items by 70ms to 90ms with a 14px rise; the about gallery tiles scale in over 700ms in a 90ms cascade.
- State changes (color, border, shadow, small translations) take 150ms to 300ms. CSS timing tokens: 100ms (`--anim-duration-fast`), 200ms (`--anim-duration`), 320ms (`--anim-duration-slow`) and 450ms (`--anim-duration-slower`).
- The navigation progress bar is a 2px blue gradient that grows toward 85% while a page loads, then completes and fades.
- Under reduced motion the CSS animations and the gallery stop; the framer-motion reveals and the progress bar still run.

## Do's and Don'ts

### Do:
- **Do** use the semantic token utilities (`bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-pastel-blue`) so both themes work without `dark:` overrides.
- **Do** open every page with the eyebrow, title and muted lead paragraph pattern inside a centered `max-w-5xl` column.
- **Do** keep cards at 18px corners with a 1px border and add elevation only on hover.
- **Do** separate meta items with a middle dot "·", as in "3 años · 24 asignaturas".
- **Do** keep the logo on its white rounded tile with a thin ring, in both themes.
- **Do** write category colors as complete class strings in one map, as `CATEGORIA_STYLES` does.
- **Do** hold every text and control color pair to WCAG 2.2 AA in both themes: 4.5:1 for text, 3:1 for focus indicators and control boundaries.
- **Do** give every focusable element inside a dialog or sheet its own visible `focus-visible` ring.
- **Do** make new motion respect `prefers-reduced-motion` and stay within 150ms to 550ms on the shared ease-out curve.

### Don't:
- **Don't** hardcode hex or rgb colors in components. The Open Graph image, the manifest and the viewport theme colors already do, and they drift from the tokens.
- **Don't** introduce grey or black neutrals; keep the blue tint in both themes.
- **Don't** use amber, mint, rose, stone or violet for links or primary actions; they code categories.
- **Don't** lower the opacity of small text (`/70`, `/80`) without checking 4.5:1 contrast.
- **Don't** switch themes with a `dark` class or the OS setting; the `dark:` variant follows `data-theme` on `<html>`.
- **Don't** animate width, height or layout in new motion; animate transform and opacity. The sidebar collapse is the existing exception.
