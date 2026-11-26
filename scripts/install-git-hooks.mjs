#!/usr/bin/env node
/**
 * Installs the git hooks defined in lefthook.yml. Runs on `pnpm install`
 * through the `prepare` script. Skipped in CI and on Vercel, where there is
 * no local workflow to guard, and outside a git checkout.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

if (process.env.CI || process.env.VERCEL || !existsSync(".git"))
  process.exit(0);

try {
  execFileSync("pnpm", ["exec", "lefthook", "install"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
} catch {
  console.warn(
    "[hooks] lefthook install failed. Run `pnpm exec lefthook install` manually.",
  );
}
