#!/usr/bin/env node
/**
 * Stop hook: when source files changed but no documentation did, asks Claude
 * (once per stop) to update the matching docs or explain why none is needed.
 * The changelog entry is enforced in CI, once the pull request number exists.
 */
import { execFileSync } from "node:child_process";
import { readEvent } from "./lib.mjs";

const event = readEvent();
if (event.stop_hook_active) process.exit(0);

let status = "";
try {
  status = execFileSync("git", ["status", "--porcelain"], {
    cwd: event.cwd || process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
} catch {
  process.exit(0);
}

const files = status
  .split("\n")
  .filter(Boolean)
  .map((line) => line.slice(3).split(" -> ").pop().replace(/^"|"$/g, ""));
const source = files.filter((file) => /^src\/.+\.(ts|tsx|css)$/.test(file));
const docsChanged = files.some(
  (file) => file.startsWith("docs/") || file === "README.md",
);
if (source.length === 0 || docsChanged) process.exit(0);

const sample =
  source.slice(0, 3).join(", ") + (source.length > 3 ? ", ..." : "");
process.stdout.write(
  JSON.stringify({
    decision: "block",
    reason: `Source files changed (${sample}) but no documentation did. Update the matching docs/features/<feature>/README.md or docs/architecture/ page (see the code-to-docs map in the documentation skill), or state in one sentence why no update is needed. Remember the CHANGELOG entry once the pull request exists.`,
  }),
);
