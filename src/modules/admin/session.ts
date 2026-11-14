import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"

import { siteConfig } from "@/config/site"
import {
  checkPassword,
  isValidSession,
  signSession,
} from "@/modules/admin/password"
import { adminPaths } from "@/lib/routes"

/**
 * The admin panel's session: one password for the store owner, and a signed cookie that lasts a week.
 * Every admin page calls verifyAdmin() and every admin Server Action calls isAdmin() itself, next to
 * the data, as Next.js recommends; there is no proxy in front of the pages.
 */

const COOKIE = "matjar_admin"
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

/** The two variables the panel needs, or null when the store owner hasn't set them. */
function adminSettings() {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim()
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()
  return passwordHash && secret ? { passwordHash, secret } : null
}

/** Whether the panel can be used at all: both variables are set. */
export function isAdminEnabled() {
  return adminSettings() !== null
}

/** Signs the store owner in when the password is right; the answer says only whether it was. */
export async function startSession(password: string) {
  const settings = adminSettings()
  if (!settings || !checkPassword(password, settings.passwordHash)) {
    return false
  }
  const expiresAt = Date.now() + WEEK_MS
  ;(await cookies()).set(COOKIE, signSession(settings.secret, expiresAt), {
    httpOnly: true,
    // Over HTTPS only on the live site; the local server and the tests run on http://localhost
    secure: siteConfig.url.startsWith("https://"),
    sameSite: "lax",
    path: "/admin",
    expires: expiresAt,
  })
  return true
}

export async function endSession() {
  ;(await cookies()).delete({ name: COOKIE, path: "/admin" })
}

/** Whether the request comes from the signed-in store owner. */
export async function isAdmin() {
  const settings = adminSettings()
  if (!settings) return false
  return isValidSession((await cookies()).get(COOKIE)?.value, settings.secret)
}

/** For every admin page: sends anyone who isn't signed in to the sign-in page. Once per render. */
export const verifyAdmin = cache(async () => {
  if (!(await isAdmin())) redirect(adminPaths.signIn)
})
