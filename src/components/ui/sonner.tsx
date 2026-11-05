"use client"

import { useEffect } from "react"
import { Toaster as Sonner, type ToasterProps as SonnerProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

interface ToasterProps extends SonnerProps {
  /**
   * Called once the toast list has mounted. Sonner subscribes to the messages in its own effect,
   * and a child's effects run before its parent's, so from then on it receives every message.
   */
  onMount?: () => void
}

const Toaster = ({ onMount, ...props }: ToasterProps) => {
  useEffect(() => {
    onMount?.()
  }, [onMount])

  return (
    <Sonner
      // The store's identity is dark, so the toasts are dark, in the surface colors
      theme="dark"
      dir="rtl"
      position="top-center"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      }}
      {...props}
    />
  )
}

export { Toaster }
