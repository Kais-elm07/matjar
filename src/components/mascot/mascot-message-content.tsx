import { EyeOffIcon } from "lucide-react"

import { SMALL_TARGET } from "@/components/mascot/mascot-styles"
import { MascotSuggestion } from "@/components/mascot/mascot-suggestion"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { mascotPhrases, type MascotMessage } from "@/lib/mascot/messages"
import { cn } from "@/lib/utils"

interface MascotMessageContentProps {
  message: MascotMessage
  onHide: () => void
  onViewCart: () => void
}

/** What the bubble says, by the kind of message: the greeting, a product just added, or a short note. */
export function MascotMessageContent({
  message,
  onHide,
  onViewCart,
}: MascotMessageContentProps) {
  switch (message.kind) {
    case "greeting":
      return (
        <>
          <p>{mascotPhrases.greeting}</p>
          <Button
            variant="outline"
            size="lg"
            className={cn("mt-2", SMALL_TARGET)}
            onClick={onHide}
          >
            <EyeOffIcon data-icon="inline-start" aria-hidden />
            إخفاء {siteConfig.mascotName}
          </Button>
        </>
      )
    case "added":
      return (
        <>
          <p className="font-medium">
            {mascotPhrases.added(message.productName)}
          </p>
          {message.suggestions.length > 0 && (
            <>
              <p className="mt-2 text-xs text-muted-foreground">
                {mascotPhrases.suggestionsTitle}
              </p>
              <ul className="mt-2 space-y-2.5">
                {message.suggestions.map((product) => (
                  <MascotSuggestion key={product.slug} product={product} />
                ))}
              </ul>
            </>
          )}
          <Button
            size="lg"
            className={cn("mt-3 w-full", SMALL_TARGET)}
            onClick={onViewCart}
          >
            عرض السلة
          </Button>
        </>
      )
    case "note":
      return <p>{message.text}</p>
  }
}
