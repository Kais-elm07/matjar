import { existsSync } from "node:fs"

import { defineConfig, devices } from "@playwright/test"

const PORT = 3200
const isCI = Boolean(process.env.CI)

// On the development machine the installed Chrome is used instead of downloading Chromium,
// and in GitHub Actions the three browsers are downloaded with playwright install
const chrome = isCI ? {} : { channel: "chrome" }

// Firefox always runs in GitHub Actions, and locally on request: E2E_FIREFOX=1 pnpm test:e2e,
// because Playwright's current build of it doesn't start on some Windows machines (it can't find the mozglue library)
const withFirefox = isCI || Boolean(process.env.E2E_FIREFOX)

// The tests run against the built site; without it, they all fail with confusing 404 errors
if (!existsSync("out/index.html")) {
  throw new Error(
    "No build found in out/. Run pnpm build first, then pnpm test:e2e."
  )
}

/**
 * Browser tests (pnpm test:e2e) on the static build in out/, as it will be published,
 * so run pnpm build before them. Four devices: a desktop with Chrome and Firefox,
 * an Android phone with the Chrome engine (like Samsung Internet), and an iPhone with the Safari engine.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "ar-SA",
    // A trace only on a retry and a screenshot on failure, so the report stays light
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `node node_modules/serve/build/main.js out --listen ${PORT} --no-clipboard`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !isCI,
  },
  projects: [
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"], ...chrome },
    },
    { name: "galaxy-s24", use: { ...devices["Galaxy S24"], ...chrome } },
    { name: "iphone-15", use: { ...devices["iPhone 15"] } },
    ...(withFirefox
      ? [{ name: "desktop-firefox", use: { ...devices["Desktop Firefox"] } }]
      : []),
  ],
})
