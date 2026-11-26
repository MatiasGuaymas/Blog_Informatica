#!/usr/bin/env node
/**
 * SessionStart hook: tells Claude the current branch and the first steps of
 * the workflow, and warns when the session starts on main or dev.
 */
import { execFileSync } from "node:child_process";
import { addContext, readEvent } from "./lib.mjs";

const event = readEvent();
const git = (...args) => {
  try {
    return execFileSync("git", args, {
      cwd: event.cwd || process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
};

const branch = git("rev-parse", "--abbrev-ref", "HEAD") || "unknown";
const changes = git("status", "--porcelain").split("\n").filter(Boolean).length;
const lines = [
  `Current branch: ${branch}${changes ? ` (${changes} uncommitted changes)` : ""}.`,
];
if (branch === "main" || branch === "dev") {
  lines.push(
    `You are on ${branch}. Before changing files, create a feature branch from dev: git switch dev && git pull && git switch -c feat/<issue>-<slug>.`,
  );
}
lines.push(
  "Work starts from a GitHub issue (task-management skill). Branches, commits and pull requests follow the git-workflow skill.",
);
addContext("SessionStart", lines.join("\n"));
