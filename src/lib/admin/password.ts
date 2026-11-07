import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto"

/**
 * The admin panel's password and session, with Node's own crypto and no extra package.
 *
 * The password is stored only as a scrypt hash (ADMIN_PASSWORD_HASH, made by pnpm admin:password), and
 * the session is a cookie that holds its expiry time signed with ADMIN_SESSION_SECRET (HMAC-SHA256),
 * so the server needs no table of sessions. Both are compared in constant time. Pure functions of their
 * arguments, so the script that makes the hash and the unit tests use them too.
 */

const KEY_LENGTH = 64
const HASH_PREFIX = "scrypt"

const encode = (bytes: Buffer) => bytes.toString("base64url")

/** The text stored in ADMIN_PASSWORD_HASH: scrypt:<salt>:<hash>, both in base64url. */
export function hashPassword(password: string, salt = randomBytes(16)) {
  const hash = scryptSync(password.normalize("NFC"), salt, KEY_LENGTH)
  return `${HASH_PREFIX}:${encode(salt)}:${encode(hash)}`
}

/** Whether the password matches a stored hash; a malformed hash matches nothing. */
export function checkPassword(password: string, stored: string) {
  const [prefix, salt, hash] = stored.trim().split(":")
  if (prefix !== HASH_PREFIX || !salt || !hash) return false
  const expected = Buffer.from(hash, "base64url")
  if (expected.length !== KEY_LENGTH) return false
  const actual = scryptSync(
    password.normalize("NFC"),
    Buffer.from(salt, "base64url"),
    KEY_LENGTH
  )
  return timingSafeEqual(actual, expected)
}

const signature = (secret: string, expiresAt: number) =>
  createHmac("sha256", secret).update(`admin:${expiresAt}`).digest()

/** The session cookie's value: its expiry time (milliseconds since 1970) and its signature. */
export function signSession(secret: string, expiresAt: number) {
  return `${expiresAt}.${encode(signature(secret, expiresAt))}`
}

/** Whether a session cookie was signed with this secret and hasn't expired yet. */
export function isValidSession(
  value: string | undefined,
  secret: string,
  now = Date.now()
) {
  if (!value) return false
  const [time, signed] = value.split(".")
  const expiresAt = Number(time)
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || !signed) {
    return false
  }
  const actual = Buffer.from(signed, "base64url")
  const expected = signature(secret, expiresAt)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

/** A new random secret for ADMIN_SESSION_SECRET. */
export function newSessionSecret() {
  return encode(randomBytes(32))
}
