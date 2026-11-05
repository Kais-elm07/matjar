"use client"

import { useSyncExternalStore } from "react"
import dynamic from "next/dynamic"

import { useIdle } from "@/hooks/use-idle"
import { markToasterMounted, toasterRequest } from "@/lib/toast"

const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((mod) => mod.Toaster),
  { ssr: false }
)

/**
 * Short toast messages: their code loads after the page appears, or with the first message if sooner.
 * Messages sent before that wait in src/lib/toast.ts until the toast list has mounted.
 */
export function LazyToaster() {
  const idle = useIdle()
  const requested = useSyncExternalStore(
    toasterRequest.subscribe,
    toasterRequest.get,
    () => false
  )
  return idle || requested ? <Toaster onMount={markToasterMounted} /> : null
}
