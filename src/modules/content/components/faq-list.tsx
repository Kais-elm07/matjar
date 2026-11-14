import { ChevronDownIcon } from "lucide-react"

import { RichText } from "@/components/shared/rich-text"
import type { FaqGroup } from "@/lib/text-format"

interface FaqListProps {
  groups: FaqGroup[]
}

/** The questions as a list that expands and collapses without JavaScript (the details element). */
export function FaqList({ groups }: FaqListProps) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.line} className="space-y-3">
          {group.title && <h2 className="text-xl font-bold">{group.title}</h2>}
          <div className="divide-y rounded-2xl border">
            {group.items.map((item) => (
              <details key={item.line} className="group/faq faq-item">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-bold outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDownIcon
                    className="size-5 shrink-0 text-muted-foreground transition-transform group-open/faq:rotate-180"
                    aria-hidden
                  />
                </summary>
                <RichText text={item.answer} className="px-4 pb-4" />
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
