"use client"

import { useCallback, useEffect, useState } from "react"

import {
  MESSAGE_DURATION,
  type MascotMessage,
  type MessageContent,
} from "@/lib/mascot/messages"

let nextId = 1

/**
 * Najm's speech bubble: one message at a time, which closes by itself after a while (MESSAGE_DURATION),
 * except while the pointer or the keyboard focus is on it, so the visitor can read it and use its buttons.
 * A message belongs to its page, so it closes when the visitor moves to another page (`pathname`).
 */
export function useMascotBubble(pathname: string) {
  const [message, setMessage] = useState<MascotMessage | null>(null)
  const [held, setHeld] = useState(false)
  const [page, setPage] = useState(pathname)

  // Reset while rendering, React's way to clear state when an input changes, without an extra render pass
  if (page !== pathname) {
    setPage(pathname)
    setMessage(null)
    setHeld(false)
  }

  useEffect(() => {
    if (!message || held) return
    const timer = setTimeout(
      () => setMessage(null),
      MESSAGE_DURATION[message.kind]
    )
    return () => clearTimeout(timer)
  }, [message, held])

  const say = useCallback((content: MessageContent) => {
    setMessage({ ...content, id: nextId++ })
    setHeld(false)
  }, [])

  const close = useCallback(() => {
    setMessage(null)
    setHeld(false)
  }, [])

  return { message, say, close, setHeld }
}
