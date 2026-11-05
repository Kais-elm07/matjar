import { ChevronDownIcon } from "lucide-react"

import { RichText } from "@/components/store/rich-text"

/** `line` is where the question or group starts in the page text (from 1), and is its React key. */
export type FaqItem = { question: string; answer: string; line: number }

export type FaqGroup = {
  title: string | null
  items: FaqItem[]
  line: number
}

/**
 * يقسم نص صفحة الأسئلة: "## " عنوان مجموعة، و"### " سؤال، وما تحته إجابته.
 */
export function parseFaq(body: string): FaqGroup[] {
  const groups: FaqGroup[] = []
  let group: FaqGroup | null = null
  let item: FaqItem | null = null

  for (const [position, text] of body.split("\n").entries()) {
    const line = position + 1
    if (text.startsWith("## ")) {
      group = { title: text.slice(3).trim(), items: [], line }
      groups.push(group)
      item = null
    } else if (text.startsWith("### ")) {
      if (!group) {
        group = { title: null, items: [], line }
        groups.push(group)
      }
      item = { question: text.slice(4).trim(), answer: "", line }
      group.items.push(item)
    } else if (item) {
      item.answer += `${text}\n`
    }
  }
  return groups.filter((entry) => entry.items.length > 0)
}

interface FaqListProps {
  groups: FaqGroup[]
}

/** الأسئلة كقائمة تُفتح وتُطوى، دون JavaScript (عنصر details). */
export function FaqList({ groups }: FaqListProps) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.line} className="space-y-3">
          {group.title && <h2 className="text-xl font-bold">{group.title}</h2>}
          <div className="divide-y rounded-xl border">
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

/** نص الإجابة دون تنسيق، لبيانات FAQPage التي تقرؤها محركات البحث. */
export function plainAnswer(answer: string) {
  return answer
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
}
