import type { SearchCardData } from "@/lib/catalog/types"
import { normalizeForSearch, toSearchTerms } from "@/lib/search/normalize"

/**
 * Search results sorted by relevance: matches in the name first, then best sellers.
 * Runs in the browser, on the search index (src/app/search-index.json).
 */
export function searchCards<T extends SearchCardData>(
  cards: T[],
  query: string
): T[] {
  const terms = toSearchTerms(query)
  if (terms.length === 0) return []
  const phrase = terms.join(" ")

  return cards
    .filter((card) => terms.every((term) => card.searchText.includes(term)))
    .map((card) => {
      const name = normalizeForSearch(card.name)
      const score =
        (name.startsWith(phrase) ? 6 : 0) +
        (name.includes(phrase) ? 3 : 0) +
        terms.filter((term) => name.includes(term)).length
      return { card, score }
    })
    .sort((a, b) => b.score - a.score || b.card.popularity - a.card.popularity)
    .map(({ card }) => card)
}
