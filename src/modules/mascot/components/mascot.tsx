"use client"

import { usePathname } from "next/navigation"
import { useRef } from "react"

import { MascotBubble } from "@/modules/mascot/components/mascot-bubble"
import { MascotMessageContent } from "@/modules/mascot/components/mascot-message-content"
import { useAddedProducts } from "@/modules/mascot/components/use-added-products"
import { useBasketRemovals } from "@/modules/mascot/components/use-basket-removals"
import { useMascotBubble } from "@/modules/mascot/components/use-mascot-bubble"
import { useMascotPersona } from "@/modules/mascot/components/use-mascot-persona"
import { useMascotScene } from "@/modules/mascot/components/use-mascot-scene"
import { siteConfig } from "@/config/site"
import { useMascotPreferences } from "@/modules/mascot/store"
import { useUiStore } from "@/lib/state/ui"

/**
 * Najm, the store's 3D mascot (DESIGN.md: Mascot), fixed in the corner of the screen on the start side, above the
 * mobile bottom bar, with his speech bubble beside him. The canvas has no background and lets the pointer through,
 * so he never blocks the page; only the bubble takes clicks. Loaded by LazyMascot.
 */
export function Mascot() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // The scene first: the effects of the hooks after it use it
  const sceneRef = useMascotScene(canvasRef)
  const { message, say, close, setHeld } = useMascotBubble(usePathname())
  useMascotPersona(sceneRef, say)
  useBasketRemovals(sceneRef, say)
  useAddedProducts(sceneRef, say)
  const setHidden = useMascotPreferences((state) => state.setHidden)
  const setCartOpen = useUiStore((state) => state.setCartOpen)

  return (
    <div className="pointer-events-none fixed start-1 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 flex items-end md:start-3 md:bottom-1">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="h-36 w-34 shrink-0 md:h-52 md:w-50"
      />
      {/* Always in the page, so screen readers announce each new message */}
      <div
        role="status"
        aria-label={siteConfig.mascotName}
        className="-ms-3 mb-20 md:-ms-6 md:mb-28"
      >
        {message && (
          <MascotBubble key={message.id} onClose={close} onHoldChange={setHeld}>
            <MascotMessageContent
              message={message}
              onHide={() => setHidden(true)}
              onViewCart={() => {
                close()
                setCartOpen(true)
              }}
            />
          </MascotBubble>
        )}
      </div>
    </div>
  )
}
