"use client"

import { useSyncExternalStore } from "react"
import dynamic from "next/dynamic"

import { toasterRequest } from "@/lib/toast"
import { useIdle } from "@/lib/use-idle"

const DeferredToaster = dynamic(
  () =>
    import("@/components/store/deferred-toaster").then(
      (mod) => mod.DeferredToaster
    ),
  { ssr: false }
)

/** رسائل التنبيه القصيرة: يُحمَّل كودها بعد ظهور الصفحة، أو مع أول رسالة إن سبقت ذلك. */
export function LazyToaster() {
  const idle = useIdle()
  const requested = useSyncExternalStore(
    toasterRequest.subscribe,
    toasterRequest.get,
    () => false
  )
  return idle || requested ? <DeferredToaster /> : null
}
