import Link from "next/link"

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

interface InlineTextProps {
  text: string
}

/** تنسيق داخل السطر: **نص عريض** و[نص الرابط](/pages/contact). */
export function InlineText({ text }: InlineTextProps) {
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
