#!/usr/bin/env node
/**
 * Creates or updates the repository labels defined in .github/labels.json and
 * deletes the ones listed under "remove". Requires an authenticated GitHub CLI.
 *
 * Usage: node scripts/github/sync-labels.mjs [owner/repo]
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const gh = (args, options = {}) =>
  execFileSync("gh", args, { encoding: "utf8", ...options });
const repo =
  process.argv[2] ??
  gh([
    "repo",
    "view",
    "--json",
    "nameWithOwner",
    "-q",
    ".nameWithOwner",
  ]).trim();
const { labels, remove = [] } = JSON.parse(
  readFileSync(new URL("../../.github/labels.json", import.meta.url), "utf8"),
);

for (const label of labels) {
  gh(
    [
      "label",
      "create",
      label.name,
      "--repo",
      repo,
      "--color",
      label.color,
      "--description",
      label.description,
      "--force",
    ],
    { stdio: "ignore" },
  );
  console.log(`synced  ${label.name}`);
}
for (const name of remove) {
  try {
    gh(["label", "delete", name, "--repo", repo, "--yes"], { stdio: "ignore" });
    console.log(`deleted ${name}`);
  } catch {
    // The label does not exist anymore.
  }
}
