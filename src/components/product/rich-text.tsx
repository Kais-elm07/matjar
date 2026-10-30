import { cn } from "@/lib/utils"

type Block =
  { type: "paragraph"; text: string } | { type: "list"; items: string[] }

/** تحويل نص الوصف إلى فقرات وقوائم: الأسطر التي تبدأ بـ "- " تصبح نقاطاً. */
function parseBlocks(text: string): Block[] {
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
      if (line.startsWith("- ")) {
        flush()
        const last = blocks.at(-1)
        if (last?.type === "list") last.items.push(line.slice(2))
        else blocks.push({ type: "list", items: [line.slice(2)] })
      } else {
        paragraph.push(line)
      }
    }
    flush()
  }
  return blocks
}

export function RichText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <div className={cn("space-y-3 leading-8 text-foreground/90", className)}>
      {parseBlocks(text).map((block, index) =>
        block.type === "list" ? (
          <ul
            key={index}
            className="list-disc space-y-1 ps-5 marker:text-primary"
          >
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={index}>{block.text}</p>
        )
      )}
    </div>
  )
}
