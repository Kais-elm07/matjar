"use client"

import dynamic from "next/dynamic"

import { Optional } from "@/components/shared/optional"
import { useFirstInteraction } from "@/hooks/use-first-interaction"
import { supportsWebGL2 } from "@/lib/mascot/support"
import { useMascotRestored } from "@/lib/state/hydration"
import { useMascotPreferences } from "@/lib/state/mascot"

const Mascot = dynamic(
  () => import("@/components/mascot/mascot").then((mod) => mod.Mascot),
  { ssr: false }
)

/**
 * Najm's place in every store page. His code, with three.js, is downloaded only after the page has loaded and
 * the visitor first moves, touches or scrolls, and only if the visitor hasn't hidden him and the browser can
 * draw him. Until then, adding to the cart opens the cart panel as before.
 */
export function LazyMascot() {
  const restored = useMascotRestored()
  const hidden = useMascotPreferences((state) => state.hidden)
  const interacted = useFirstInteraction()
  return restored && !hidden && interacted && supportsWebGL2() ? (
    <Optional>
      <Mascot />
    </Optional>
  ) : null
}
