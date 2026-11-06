import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

interface SectionHeadingProps {
  id: string
  title: string
  href?: string
  linkLabel?: string
}

/** A section heading on the page, with an optional blue "عرض الكل" (View all) link beside it. */
export function SectionHeading({
  id,
  title,
  href,
  linkLabel = "عرض الكل",
}: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
      <h2 id={id} className="text-2xl font-bold md:text-3xl">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          // The vertical padding makes a 44 px touch target, and the negative margin keeps the row's height
          className="-my-3 inline-flex items-center gap-0.5 rounded-sm py-3 text-sm font-medium text-primary underline-offset-4 transition-colors outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {linkLabel}
          <ChevronRightIcon className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      )}
    </div>
  )
}
