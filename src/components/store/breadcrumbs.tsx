import { Fragment } from "react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

export type BreadcrumbEntry = { name: string; href?: string }

/** مسار التنقل: الرئيسية ‹ الفئة ‹ الصفحة الحالية. */
export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbEntry[]
  className?: string
}) {
  return (
    <Breadcrumb className={cn("mb-5", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/" />}>الرئيسية</BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item) => (
          <Fragment key={`${item.name}-${item.href ?? ""}`}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink render={<Link href={item.href} />}>
                  {item.name}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="line-clamp-1">
                  {item.name}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
