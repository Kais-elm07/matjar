import { existsSync } from "node:fs"

/**
 * Runs once before the browser tests (globalSetup in playwright.config.ts). The tests run against
 * the built site, and without it they would all fail with confusing 404 errors, so the run stops
 * here with a clear message. The check isn't in playwright.config.ts itself, because tools such as
 * knip read that file before the site is built.
 */
export default function globalSetup() {
  if (!existsSync("out/index.html")) {
    throw new Error(
      "No build found in out/. Run pnpm build first, then pnpm test:e2e."
    )
  }
}
