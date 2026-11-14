import { siteConfig } from "@/config/site"
import { PIECE_FORMS, pluralize } from "@/lib/arabic-plural"
import type { SimilarProduct } from "@/modules/catalog/types"

/** What Najm says in his speech bubble. */
export type MessageContent =
  /** Hello on the home page, once per visit, with a button to hide him */
  | { kind: "greeting" }
  /** After he puts a product in his cart: its name and similar products to add */
  | { kind: "added"; productName: string; suggestions: SimilarProduct[] }
  /** A short sentence */
  | { kind: "note"; text: string }

/** A message on screen; a new id each time, so the bubble pops up again even for the same words. */
export type MascotMessage = MessageContent & { id: number }

/** How long each kind of message stays, in milliseconds, unless the pointer or focus is on the bubble. */
export const MESSAGE_DURATION: Record<MascotMessage["kind"], number> = {
  greeting: 8000,
  added: 12000,
  note: 5000,
}

/** Najm's sentences, in the storefront's Arabic. */
export const mascotPhrases = {
  greeting: `أهلاً بك في ${siteConfig.name}! أنا ${siteConfig.mascotName}، أرافقك في جولتك وأحمل مشترياتك.`,
  shoppingHint: "اختر ما يعجبك، وسأضعه في سلتك.",
  added: (name: string) => `وضعتُ «${name}» في سلتك.`,
  suggestionsTitle: "قد يعجبك معه:",
  removed: (name: string) => `أخرجتُ «${name}» من سلتك.`,
  cart: (pieces: number) =>
    pieces === 0
      ? "سلتك فارغة. سأنتظر أول منتج تختاره."
      : `في سلتك ${pluralize(pieces, PIECE_FORMS)}. جاهز لإتمام الطلب؟`,
  orderPlaced: "مبروك! طلبك في الطريق إليك.",
}
