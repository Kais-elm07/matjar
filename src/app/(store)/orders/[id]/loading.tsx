import { OrderConfirmationSkeleton } from "@/modules/checkout/components/order-confirmation-skeleton"

/**
 * Shown at once, inside the store's frame, while the server reads the order from the database: the
 * order's page is drawn on every request, so without it the previous page would stay with no sign of
 * loading.
 */
export default function OrderLoading() {
  return (
    <div className="page-container py-8 md:py-12">
      <p role="status" className="sr-only">
        جارٍ تحميل طلبك
      </p>
      <OrderConfirmationSkeleton />
    </div>
  )
}
