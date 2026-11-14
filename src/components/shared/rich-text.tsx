import { InlineText } from "@/components/shared/inline-text"
import { parseBlocks } from "@/lib/text-format"
import { cn } from "@/lib/utils"

interface RichTextProps {
  text: string
  className?: string
}

/** Formatted text for product descriptions and static pages, in the format of src/lib/text-format.ts. */
export function RichText({ text, className }: RichTextProps) {
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
