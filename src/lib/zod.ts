import { z } from "zod"

/**
 * Zod with the store's two settings, applied once before any rule is made. Import z from here, not
 * from "zod" (ESLint enforces it).
 * - Arabic messages for the rules that have no message of their own, because the store owner and the
 *   visitors read them.
 * - No `new Function`: Zod tries it to check data faster, and the site's content security policy
 *   (next.config.ts) blocks eval outside development, so the browser would report a violation.
 */
z.config(z.locales.ar())
z.config({ jitless: true })

export { z }
