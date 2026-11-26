import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { evaluateBash, evaluateWrite, segments } from "../rules.mjs";

const decision = (command, branch = "feat/1-example") =>
  evaluateBash(command, branch)?.decision ?? "allow";

test("splits chained commands and strips leading env assignments", () => {
  assert.deepEqual(segments("FOO=1 pnpm lint && git status | head"), [
    "pnpm lint",
    "git status",
    "head",
  ]);
});

test("pnpm is the only package manager", () => {
  assert.equal(decision("npm install zod"), "deny");
  assert.equal(decision("cd app && npm i"), "deny");
  assert.equal(decision("yarn add zod"), "deny");
  assert.equal(decision("npx some-tool"), "deny");
  assert.equal(decision("npm run build"), "deny");
  assert.equal(decision("pnpm add zod"), "allow");
  assert.equal(decision('grep -rn "npm install" docs'), "allow");
});

test("git hooks cannot be skipped", () => {
  assert.equal(decision('git commit --no-verify -m "feat: x"'), "deny");
  assert.equal(decision('git commit -n -m "feat: x"'), "deny");
  assert.equal(decision("git push --no-verify"), "deny");
  assert.equal(decision("git push -n origin feat/1-example"), "allow");
  assert.equal(decision('git commit -m "feat: add search"'), "allow");
});

test("main and dev only change through pull requests", () => {
  assert.equal(decision("git push origin main"), "deny");
  assert.equal(decision("git push -u origin dev"), "deny");
  assert.equal(decision("git push origin HEAD:main"), "deny");
  assert.equal(decision("git push", "dev"), "deny");
  assert.equal(decision('git commit -m "fix: x"', "main"), "deny");
  assert.equal(decision("git merge feat/1-example", "dev"), "deny");
  assert.equal(decision("git merge --ff-only origin/dev", "dev"), "allow");
  assert.equal(decision("git pull", "dev"), "allow");
  assert.equal(decision("git push -u origin feat/12-dev-tools"), "allow");
  assert.equal(decision("git push"), "allow");
});

test("destructive commands ask first", () => {
  assert.equal(decision("git push --force-with-lease"), "ask");
  assert.equal(decision("git reset --hard HEAD~1"), "ask");
  assert.equal(decision("rm -rf src"), "ask");
  assert.equal(decision("rm -rf node_modules .next"), "allow");
  assert.equal(decision("rm -rf /private/tmp/claude-1/scratch"), "allow");
  assert.equal(decision("rm -rf /var/folders/ab/cd/T/tmp.x"), "allow");
  assert.equal(decision("rm -rf /Users/someone/project"), "ask");
  assert.equal(decision("gh pr merge 5 --squash --admin"), "ask");
  assert.equal(decision("vercel deploy --prod"), "ask");
});

test("deny wins over ask in chained commands", () => {
  assert.equal(decision("git reset --hard && npm install"), "deny");
});

test("write guard protects secrets, generated files and branding", () => {
  const root = "/repo";
  const verdict = (file, text = "") =>
    evaluateWrite(`${root}/${file}`, text, root)?.decision ?? "allow";
  assert.equal(verdict(".env"), "deny");
  assert.equal(verdict(".env.local"), "deny");
  assert.equal(verdict(".env.example"), "allow");
  assert.equal(verdict("pnpm-lock.yaml"), "deny");
  assert.equal(verdict("node_modules/pkg/index.js"), "deny");
  assert.equal(verdict("src/lib/site.ts", "export const x = 1;"), "allow");
  const brand = ["ml", "m-app"].join("");
  assert.equal(verdict("docs/notes.md", `built from ${brand}`), "deny");
});

test("guard-bash answers with the documented JSON shape", () => {
  const hook = fileURLToPath(new URL("../guard-bash.mjs", import.meta.url));
  const result = spawnSync(process.execPath, [hook], {
    input: JSON.stringify({ tool_input: { command: "npm install" } }),
    encoding: "utf8",
  });
  const output = JSON.parse(result.stdout);
  assert.equal(output.hookSpecificOutput.hookEventName, "PreToolUse");
  assert.equal(output.hookSpecificOutput.permissionDecision, "deny");
  assert.match(output.hookSpecificOutput.permissionDecisionReason, /pnpm/);
});
