import Link from "next/link"

import { ADMIN_NAV_LINK } from "@/modules/admin/components/admin-styles"
import { siteConfig } from "@/config/site"
import { signOut } from "@/modules/admin/actions"
import { adminPaths } from "@/lib/routes"

/** The admin panel's header: the store name, the panel's links, and signing out. */
export function AdminHeader() {
  return (
    // Pinned to the top from tablets up; on a phone it would take too much of the screen
    <header className="border-b bg-card md:sticky md:top-0 md:z-40">
      <div className="page-container flex min-h-16 flex-wrap items-center gap-x-2 gap-y-1 py-2">
        <Link
          href={adminPaths.products}
          className="me-auto inline-flex h-11 items-center gap-2 font-bold"
        >
          {siteConfig.name}
          <span className="font-normal text-muted-foreground">
            لوحة الإدارة
          </span>
        </Link>
        <nav aria-label="أقسام لوحة الإدارة" className="flex flex-wrap">
          <Link href={adminPaths.products} className={ADMIN_NAV_LINK}>
            المنتجات
          </Link>
          <Link href={adminPaths.categories} className={ADMIN_NAV_LINK}>
            الفئات
          </Link>
          <Link href="/" className={ADMIN_NAV_LINK}>
            عرض المتجر
          </Link>
        </nav>
        <form action={signOut}>
          <button type="submit" className={ADMIN_NAV_LINK}>
            تسجيل الخروج
          </button>
        </form>
      </div>
    </header>
  )
}
