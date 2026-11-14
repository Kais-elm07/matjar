/**
 * The store's small text format, for product descriptions and the static pages in src/content/pages:
 * "## " heading, "### " subheading, "- " bullet, "1. " numbered step, a blank line between paragraphs,
 * **bold text** and [link text](/pages/contact). There is no HTML, so no code can be injected.
 * The components in src/components/content only render what these functions return.
 */

/** `line` is where the block or item starts in the source text (from 1), and is its React key. */
type ListItem = { text: string; line: number }

type TextBlock =
  | { type: "heading"; level: 2 | 3; text: string; line: number }
  | { type: "paragraph"; text: string; line: number }
  | { type: "list"; ordered: boolean; items: ListItem[]; line: number }

const ORDERED_ITEM = /^\d+[.)]\s+/

/** Splits the text into headings, paragraphs and lists. */
export function parseBlocks(text: string): TextBlock[] {
  const blocks: TextBlock[] = []
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

/** A piece of a line. `offset` is where it starts in the line, and is its React key. */
type InlinePart =
  | { type: "text"; text: string; offset: number }
  | { type: "bold"; text: string; offset: number }
  | { type: "link"; text: string; href: string; offset: number }

function toInlinePart(piece: string, offset: number): InlinePart {
  if (piece.startsWith("**") && piece.endsWith("**")) {
    return { type: "bold", text: piece.slice(2, -2), offset }
  }
  const link = piece.match(LINK)
  if (link) {
    const [, text, href] = link
    return { type: "link", text, href, offset }
  }
  return { type: "text", text: piece, offset }
}

/** Splits a line into plain text, **bold text** and [links](/pages/contact). */
export function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = []
  let offset = 0
  for (const piece of text.split(INLINE)) {
    if (piece) parts.push(toInlinePart(piece, offset))
    offset += piece.length
  }
  return parts
}

const plainLine = (text: string) =>
  parseInline(text)
    .map((part) => part.text)
    .join("")

/**
 * The text as one plain line, for search engines: headings and paragraphs as they are, the items
 * of a list joined into one sentence, bold text without its stars and links as their text.
 */
export function toPlainText(text: string) {
  return parseBlocks(text)
    .map((block) =>
      block.type === "list"
        ? `${block.items.map((item) => plainLine(item.text)).join("، ")}.`
        : plainLine(block.text)
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}

/** `line` is where the question or group starts in the page text (from 1), and is its React key. */
export type FaqItem = { question: string; answer: string; line: number }

export type FaqGroup = {
  title: string | null
  items: FaqItem[]
  line: number
}

/** Splits the FAQ page text: "## " is a group title, "### " is a question, and the text under it is its answer. */
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
