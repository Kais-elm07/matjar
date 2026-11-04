import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

/** عنوان قسم في الصفحة، مع رابط برتقالي "عرض الكل" اختياري بجانبه، ووصف قصير اختياري تحته. */
export function SectionHeading({
  id,
  title,
  description,
  href,
  linkLabel = "عرض الكل",
}: {
  id: string
  title: string
  description?: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
        <h2 id={id} className="text-2xl font-bold md:text-3xl">
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-0.5 rounded-sm text-sm font-medium text-primary underline-offset-4 transition-colors outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {linkLabel}
            <ChevronRightIcon className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        )}
      </div>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
