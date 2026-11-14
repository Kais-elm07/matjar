"use client"

import { useEffect } from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button, buttonVariants } from "@/components/ui/button"

interface ErrorMessageProps {
  icon: LucideIcon
  title: string
  description: string
  /** What was thrown: written to the browser's console */
  error: unknown
  /** Asks the server for the failed part again (from error.tsx) */
  retry: () => void
}

/**
 * The one look of the store's error pages: what happened, in Arabic, with "حاول مرة أخرى" (Try again)
 * and a link home, inside the store's frame. It also writes the error to the console, so a failure
 * leaves a trace; an error from the server arrives there with its digest, which names it in the
 * server's logs.
 */
export function ErrorMessage({
  icon,
  title,
  description,
  error,
  retry,
}: ErrorMessageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="page-container py-8 md:py-12">
      <EmptyState
        icon={icon}
        title={title}
        description={description}
        className="mx-auto max-w-3xl"
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="cta" size="xl" onClick={() => retry()}>
            حاول مرة أخرى
          </Button>
          <Link href="/" className={buttonVariants({ size: "xl" })}>
            الصفحة الرئيسية
          </Link>
        </div>
      </EmptyState>
    </div>
  )
}
