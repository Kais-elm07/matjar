import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

/** عنوان قسم في الصفحة، مع رابط "عرض الكل" اختياري بجانبه. */
export function SectionHeading({
  id,
  title,
  href,
  linkLabel = "عرض الكل",
}: {
  id: string
  title: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <h2 id={id} className="text-xl font-bold md:text-2xl">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-0.5 rounded-sm text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {linkLabel}
          <ChevronRightIcon className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      )}
    </div>
  )
}
