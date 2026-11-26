#!/usr/bin/env node
/**
 * Browser smoke check for the site (ui-verification skill).
 *
 * For every path it opens a real Chromium page at a mobile (390x844) and a
 * desktop (1440x900) viewport and records the HTTP status, the page title,
 * the first <h1>, console errors and uncaught page errors. With --screenshots
 * it also saves a full-page PNG per path and viewport.
 *
 * Usage, from the repository root:
 *   node .claude/skills/ui-verification/scripts/smoke.mjs \
 *     [--base http://localhost:3123] [--paths /,/cartelera,/calendario] \
 *     [--screenshots test-results/ui] [--theme light|dark] [--wait 60]
 *
 * Exit codes:
 *   0  every page answered 2xx or 3xx, loaded and threw no page error
 *   1  a page returned another status, failed to load, threw a page error
 *      or rendered the error boundary ("Algo salió mal")
 *   2  bad arguments, server not reachable, or Playwright/Chromium missing
 *
 * Chromium is needed once per machine: pnpm exec playwright install chromium
 */
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { parseArgs } from "node:util";

const DEFAULT_BASE = "http://localhost:3123";
const DEFAULT_PATHS = [
  "/",
  "/carreras",
  "/carreras/apu",
  "/materia/cadp",
  "/cartelera",
  "/calendario",
  "/bibliografia",
  "/links",
  "/sobre-mi",
];
const VIEWPORTS = [
  {
    name: "mobile",
    options: {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
  },
  {
    name: "desktop",
    options: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  },
];
// Headings rendered by src/app/error.tsx and src/app/global-error.tsx.
const ERROR_HEADINGS = new Set(["Algo salió mal"]);
const NAVIGATION_TIMEOUT_MS = 30_000;

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error(
    "Usage: node .claude/skills/ui-verification/scripts/smoke.mjs [--base <url>] [--paths /,/cartelera] [--screenshots <dir>] [--theme light|dark] [--wait <seconds>]",
  );
  process.exit(2);
}

function readOptions() {
  let values;
  try {
    ({ values } = parseArgs({
      options: {
        base: { type: "string", default: DEFAULT_BASE },
        paths: { type: "string" },
        screenshots: { type: "string" },
        theme: { type: "string" },
        wait: { type: "string", default: "60" },
        help: { type: "boolean", short: "h", default: false },
      },
    }));
  } catch (error) {
    usage(error instanceof Error ? error.message : String(error));
  }
  if (values.help) usage();

  let base;
  try {
    base = new URL(values.base);
  } catch {
    usage(`--base is not a valid URL: ${values.base}`);
  }
  const paths = values.paths
    ? values.paths
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => (item.startsWith("/") ? item : `/${item}`))
    : DEFAULT_PATHS;
  if (paths.length === 0) usage("--paths is empty");
  if (values.theme && !["light", "dark"].includes(values.theme)) {
    usage("--theme must be light or dark");
  }
  const wait = Number(values.wait);
  if (!Number.isFinite(wait) || wait < 0) usage("--wait must be a number");

  return {
    base,
    paths,
    screenshots: values.screenshots ? path.resolve(values.screenshots) : null,
    theme: values.theme ?? null,
    wait,
  };
}

/** Resolves Playwright next to this script, or from the current directory. */
async function loadChromium() {
  try {
    const { chromium } = await import("playwright");
    return chromium;
  } catch {
    try {
      const require = createRequire(path.join(process.cwd(), "package.json"));
      return require("playwright").chromium;
    } catch {
      return null;
    }
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Polls the base URL so the script can start right after `pnpm start`. */
async function waitForServer(base, seconds) {
  const deadline = Date.now() + seconds * 1000;
  do {
    try {
      await fetch(base, {
        redirect: "manual",
        signal: AbortSignal.timeout(5_000),
      });
      return true;
    } catch {
      await sleep(500);
    }
  } while (Date.now() < deadline);
  return false;
}

function fileSlug(route) {
  if (route === "/") return "home";
  return route
    .replace(/^\//, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Sections animate in with framer-motion when they scroll into view, so a
 * full-page screenshot taken right away shows them invisible. Scroll through
 * the page once, then give the animations time to finish.
 */
async function revealScrollAnimations(page) {
  await page.evaluate(async () => {
    const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await pause(120);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(1_200);
}

async function visit(context, run, route, viewportName) {
  const page = await context.newPage();
  const result = {
    route,
    viewport: viewportName,
    status: null,
    redirectedFrom: null,
    title: "",
    h1: "",
    consoleErrors: [],
    pageErrors: [],
    error: null,
    screenshot: null,
  };
  page.on("console", (message) => {
    if (message.type() === "error") result.consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => result.pageErrors.push(error.message));

  try {
    const response = await page.goto(new URL(route, run.base).href, {
      waitUntil: "load",
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    result.status = response?.status() ?? null;
    const previous = response?.request().redirectedFrom();
    if (previous) result.redirectedFrom = previous.url();
    // Page content renders on the client; let its chunks and data settle.
    await page
      .waitForLoadState("networkidle", { timeout: 10_000 })
      .catch(() => {});
    result.title = await page.title();
    const heading = await page
      .locator("h1")
      .first()
      .textContent({ timeout: 3_000 })
      .catch(() => null);
    result.h1 = (heading ?? "").replace(/\s+/g, " ").trim();
    if (run.screenshots) {
      await revealScrollAnimations(page);
      const suffix = run.theme ? `-${run.theme}` : "";
      const file = path.join(
        run.screenshots,
        `${fileSlug(route)}-${viewportName}${suffix}.png`,
      );
      await page.screenshot({ path: file, fullPage: true });
      result.screenshot = file;
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  } finally {
    await page.close();
  }
  return result;
}

function failures(result) {
  const reasons = [];
  if (result.error) reasons.push(`load failed: ${result.error.split("\n")[0]}`);
  if (result.status !== null && (result.status < 200 || result.status >= 400))
    reasons.push(`HTTP ${result.status}`);
  if (result.status === null && !result.error) reasons.push("no response");
  if (result.pageErrors.length > 0)
    reasons.push(`${result.pageErrors.length} page error(s)`);
  if (ERROR_HEADINGS.has(result.h1)) reasons.push("error boundary rendered");
  return reasons;
}

function report(result) {
  const reasons = failures(result);
  const verdict = reasons.length === 0 ? "PASS" : "FAIL";
  const status = result.status ?? "---";
  console.log(
    `${verdict}  ${result.viewport.padEnd(7)}  ${String(status).padEnd(3)}  ${result.route}  title="${result.title}"  h1="${result.h1}"`,
  );
  if (result.redirectedFrom)
    console.log(`      redirected from ${result.redirectedFrom}`);
  for (const reason of reasons) console.log(`      ! ${reason}`);
  for (const message of result.pageErrors)
    console.log(`      page error: ${message}`);
  for (const message of result.consoleErrors)
    console.log(`      console error: ${message}`);
  if (result.screenshot) console.log(`      screenshot: ${result.screenshot}`);
  return reasons.length === 0;
}

async function main() {
  const run = readOptions();
  const chromium = await loadChromium();
  if (!chromium) {
    console.error(
      "Playwright is not installed. Run `pnpm install` in the repository root and start this script from there.",
    );
    process.exit(2);
  }
  if (!(await waitForServer(run.base, run.wait))) {
    console.error(
      `Nothing answers at ${run.base} after ${run.wait} s. Start the server first (pnpm build && pnpm start -p 3123).`,
    );
    process.exit(2);
  }
  if (run.screenshots) await mkdir(run.screenshots, { recursive: true });

  let browser;
  try {
    browser = await chromium.launch();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    console.error(
      "\nChromium is missing. Run once: pnpm exec playwright install chromium",
    );
    process.exit(2);
  }

  const theme = run.theme ? ` (theme: ${run.theme})` : "";
  console.log(`Smoke check against ${run.base.origin}${theme}`);
  let passed = 0;
  let total = 0;
  try {
    for (const { name, options } of VIEWPORTS) {
      const context = await browser.newContext({
        ...options,
        colorScheme: run.theme === "dark" ? "dark" : "light",
      });
      if (run.theme) {
        // The site ignores prefers-color-scheme: ThemeToggle reads the
        // `theme` key from localStorage and sets <html data-theme>.
        await context.addInitScript((value) => {
          try {
            window.localStorage.setItem("theme", value);
          } catch {
            // Storage is unavailable on about:blank; nothing to seed there.
          }
        }, run.theme);
      }
      for (const route of run.paths) {
        total += 1;
        if (report(await visit(context, run, route, name))) passed += 1;
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  console.log(`\n${passed}/${total} checks passed.`);
  process.exit(passed === total ? 0 : 1);
}

await main();
