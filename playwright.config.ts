import { defineConfig, devices } from "@playwright/test"

import { hashPassword, newSessionSecret } from "./src/lib/admin/password"
import { ADMIN_TEST_PASSWORD } from "./tests/e2e/admin-password"
import {
  FAKE_STORAGE_KEY,
  FAKE_STORAGE_PORT,
  FAKE_STORAGE_URL,
} from "./tests/e2e/fake-storage-address"

const PORT = 3200
const isCI = Boolean(process.env.CI)

// On the development machine the installed Chrome is used instead of downloading Chromium,
// and in GitHub Actions the three browsers are downloaded with playwright install
const chrome = isCI ? {} : { channel: "chrome" }

// Firefox always runs in GitHub Actions, and locally on request: E2E_FIREFOX=1 pnpm test:e2e,
// because Playwright's current build of it doesn't start on some Windows machines (it can't find the mozglue library)
const withFirefox = isCI || Boolean(process.env.E2E_FIREFOX)

/**
 * Browser tests (pnpm test:e2e) on the production server (next start), as it will be published,
 * so run pnpm build before them. Four devices: a desktop with Chrome and Firefox,
 * an Android phone with the Chrome engine (like Samsung Internet), and an iPhone with the Safari engine.
 */
export default defineConfig({
  testDir: "tests/e2e",
  // Stops the run with a clear message when there is no production build in .next/
  globalSetup: "./tests/e2e/global-setup.ts",
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
    // Every test starts with Najm, the mascot, hidden (the visitor's saved choice), so adding to the cart
    // opens the cart panel; tests/e2e/mascot.spec.ts starts without it, to test Najm himself
    storageState: {
      cookies: [],
      origins: [
        {
          origin: `http://localhost:${PORT}`,
          localStorage: [
            {
              name: "matjar-mascot",
              value: JSON.stringify({ state: { hidden: true }, version: 1 }),
            },
          ],
        },
      ],
    },
  },
  webServer: [
    {
      command: `node node_modules/next/dist/bin/next start --port ${PORT}`,
      // Ready as soon as the port answers. Waiting for the home page instead would time out
      // without a build, before global-setup.ts can say what is missing
      port: PORT,
      reuseExistingServer: !isCI,
      // The admin panel's variables for this run only, made from the tests' own password, so no real
      // password or hash is written anywhere in the project; and the uploads go to the fake storage
      env: {
        ADMIN_PASSWORD_HASH: hashPassword(ADMIN_TEST_PASSWORD),
        ADMIN_SESSION_SECRET: newSessionSecret(),
        SUPABASE_URL: FAKE_STORAGE_URL,
        SUPABASE_SECRET_KEY: FAKE_STORAGE_KEY,
      },
    },
    {
      // A stand-in for Supabase Storage, for the photos uploaded in the admin panel's test
      command: "node node_modules/tsx/dist/cli.mjs tests/e2e/fake-storage.ts",
      port: FAKE_STORAGE_PORT,
      reuseExistingServer: !isCI,
    },
  ],
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
