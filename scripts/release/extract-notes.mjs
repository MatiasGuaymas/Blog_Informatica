#!/usr/bin/env node
/**
 * Prints the CHANGELOG.md section of a version. The release workflow uses it
 * as the body of the GitHub Release.
 *
 * Usage: node scripts/release/extract-notes.mjs 0.2.0
 */
import { readFileSync } from "node:fs";

const version = process.argv[2]?.replace(/^v/, "");
if (!version) {
  console.error("Usage: extract-notes.mjs <version>");
  process.exit(1);
}

const lines = readFileSync(
  new URL("../../CHANGELOG.md", import.meta.url),
  "utf8",
).split("\n");
const start = lines.findIndex((line) => line.startsWith(`## [${version}]`));
if (start === -1) {
  console.error(`Version ${version} was not found in CHANGELOG.md.`);
  process.exit(1);
}
const end = lines.findIndex(
  (line, index) =>
    index > start && (line.startsWith("## [") || /^\[[^\]]+\]: /.test(line)),
);
const body = lines
  .slice(start + 1, end === -1 ? undefined : end)
  .join("\n")
  .trim();
const repository =
  process.env.GITHUB_REPOSITORY ?? "MatiasGuaymas/Blog_Informatica";
process.stdout.write(
  `${body}\n\n**Full changelog:** https://github.com/${repository}/blob/main/CHANGELOG.md\n`,
);
