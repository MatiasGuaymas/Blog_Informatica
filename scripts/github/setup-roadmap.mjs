#!/usr/bin/env node
/**
 * Creates the "Roadmap" GitHub Project for this repository (once), adds the
 * Priority and Size fields, links it to the repository and adds every open
 * epic and feature. Re-running it only adds issues that are missing.
 *
 * Needs the `project` scope: gh auth refresh -s project
 * Usage: node scripts/github/setup-roadmap.mjs
 */
import { execFileSync } from "node:child_process";

const OWNER = "MatiasGuaymas";
const REPO = "Blog_Informatica";
const TITLE = "Roadmap";

const gh = (args) => execFileSync("gh", args, { encoding: "utf8" }).trim();
const json = (args) => JSON.parse(gh([...args, "--format", "json"]));

let project = json(["project", "list", "--owner", OWNER]).projects.find(
  (item) => item.title === TITLE,
);
if (!project) {
  project = json(["project", "create", "--owner", OWNER, "--title", TITLE]);
  console.log(`created project #${project.number}`);
  gh([
    "project",
    "link",
    String(project.number),
    "--owner",
    OWNER,
    "--repo",
    REPO,
  ]);
  const fields = {
    Priority: "High,Medium,Low",
    Size: "S,M,L",
  };
  for (const [name, options] of Object.entries(fields)) {
    gh([
      "project",
      "field-create",
      String(project.number),
      "--owner",
      OWNER,
      "--name",
      name,
      "--data-type",
      "SINGLE_SELECT",
      "--single-select-options",
      options,
    ]);
  }
}

const existing = new Set(
  json([
    "project",
    "item-list",
    String(project.number),
    "--owner",
    OWNER,
    "--limit",
    "500",
  ]).items.map((item) => item.content?.url),
);
const issues = JSON.parse(
  gh([
    "issue",
    "list",
    "--repo",
    `${OWNER}/${REPO}`,
    "--state",
    "open",
    "--limit",
    "500",
    "--json",
    "url,title",
  ]),
);
for (const issue of issues) {
  if (existing.has(issue.url)) continue;
  gh([
    "project",
    "item-add",
    String(project.number),
    "--owner",
    OWNER,
    "--url",
    issue.url,
  ]);
  console.log(`added ${issue.title}`);
}

console.log(`
Project ready: https://github.com/users/${OWNER}/projects/${project.number}
Finish in the web UI (the API cannot create views):
  1. Status field options: Backlog, Ready, In progress, In review, Done.
  2. Board view grouped by Status; Table view grouped by Parent issue; Roadmap view.
  3. Workflows: item added -> Backlog, pull request merged -> Done.`);
