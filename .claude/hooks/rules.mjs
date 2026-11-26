/**
 * Pure rule evaluation for the Claude Code hooks, kept free of I/O so that
 * .claude/hooks/tests/ can cover it. A command line is split into segments
 * (&&, ||, ;, |, newlines) and every segment is checked; the strictest
 * verdict wins (deny over ask).
 */
import path from "node:path";
import { findForbiddenLines } from "../../scripts/lib/forbidden-terms.mjs";

const PROTECTED = new Set(["main", "dev"]);

const DENY = "deny";
const ASK = "ask";

const PNPM_ONLY =
  "This repository uses pnpm only: `pnpm install`, `pnpm add <pkg>`, `pnpm remove <pkg>`, `pnpm <script>`, `pnpm dlx <tool>`.";

/** Splits a command line into trimmed segments, dropping leading VAR=value. */
export function segments(command) {
  return command
    .split(/&&|\|\||;|\||\n/)
    .map((part) =>
      part.trim().replace(/^(?:[A-Za-z_][A-Za-z0-9_]*=\S*\s+)+/, ""),
    )
    .filter(Boolean);
}

/** Positional arguments of `git push`, ignoring flags. */
function pushTargets(segment) {
  return segment
    .replace(/^git\s+push\b/, "")
    .trim()
    .split(/\s+/)
    .filter((token) => token && !token.startsWith("-"));
}

function checkSegment(segment, branch) {
  if (/^npm(\s|$)/.test(segment)) {
    return { decision: DENY, reason: PNPM_ONLY };
  }
  if (/^yarn(\s|$)/.test(segment)) return { decision: DENY, reason: PNPM_ONLY };
  if (/^npx\s/.test(segment)) {
    return {
      decision: DENY,
      reason:
        "Use `pnpm dlx <package>` for one-off tools or `pnpm exec <bin>` for installed binaries instead of npx.",
    };
  }
  if (
    /^git\s+(commit|push)\b.*\s--no-verify\b/.test(segment) ||
    /^git\s+commit\b.*\s-n(\s|$)/.test(segment)
  ) {
    return {
      decision: DENY,
      reason:
        "Skipping git hooks is forbidden (AGENTS.md). Fix what the hook reports, re-stage and commit again.",
    };
  }
  if (/^git\s+commit\b/.test(segment) && PROTECTED.has(branch)) {
    return {
      decision: DENY,
      reason: `Do not commit on ${branch}. Create a feature branch from dev first: git switch dev && git pull && git switch -c feat/<issue>-<slug>.`,
    };
  }
  if (
    /^git\s+merge\b/.test(segment) &&
    PROTECTED.has(branch) &&
    !/--ff-only\b/.test(segment)
  ) {
    return {
      decision: DENY,
      reason: `Changes reach ${branch} only through reviewed pull requests. To sync with the remote use git pull (fast-forward only).`,
    };
  }
  if (/^git\s+push\b/.test(segment)) {
    const targets = pushTargets(segment);
    const refspecs = targets.slice(1);
    const hitsProtected =
      refspecs.some((ref) => PROTECTED.has(ref.split(":").pop())) ||
      (refspecs.length === 0 && PROTECTED.has(branch));
    if (hitsProtected) {
      return {
        decision: DENY,
        reason:
          "main and dev only change through reviewed pull requests (branch rulesets reject direct pushes). Push your feature branch and open a pull request.",
      };
    }
    if (/\s(--force(-with-lease)?|-f)(\s|=|$)/.test(segment)) {
      return {
        decision: ASK,
        reason:
          "Force-pushing rewrites the remote branch. Fine for your own feature branch after a rebase; never for a branch someone else is working on.",
      };
    }
  }
  if (/^git\s+reset\s+--hard\b/.test(segment)) {
    return {
      decision: ASK,
      reason:
        "git reset --hard discards uncommitted work and cannot be undone.",
    };
  }
  if (/^git\s+clean\s+-[a-zA-Z]*f/.test(segment)) {
    return {
      decision: ASK,
      reason: "git clean -f deletes untracked files permanently.",
    };
  }
  if (/^rm\s+-[a-zA-Z]*([rR][a-zA-Z]*f|f[a-zA-Z]*[rR])/.test(segment)) {
    const targets = segment.split(/\s+/).slice(2);
    const safe = targets.every((target) =>
      /^(\.\/)?(node_modules|\.next|test-results|playwright-report)\/?$|^(\/private)?\/tmp\/|^\/var\/folders\//.test(
        target,
      ),
    );
    if (!safe)
      return {
        decision: ASK,
        reason: "rm -rf deletes files permanently. Check the exact paths.",
      };
  }
  if (/^gh\s+pr\s+merge\b.*--admin\b/.test(segment)) {
    return {
      decision: ASK,
      reason:
        "An admin merge bypasses the review and status-check rules. Use it only for emergencies and explain why in the pull request.",
    };
  }
  if (/^gh\s+repo\s+(delete\b|edit\b.*--visibility)/.test(segment)) {
    return {
      decision: ASK,
      reason: "This changes or deletes the GitHub repository itself.",
    };
  }
  if (
    /^gh\s+api\b.*(-X|--method)\s*(DELETE|PUT|PATCH|POST)\b.*(rulesets|\/protection)/.test(
      segment,
    )
  ) {
    return { decision: ASK, reason: "This changes branch protection rules." };
  }
  if (/^vercel\b.*--prod\b/.test(segment)) {
    return {
      decision: ASK,
      reason:
        "Production deploys come from main through a release pull request, not from the CLI.",
    };
  }
  return null;
}

/** Returns { decision, reason } for a Bash command, or null to allow it. */
export function evaluateBash(command, branch = "") {
  let verdict = null;
  for (const segment of segments(command)) {
    const result = checkSegment(segment, branch);
    if (result?.decision === DENY) return result;
    if (result && !verdict) verdict = result;
  }
  return verdict;
}

/** Returns { decision: "deny", reason } for a file write, or null. */
export function evaluateWrite(filePath, text, projectDir) {
  const relative = path
    .relative(projectDir || process.cwd(), filePath)
    .split(path.sep)
    .join("/");
  const base = path.basename(relative);
  if (/^\.env(\..+)?$/.test(base) && base !== ".env.example") {
    return {
      decision: DENY,
      reason:
        "Never write secrets to files in the repository. Configure them as Vercel environment variables (docs/architecture/deployment.md).",
    };
  }
  if (relative === "pnpm-lock.yaml") {
    return {
      decision: DENY,
      reason:
        "Never edit the lockfile by hand. Run pnpm add, pnpm remove or pnpm update.",
    };
  }
  if (/^(node_modules|\.next)\//.test(relative)) {
    return {
      decision: DENY,
      reason: `${relative.split("/")[0]} is generated; change the source instead.`,
    };
  }
  if (text && findForbiddenLines(text).length > 0) {
    return {
      decision: DENY,
      reason:
        "This content contains third-party branding that must never appear in this repository (AGENTS.md, Branding). Remove it.",
    };
  }
  return null;
}
