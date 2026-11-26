#!/usr/bin/env node
/**
 * PostToolUse hook for Edit, Write and MultiEdit: formats the edited file
 * with Biome (same as the pre-commit hook) and reports remaining problems to
 * Claude instead of failing.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { addContext, readEvent } from "./lib.mjs";

const event = readEvent();
const file = event?.tool_input?.file_path;
if (!file || !/\.(m?[jt]sx?|cjs|jsonc?|css)$/.test(file) || !existsSync(file)) {
  process.exit(0);
}

try {
  execFileSync(
    "pnpm",
    [
      "exec",
      "biome",
      "check",
      "--write",
      "--no-errors-on-unmatched",
      "--files-ignore-unknown=true",
      file,
    ],
    {
      cwd: event.cwd || process.cwd(),
      stdio: "pipe",
      shell: process.platform === "win32",
    },
  );
} catch (error) {
  const output = `${error.stdout ?? ""}${error.stderr ?? ""}`
    .trim()
    .split("\n")
    .slice(0, 30)
    .join("\n");
  addContext(
    "PostToolUse",
    `Biome still reports problems in ${file} after auto-fixing. Fix them before committing:\n${output}`,
  );
}
