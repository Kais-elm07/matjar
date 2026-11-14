"use client"

import { useEffect, useRef, type RefObject } from "react"

import { MascotScene } from "@/modules/mascot/scene/mascot-scene"

/**
 * Draws Najm on the canvas while the component is on the page, and frees the graphics card when it leaves.
 * The scene stays null when the browser can't draw him, and then the other mascot hooks do nothing, so adding
 * to the cart opens the cart panel as usual. Call it before those hooks: their effects run after this one.
 */
export function useMascotScene(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const sceneRef = useRef<MascotScene | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const scene = MascotScene.create(canvas, {
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
    })
    sceneRef.current = scene
    return () => {
      scene?.dispose()
      sceneRef.current = null
    }
  }, [canvasRef])

  return sceneRef
}
