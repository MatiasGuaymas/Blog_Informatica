/**
 * Shared helpers for the Claude Code hooks of this repository: read the hook
 * event from stdin and answer with the documented JSON output format.
 */
import { readFileSync } from "node:fs";

export function readEvent() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

function permission(decision, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: decision,
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

/** Blocks the tool call; Claude sees the reason and should change course. */
export const deny = (reason) => permission("deny", reason);

/** Asks the user to confirm the tool call, showing the reason. */
export const ask = (reason) => permission("ask", reason);

/** Adds text to Claude's context for the given hook event. */
export function addContext(hookEventName, additionalContext) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName, additionalContext },
    }),
  );
  process.exit(0);
}
