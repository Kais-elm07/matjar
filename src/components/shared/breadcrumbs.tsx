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

type BreadcrumbEntry = { name: string; href?: string }

/** A 44 px touch target from vertical padding; the negative margin keeps the trail's height. */
const LINK = "-my-3 py-3"

interface BreadcrumbsProps {
  items: BreadcrumbEntry[]
  className?: string
}

/** The breadcrumb trail: Home ‹ category ‹ current page. */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <Breadcrumb className={cn("mb-5", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/" />} className={LINK}>
            الرئيسية
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item) => (
          <Fragment key={`${item.name}-${item.href ?? ""}`}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink
                  render={<Link href={item.href} />}
                  className={LINK}
                >
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
