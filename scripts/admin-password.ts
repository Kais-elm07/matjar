/**
 * Makes the two variables the admin panel needs, from a password the store owner types:
 *
 *   pnpm admin:password
 *
 * It asks for the password twice and prints ADMIN_PASSWORD_HASH (the password's scrypt hash, never the
 * password itself) and a new random ADMIN_SESSION_SECRET. Put both in .env for this machine, and in the
 * host's environment variables for the live site (DEPLOYMENT.md). A new secret signs everyone out.
 * Runs through tsx; the messages are in Arabic, for the store owner.
 */
import { createInterface } from "node:readline/promises"

import { hashPassword, newSessionSecret } from "@/lib/admin/password"

const MIN_LENGTH = 12

async function main() {
  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  try {
    const password = await prompt.question(
      `اكتب كلمة مرور لوحة الإدارة (${MIN_LENGTH} حرفاً على الأقل): `
    )
    if (password.length < MIN_LENGTH) {
      throw new Error(`كلمة المرور قصيرة: ${MIN_LENGTH} حرفاً على الأقل.`)
    }
    const again = await prompt.question("اكتبها مرة أخرى للتأكد: ")
    if (again !== password) throw new Error("الكلمتان غير متطابقتين.")

    console.log("\nضع هذين السطرين في .env وفي متغيرات البيئة على الاستضافة:\n")
    console.log(`ADMIN_PASSWORD_HASH="${hashPassword(password)}"`)
    console.log(`ADMIN_SESSION_SECRET="${newSessionSecret()}"`)
    console.log(
      "\nامسح الشاشة بعد نسخهما. كلمة المرور نفسها لا تُحفظ في أي مكان، فاحتفظ بها عندك."
    )
  } finally {
    prompt.close()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
