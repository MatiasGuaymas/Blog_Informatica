#!/usr/bin/env node
/**
 * PreToolUse hook for Edit, Write and MultiEdit: blocks writing secrets,
 * hand-editing generated files and introducing forbidden branding.
 */
import { deny, readEvent } from "./lib.mjs";
import { evaluateWrite } from "./rules.mjs";

const event = readEvent();
const input = event?.tool_input ?? {};
const text = [
  input.content,
  input.new_string,
  ...(input.edits ?? []).map((edit) => edit.new_string),
]
  .filter((value) => typeof value === "string")
  .join("\n");

const result = evaluateWrite(
  input.file_path ?? "",
  text,
  event.cwd || process.cwd(),
);
if (result) deny(result.reason);
