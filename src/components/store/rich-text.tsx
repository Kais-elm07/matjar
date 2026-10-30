import Link from "next/link"

import { cn } from "@/lib/utils"

type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }

const ORDERED_ITEM = /^\d+[.)]\s+/

/**
 * تحويل نص بسيط إلى فقرات وعناوين وقوائم:
 * "## " عنوان، و"### " عنوان فرعي، و"- " نقطة، و"1. " خطوة مرقمة، والسطر الفارغ يفصل الفقرات.
 */
export function parseBlocks(text: string): Block[] {
  const blocks: Block[] = []
  for (const chunk of text.split(/\n\s*\n/)) {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
    let paragraph: string[] = []
    const flush = () => {
      if (paragraph.length)
        blocks.push({ type: "paragraph", text: paragraph.join(" ") })
      paragraph = []
    }
    for (const line of lines) {
      const ordered = ORDERED_ITEM.test(line)
      if (line.startsWith("## ") || line.startsWith("### ")) {
        flush()
        const level = line.startsWith("### ") ? 3 : 2
        blocks.push({ type: "heading", level, text: line.slice(level + 1) })
      } else if (line.startsWith("- ") || ordered) {
        flush()
        const item = ordered ? line.replace(ORDERED_ITEM, "") : line.slice(2)
        const last = blocks.at(-1)
        if (last?.type === "list" && last.ordered === ordered) {
          last.items.push(item)
        } else {
          blocks.push({ type: "list", ordered, items: [item] })
        }
      } else {
        paragraph.push(line)
      }
    }
    flush()
  }
  return blocks
}

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/

/** تنسيق داخل السطر: **نص عريض** و[نص الرابط](/pages/contact). */
export function InlineText({ text }: { text: string }) {
  return text.split(INLINE).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    const link = part.match(LINK)
    if (link) {
      const [, label, href] = link
      const className =
        "rounded-sm font-medium text-primary underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      return href.startsWith("/") ? (
        <Link key={index} href={href} className={className}>
          {label}
        </Link>
      ) : (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {label}
        </a>
      )
    }
    return part
  })
}

/** نص منسق لأوصاف المنتجات والصفحات الثابتة، دون HTML حتى لا يُحقن أي كود. */
export function RichText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <div className={cn("space-y-3 leading-8 text-foreground/90", className)}>
      {parseBlocks(text).map((block, index) => {
        if (block.type === "heading") {
          const Heading = block.level === 2 ? "h2" : "h3"
          return (
            <Heading
              key={index}
              className={cn(
                "font-bold text-foreground",
                block.level === 2 ? "pt-4 text-xl" : "pt-2 text-lg"
              )}
            >
              <InlineText text={block.text} />
            </Heading>
          )
        }
        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul"
          return (
            <List
              key={index}
              className={cn(
                "space-y-1 ps-5 marker:text-primary",
                block.ordered ? "list-decimal marker:font-bold" : "list-disc"
              )}
            >
              {block.items.map((item) => (
                <li key={item}>
                  <InlineText text={item} />
                </li>
              ))}
            </List>
          )
        }
        return (
          <p key={index}>
            <InlineText text={block.text} />
          </p>
        )
      })}
    </div>
  )
}
