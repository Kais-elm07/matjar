import { describe, expect, it } from "vitest"

import {
  checkPassword,
  hashPassword,
  isValidSession,
  newSessionSecret,
  signSession,
} from "@/modules/admin/password"

/** The admin panel's password hash and signed session cookie (src/modules/admin/password.ts). */

describe("the admin password", () => {
  const stored = hashPassword("كلمة سر طويلة 2026")

  it("matches only the same password", () => {
    expect(stored.startsWith("scrypt:")).toBe(true)
    expect(checkPassword("كلمة سر طويلة 2026", stored)).toBe(true)
    expect(checkPassword("كلمة سر طويلة 2027", stored)).toBe(false)
    expect(checkPassword("", stored)).toBe(false)
  })

  it("salts every hash, so the same password gives a different hash", () => {
    expect(hashPassword("x")).not.toBe(hashPassword("x"))
  })

  it("refuses a malformed stored hash instead of throwing", () => {
    expect(checkPassword("x", "")).toBe(false)
    expect(checkPassword("x", "plain-text")).toBe(false)
    expect(checkPassword("x", "scrypt:abc:short")).toBe(false)
  })
})

describe("the session cookie", () => {
  const secret = newSessionSecret()
  const now = Date.parse("2026-11-07T12:00:00Z")
  const inAWeek = now + 7 * 24 * 60 * 60 * 1000

  it("is valid until it expires, with the secret that signed it", () => {
    const cookie = signSession(secret, inAWeek)
    expect(isValidSession(cookie, secret, now)).toBe(true)
    expect(isValidSession(cookie, secret, inAWeek + 1)).toBe(false)
    expect(isValidSession(cookie, newSessionSecret(), now)).toBe(false)
  })

  it("refuses a cookie whose time was changed, or that isn't one", () => {
    const [, signed] = signSession(secret, inAWeek).split(".")
    expect(isValidSession(`${inAWeek + 1000}.${signed}`, secret, now)).toBe(
      false
    )
    expect(isValidSession(undefined, secret, now)).toBe(false)
    expect(isValidSession("garbage", secret, now)).toBe(false)
    expect(isValidSession(`${inAWeek}.`, secret, now)).toBe(false)
  })
})
