import Link from "next/link"

import { cn } from "@/lib/utils"

/** `line` is where the block or item starts in the source text (from 1), and is its React key. */
type ListItem = { text: string; line: number }

type Block =
  | { type: "heading"; level: 2 | 3; text: string; line: number }
  | { type: "paragraph"; text: string; line: number }
  | { type: "list"; ordered: boolean; items: ListItem[]; line: number }

const ORDERED_ITEM = /^\d+[.)]\s+/

/**
 * تحويل نص بسيط إلى فقرات وعناوين وقوائم:
 * "## " عنوان، و"### " عنوان فرعي، و"- " نقطة، و"1. " خطوة مرقمة، والسطر الفارغ يفصل الفقرات.
 */
export function parseBlocks(text: string): Block[] {
  const blocks: Block[] = []
  let paragraph: string[] = []
  let paragraphLine = 0
  const flush = () => {
    if (paragraph.length) {
      blocks.push({
        type: "paragraph",
        text: paragraph.join(" "),
        line: paragraphLine,
      })
    }
    paragraph = []
  }
  for (const [position, raw] of text.split("\n").entries()) {
    const line = position + 1
    const content = raw.trim()
    if (!content) {
      flush()
      continue
    }
    const ordered = ORDERED_ITEM.test(content)
    if (content.startsWith("## ") || content.startsWith("### ")) {
      flush()
      const level = content.startsWith("### ") ? 3 : 2
      blocks.push({
        type: "heading",
        level,
        text: content.slice(level + 1),
        line,
      })
    } else if (content.startsWith("- ") || ordered) {
      flush()
      const item = {
        text: ordered ? content.replace(ORDERED_ITEM, "") : content.slice(2),
        line,
      }
      const last = blocks.at(-1)
      if (last?.type === "list" && last.ordered === ordered) {
        last.items.push(item)
      } else {
        blocks.push({ type: "list", ordered, items: [item], line })
      }
    } else {
      if (paragraph.length === 0) paragraphLine = line
      paragraph.push(content)
    }
  }
  flush()
  return blocks
}

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/

/** The text split into plain text, bold and links, each with where it starts in the line. */
function inlineParts(text: string) {
  const parts: { text: string; offset: number }[] = []
  let offset = 0
  for (const part of text.split(INLINE)) {
    if (part) parts.push({ text: part, offset })
    offset += part.length
  }
  return parts
}

/** تنسيق داخل السطر: **نص عريض** و[نص الرابط](/pages/contact). */
function InlineText({ text }: { text: string }) {
  return inlineParts(text).map(({ text: part, offset }) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={offset} className="font-bold text-foreground">
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
        <Link key={offset} href={href} className={className}>
          {label}
        </Link>
      ) : (
        <a
          key={offset}
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
      {parseBlocks(text).map((block) => {
        if (block.type === "heading") {
          const Heading = block.level === 2 ? "h2" : "h3"
          return (
            <Heading
              key={block.line}
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
              key={block.line}
              className={cn(
                "space-y-1 ps-5 marker:text-primary",
                block.ordered ? "list-decimal marker:font-bold" : "list-disc"
              )}
            >
              {block.items.map((item) => (
                <li key={item.line}>
                  <InlineText text={item.text} />
                </li>
              ))}
            </List>
          )
        }
        return (
          <p key={block.line}>
            <InlineText text={block.text} />
          </p>
        )
      })}
    </div>
  )
}
