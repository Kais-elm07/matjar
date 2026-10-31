import { ChevronDownIcon } from "lucide-react"

import { RichText } from "@/components/store/rich-text"

export type FaqGroup = {
  title: string | null
  items: { question: string; answer: string }[]
}

/**
 * يقسم نص صفحة الأسئلة: "## " عنوان مجموعة، و"### " سؤال، وما تحته إجابته.
 */
export function parseFaq(body: string): FaqGroup[] {
  const groups: FaqGroup[] = []
  let group: FaqGroup | null = null
  let item: { question: string; answer: string } | null = null

  for (const line of body.split("\n")) {
    if (line.startsWith("## ")) {
      group = { title: line.slice(3).trim(), items: [] }
      groups.push(group)
      item = null
    } else if (line.startsWith("### ")) {
      if (!group) {
        group = { title: null, items: [] }
        groups.push(group)
      }
      item = { question: line.slice(4).trim(), answer: "" }
      group.items.push(item)
    } else if (item) {
      item.answer += `${line}\n`
    }
  }
  return groups.filter((entry) => entry.items.length > 0)
}

/** الأسئلة كقائمة تُفتح وتُطوى، دون JavaScript (عنصر details). */
export function FaqList({ groups }: { groups: FaqGroup[] }) {
  return (
    <div className="space-y-8">
      {groups.map((group, groupIndex) => (
        <section key={group.title ?? groupIndex} className="space-y-3">
          {group.title && <h2 className="text-xl font-bold">{group.title}</h2>}
          <div className="divide-y rounded-lg border">
            {group.items.map((item) => (
              <details key={item.question} className="group/faq faq-item">
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

/** نص الإجابة دون تنسيق، لبيانات FAQPage التي تقرؤها محركات البحث. */
export function plainAnswer(answer: string) {
  return answer
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
}
