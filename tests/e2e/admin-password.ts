/**
 * The admin panel's password in the browser tests only: playwright.config.ts gives the test server its
 * hash. A file of its own, without the "@/" alias, because tools such as knip load the config with it.
 */
export const ADMIN_TEST_PASSWORD = "e2e-admin-password-not-for-production"
