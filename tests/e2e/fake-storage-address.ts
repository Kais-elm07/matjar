/**
 * Where the browser tests' stand-in for Supabase Storage listens (tests/e2e/fake-storage.ts), and the
 * key the store sends it: test values only, given to the test server by playwright.config.ts. A file
 * of its own, without the "@/" alias, because tools such as knip load the config with it.
 */
export const FAKE_STORAGE_PORT = 3201

export const FAKE_STORAGE_URL = `http://localhost:${FAKE_STORAGE_PORT}`

export const FAKE_STORAGE_KEY = "e2e-storage-key-not-for-production"
