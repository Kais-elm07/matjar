import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { OrderConfirmation } from "@/components/checkout/order-confirmation"
import { getOrder } from "@/lib/checkout/orders"

export const metadata: Metadata = {
  title: "تم تأكيد طلبك",
  robots: { index: false, follow: false },
}

// Read from the database on every request: an order page is never prepared at build time or cached
export const dynamic = "force-dynamic"

/**
 * An order's confirmation page. Its address holds the order's long id, which can't be guessed, so only
 * whoever has the link sees the order; any other id gets the 404 page.
 */
export default async function OrderPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) notFound()

  return (
    <div className="page-container py-8 md:py-12">
      <h1 className="sr-only">تأكيد الطلب</h1>
      <OrderConfirmation order={order} />
    </div>
  )
}
