#!/usr/bin/env node
/**
 * Blocks third-party brand names that must never appear in this repository.
 * The patterns are base64-encoded so that this guard does not contain the
 * terms it blocks.
 *
 * Usage:
 *   node scripts/check-forbidden-terms.mjs --all        every tracked file (CI)
 *   node scripts/check-forbidden-terms.mjs <files...>   given files (git hooks)
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";

const decode = (value) => Buffer.from(value, "base64").toString("utf8");

// Short token: checked in text files only, delimited by non-alphanumerics.
const TOKEN = new RegExp(
  decode("KF58W15hLXowLTldKW1sbShbXmEtejAtOV18JCk="),
  "i",
);
// Long phrases: checked in every file, binary files included.
const PHRASES = new RegExp(
  decode(
    "bWxtWy1fIC5dP2FwcHxtYWNoaW5lc1tcc18uLV0qbGlrZVtcc18uLV0qbWV8bWFjaGluZXNsaWtlbWV8cGF0b3ZpY2E=",
  ),
  "i",
);
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
    if (PHRASES.test(buffer.toString("latin1")))
      findings.push(`${file} (binary)`);
    continue;
  }
  const lines = buffer.toString("utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    const tokenHit = !TOKEN_EXEMPT.has(file) && TOKEN.test(line);
    if (tokenHit || PHRASES.test(line)) findings.push(`${file}:${index + 1}`);
  });
}

if (findings.length > 0) {
  console.error("Forbidden third-party branding found:");
  for (const finding of findings) console.error(`  - ${finding}`);
  console.error(
    "Remove it before committing. See AGENTS.md, section Branding.",
  );
  process.exit(1);
}
