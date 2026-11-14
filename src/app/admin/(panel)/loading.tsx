import { AdminPageSkeleton } from "@/modules/admin/components/admin-page-skeleton"

/**
 * Shown at once under the panel's header while a page reads the database (every panel page is drawn
 * on request): the products, the categories and a product's form.
 *
 * Once this skeleton has streamed, the answer's status is 200, so an unknown product's address in the
 * panel shows the 404 page with a 200 status. That is fine for the owner's private panel, which search
 * engines never see; the store's own pages that call notFound() have no loading.tsx for this reason.
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
