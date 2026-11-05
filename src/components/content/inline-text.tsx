import Link from "next/link"

import { parseInline } from "@/lib/content/text-format"

const LINK_CLASS =
  "rounded-sm font-medium text-primary underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

interface InlineTextProps {
  text: string
}

/** Inline formatting: **bold text** and [link text](/pages/contact), parsed in src/lib/content/text-format.ts. */
export function InlineText({ text }: InlineTextProps) {
  return parseInline(text).map((part) => {
    if (part.type === "bold") {
      return (
        <strong key={part.offset} className="font-bold text-foreground">
          {part.text}
        </strong>
      )
    }
    if (part.type === "link") {
      // Links inside the store stay in the same tab, and outside links open in a new one
      return part.href.startsWith("/") ? (
        <Link key={part.offset} href={part.href} className={LINK_CLASS}>
          {part.text}
        </Link>
      ) : (
        <a
          key={part.offset}
          href={part.href}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {part.text}
        </a>
      )
    }
    return part.text
  })
}
