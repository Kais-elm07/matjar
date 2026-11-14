import { AdminPageSkeleton } from "@/modules/admin/components/admin-page-skeleton"

/**
 * Shown at once under the panel's header while a page reads the database (every panel page is drawn
 * on request): the products, the categories and a product's form.
 */
export default function AdminLoading() {
  return (
    <>
      <p role="status" className="sr-only">
        جارٍ التحميل
      </p>
      <AdminPageSkeleton />
    </>
  )
}
