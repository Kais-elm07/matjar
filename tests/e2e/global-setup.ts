import { existsSync } from "node:fs"

/**
 * Runs once before the browser tests (globalSetup in playwright.config.ts). The tests run against
 * production server, which needs a build (next start refuses to start without one), so the run stops
 * here with a clear message. The check isn't in playwright.config.ts itself, because tools such as
 * knip read that file before the site is built.
 */
export default function globalSetup() {
  if (!existsSync(".next/BUILD_ID")) {
    throw new Error(
      "No production build found in .next/. Run pnpm build first, then pnpm test:e2e."
    )
  }
}
