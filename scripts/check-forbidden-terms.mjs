#!/usr/bin/env node
/**
 * Blocks third-party brand names that must never appear in this repository.
 * The patterns live, encoded, in scripts/lib/forbidden-terms.mjs.
 *
 * Usage:
 *   node scripts/check-forbidden-terms.mjs --all        every tracked file (CI)
 *   node scripts/check-forbidden-terms.mjs <files...>   given files (git hooks)
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { findForbiddenLines, PHRASES } from "./lib/forbidden-terms.mjs";

// Generated files where the short token can appear by chance inside hashes.
const TOKEN_EXEMPT = new Set(["pnpm-lock.yaml"]);

const args = process.argv.slice(2);
const files = args.includes("--all")
  ? execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
      .split("\0")
      .filter(Boolean)
  : args;

const isBinary = (buffer) => buffer.subarray(0, 8000).includes(0);

const findings = [];
for (const file of files) {
  if (!existsSync(file) || !statSync(file).isFile()) continue;
  const buffer = readFileSync(file);
  if (isBinary(buffer)) {
    if (PHRASES.test(buffer.toString("latin1"))) {
      findings.push(`${file} (binary)`);
    }
    continue;
  }
  const lines = findForbiddenLines(buffer.toString("utf8"), {
    checkToken: !TOKEN_EXEMPT.has(file),
  });
  for (const line of lines) findings.push(`${file}:${line}`);
}

if (findings.length > 0) {
  console.error("Forbidden third-party branding found:");
  for (const finding of findings) console.error(`  - ${finding}`);
  console.error(
    "Remove it before committing. See AGENTS.md, section Branding.",
  );
  process.exit(1);
}
