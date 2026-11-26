# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Every entry ends with its pull request number and the GitHub handle of its author.

## [Unreleased]

### Security

- Upgraded Next.js from 16.2.4 to 16.4.6 and patched `sanitize-html` (XSS through raw-text elements), `zod`, `postcss` and transitive dependencies; `pnpm audit` reports no known vulnerabilities. #2 @MatiasGuaymas

### Changed

- The Open Graph image uses the Node.js runtime and is prerendered at build time, because the Edge runtime is deprecated. #2 @MatiasGuaymas
- Formatted the codebase with Biome (2-space indentation) and sorted imports consistently. #1 @MatiasGuaymas

### Fixed

- Screen readers now announce the loading indicator and the calendar category dots, and `pnpm lint` passes with no errors. #1 @MatiasGuaymas

## [0.1.0] - 2026-11-26

Baseline release: the site as deployed to production when the team started
tracking its work in this repository.

### Added

- Home page that works as a site map: live notice board preview, career cards and a notice clarifying that the content is personal and unofficial. @MatiasGuaymas
- Careers section with the 2021 study plans for APU, ATIC, Licenciatura en Sistemas and Licenciatura en Informática, including electives that link to the official faculty listing. @MatiasGuaymas
- Subject pages with friendly URLs (`/materia/[slug]`), named prerequisites and editorial notes for the first subjects. @MatiasGuaymas
- Interactive prerequisites graph for every career, built with `@xyflow/react`. @MatiasGuaymas
- Live notice board fed by the official UNLP API, with sanitized HTML, filters, pagination, deep links to each notice and 5-minute incremental static regeneration. @MatiasGuaymas
- Academic calendar with monthly and event views. @MatiasGuaymas
- Bibliography page with GitHub repositories of course books, and a directory of official faculty links. @MatiasGuaymas
- About page with bio and photo gallery. @MatiasGuaymas
- SEO baseline: per-page metadata, JSON-LD, dynamic Open Graph image, sitemap, robots, PWA manifest, favicon and app icons. @MatiasGuaymas
- Responsive shell: desktop sidebar, mobile drawer, header with breadcrumbs, dark mode and a navigation progress bar. @MatiasGuaymas

[Unreleased]: https://github.com/MatiasGuaymas/Blog_Informatica/compare/v0.1.0...dev
[0.1.0]: https://github.com/MatiasGuaymas/Blog_Informatica/releases/tag/v0.1.0
