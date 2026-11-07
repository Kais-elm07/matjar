import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"

/**
 * Runs once before the browser tests (globalSetup in playwright.config.ts).
 *
 * The tests run against the production server, which needs a build (next start refuses to start
 * without one), so the run stops here with a clear message. The check isn't in playwright.config.ts
 * itself, because tools such as knip read that file before the site is built.
 *
 * Every order a test places lowers the stock in the database, so the catalog is written again from
 * src/data first (pnpm db:seed --force): each run starts from the same stock.
 */
export default function globalSetup() {
  if (!existsSync(".next/BUILD_ID")) {
    throw new Error(
      "No production build found in .next/. Run pnpm build first, then pnpm test:e2e."
    )
  }
  // One command line through the shell: pnpm is a .cmd file on Windows, which only a shell can start
  const seed = spawnSync("pnpm db:seed --force", {
    stdio: "inherit",
    shell: true,
  })
  if (seed.status !== 0) {
    throw new Error(
      "Could not reset the catalog in the database. Start it with pnpm db:start, then pnpm db:deploy."
    )
  }
}
