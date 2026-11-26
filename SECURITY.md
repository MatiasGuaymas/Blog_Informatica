# Security policy

## Report a vulnerability

Report vulnerabilities privately through GitHub:
<https://github.com/MatiasGuaymas/Blog_Informatica/security/advisories/new>.

Never open a public issue, pull request or discussion about a vulnerability.
The repository is public, so anything posted there is visible to everyone
before a fix exists.

Include, as far as you can:

- What is affected: a URL of the site, a file in this repository or a
  workflow.
- How to reproduce it, step by step.
- What an attacker gains, and who is affected.
- A suggested fix, if you have one.

The maintainers confirm the report in the private advisory, prepare the fix
(in the advisory's temporary private fork when the details must stay
private), ship it as a patch release and then publish the advisory.

### Scope

| In scope | Out of scope |
|---|---|
| The production site, <https://blog-informatica-mu.vercel.app> | The official UNLP systems the site reads or links to, such as the notice board API; report those to the faculty |
| The code, workflows and Claude Code hooks in this repository | The hosting platform itself |
| Staging and pull request previews of this project | Third-party sites linked from the site |

## Supported versions

| Version | Supported |
|---|---|
| The latest release on `main`, which production serves | Yes |
| Older releases | No |

The site has a single production deployment, so fixes ship as a new patch
release and are never backported.

## Automated protections

### GitHub repository settings

| Protection | What it does |
|---|---|
| Secret scanning with push protection | Detects known secret formats and blocks pushes that contain them |
| Dependabot alerts | Flags dependencies with known vulnerabilities |
| Dependabot security updates | Opens pull requests that upgrade vulnerable dependencies |
| Code scanning with CodeQL (default setup) | Analyzes the code for vulnerability patterns |
| Private vulnerability reporting | Lets anyone report a vulnerability privately, as described above |
| Rulesets on `dev` and `main` | Both branches change only through pull requests with one approval and passing required checks; `dev` also requires resolved threads. The admin bypass works only through pull requests, never through direct pushes. |

### Workflows

[`security.yml`](.github/workflows/security.yml) runs on pull requests and
pushes to `dev` and `main`, every Monday at 09:00 UTC, and on demand.

| Job | What it does |
|---|---|
| Dependency audit | `pnpm audit --prod --audit-level=high` fails on high or critical advisories in production dependencies |
| Dependency review | On pull requests only, fails when the change adds a dependency with a high or critical vulnerability |
| Secret scan | Runs gitleaks over the full git history |

[`dependabot.yml`](.github/dependabot.yml) also opens version updates into
`dev` every Monday: npm packages, with minor and patch updates grouped and up
to five open pull requests, and GitHub Actions.

Every workflow has read-only access to the repository contents, except the
Release workflow, which can write tags and GitHub Releases. The workflows run
on the `pull_request` event, so pull requests from forks run without
repository secrets.

### Local safeguards

- `.gitignore` excludes every `.env` file except `.env.example`.
- The git hooks run the branding guard and Biome on every commit and a
  typecheck on every push.
- In Claude Code, the shared settings deny reading `.env` files and the write
  hook blocks writing them. The Bash hook asks for confirmation before an
  admin merge, a change to branch protection rules, a change of repository
  visibility, deleting the repository or deploying to production from the
  CLI.

### In the application

- Notice bodies from the UNLP API are sanitized with sanitize-html before
  they render.
- Environment variables are validated with zod when the development server
  starts and when the site builds ([`src/env.ts`](src/env.ts)).
- The site has no accounts, no database and no secrets in use.

## Run a security review

| Tool | When | What it does |
|---|---|---|
| `/security-review` | Before opening a pull request that touches external data, HTML or dependencies | Built-in Claude Code command that reviews the pending changes on the current branch |
| [`security-audit` skill](.claude/skills/security-audit/SKILL.md), guidance mode | Security questions, a focused review of one area, triage of a finding | The default mode: uses only the relevant parts of the method and writes no files |
| `security-audit` skill, full audit mode | Only when someone explicitly asks for a full audit, a comprehensive review, a pen test or report files | Runs the complete six-phase workflow and writes its reports to a new folder outside the repository (by default `~/security-audit-skill/<repo-name>/run-<N>`) |

The skill inspects source code read-only. It runs project code only inside an
OS-enforced sandbox, and it never probes deployed endpoints or external
services. It is vendored with its license; see
[THIRD-PARTY.md](.claude/skills/THIRD-PARTY.md).

Handle the findings like any vulnerability report:

- File each confirmed vulnerability as a private advisory, not as a public
  issue.
- Keep the raw audit output outside the repository.
- Publish a summary in [`docs/reports/`](docs/reports/README.md) only after
  every finding in it is fixed in production.
