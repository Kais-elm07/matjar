import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ADMIN_CARD } from "@/modules/admin/components/admin-styles"
import { LoginForm } from "@/modules/admin/components/login-form"
import { siteConfig } from "@/config/site"
import { isAdmin } from "@/modules/admin/session"
import { adminPaths } from "@/lib/routes"

export const metadata: Metadata = { title: "تسجيل الدخول" }

// Reads the session cookie on every request
export const dynamic = "force-dynamic"

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect(adminPaths.products)

  return (
    <main className="page-container flex min-h-dvh items-center justify-center py-10">
      <div className={`${ADMIN_CARD} w-full max-w-sm space-y-6`}>
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-bold md:text-2xl">لوحة الإدارة</h1>
          <p className="text-sm text-muted-foreground">
            {siteConfig.name}: لصاحب المتجر فقط.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
