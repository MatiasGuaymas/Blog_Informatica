#!/usr/bin/env node
/**
 * Pull request gate (CI only):
 * 1. Every pull request adds a CHANGELOG.md entry under [Unreleased] that
 *    ends with its number and the author's handle, e.g. "#12 @fededobal".
 * 2. Source changes come with documentation changes.
 * Labels waive each check when a reviewer agrees it does not apply:
 * `skip-changelog`, `skip-docs`, and `release` (release preparation).
 *
 * Environment (set by .github/workflows/pr-checks.yml): BASE_SHA, HEAD_SHA,
 * BASE_REF, HEAD_REF, PR_NUMBER, PR_AUTHOR, PR_LABELS.
 */
import { execFileSync } from "node:child_process";

const env = process.env;
const labels = new Set(
  (env.PR_LABELS ?? "")
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean),
);
const author = env.PR_AUTHOR ?? "";
const pr = env.PR_NUMBER ?? "";

if (env.BASE_REF === "main" && env.HEAD_REF === "dev") {
  console.log(
    "Release promotion: every change was checked when it reached dev.",
  );
  process.exit(0);
}
if (author.endsWith("[bot]")) {
  console.log(`Automated pull request by ${author}: skipped.`);
  process.exit(0);
}

const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
const range = `${env.BASE_SHA}...${env.HEAD_SHA}`;
const changed = git("diff", "--name-only", range).split("\n").filter(Boolean);
const errors = [];

if (!labels.has("skip-changelog") && !labels.has("release")) {
  if (!changed.includes("CHANGELOG.md")) {
    errors.push(
      `Add a CHANGELOG.md entry under [Unreleased] ending with "#${pr} @${author}", or ask a reviewer for the skip-changelog label.`,
    );
  } else {
    const added = git("diff", "--unified=0", range, "--", "CHANGELOG.md")
      .split("\n")
      .filter((line) => line.startsWith("+- "));
    if (added.length === 0)
      errors.push("CHANGELOG.md changed but no entry was added.");
    for (const line of added) {
      if (!/#\d+ @[A-Za-z0-9-]+(\[bot\])?\s*$/.test(line)) {
        errors.push(
          `Entry must end with "#<PR> @<author>": ${line.slice(1).trim()}`,
        );
      }
    }
    if (added.length > 0 && !added.some((line) => line.includes(`#${pr} @`))) {
      errors.push(`No changelog entry references this pull request (#${pr}).`);
    }
  }
}

const sourceChanged = changed.some(
  (file) =>
    /^src\/.+\.(ts|tsx|css)$/.test(file) && !/\.(test|spec)\.tsx?$/.test(file),
);
const docsChanged = changed.some(
  (file) => file.startsWith("docs/") || file === "README.md",
);
if (sourceChanged && !docsChanged && !labels.has("skip-docs")) {
  errors.push(
    "Source files changed but no documentation did. Update docs/features/<feature>/ or docs/architecture/, or ask a reviewer for the skip-docs label.",
  );
}

if (errors.length > 0) {
  console.error("✖ Docs and changelog check failed:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log("✓ Docs and changelog check passed.");
