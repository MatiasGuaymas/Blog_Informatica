#!/usr/bin/env node
/**
 * Enforces the 500-line limit for TypeScript files (AGENTS.md, File size).
 * Files listed in scripts/file-lines-allowlist.json are known debt: they may
 * not grow beyond their recorded size until the split that tracks them lands.
 *
 * Usage:
 *   node scripts/check-file-lines.mjs --all        every tracked .ts/.tsx file
 *   node scripts/check-file-lines.mjs <files...>   given files (git hooks)
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const LIMIT = 500;
const { files: allowlist } = JSON.parse(
  readFileSync(new URL("./file-lines-allowlist.json", import.meta.url), "utf8"),
);

const args = process.argv.slice(2);
const candidates = args.includes("--all")
  ? execFileSync("git", ["ls-files", "-z", "*.ts", "*.tsx"], {
      encoding: "utf8",
    })
      .split("\0")
      .filter(Boolean)
  : args;

const countLines = (content) =>
  content.length === 0
    ? 0
    : content.split("\n").length - (content.endsWith("\n") ? 1 : 0);

const errors = [];
for (const file of candidates) {
  if (!/\.tsx?$/.test(file) || file.endsWith(".d.ts") || !existsSync(file))
    continue;
  const lines = countLines(readFileSync(file, "utf8"));
  const known = allowlist[file];
  const max = known?.max ?? LIMIT;
  if (lines <= max) continue;
  errors.push(
    known
      ? `${file}: ${lines} lines. Known debt that may not grow beyond ${max} (${known.tracking}).`
      : `${file}: ${lines} lines (limit ${LIMIT}). Split it by domain, never by number.`,
  );
}

if (errors.length > 0) {
  console.error("File size limit exceeded:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
