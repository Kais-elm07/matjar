import { AdminHeader } from "@/components/admin/admin-header"
import { verifyAdmin } from "@/lib/admin/session"

/** The panel's pages: signed in only, under the panel's header. Each page checks the session too. */
export default async function AdminPanelLayout({
  children,
}: LayoutProps<"/admin">) {
  await verifyAdmin()
  return (
    <>
      <AdminHeader />
      <main className="page-container py-6 md:py-8">{children}</main>
    </>
  )
}
