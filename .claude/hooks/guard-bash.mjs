#!/usr/bin/env node
/**
 * PreToolUse hook for Bash: blocks commands that break the repository
 * workflow (npm or yarn, skipping git hooks, committing or pushing to main
 * or dev) and asks before destructive ones. Rules live in rules.mjs.
 */
import { execFileSync } from "node:child_process";
import { ask, deny, readEvent } from "./lib.mjs";
import { evaluateBash } from "./rules.mjs";

const event = readEvent();
const command = event?.tool_input?.command ?? "";

let branch = "";
try {
  branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    cwd: event.cwd || process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
} catch {
  // Not inside a git checkout: branch rules do not apply.
}

const result = evaluateBash(command, branch);
if (result?.decision === "deny") deny(result.reason);
if (result?.decision === "ask") ask(result.reason);
