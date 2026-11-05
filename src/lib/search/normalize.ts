import { toWesternDigits } from "@/lib/arabic-digits"

/**
 * Arabic text normalization for search, used for the search text of every product at build time
 * and for what the visitor types in the browser.
 * Normalization unifies similar letter forms, so search finds "أحمر" (red) when someone types "احمر".
 */

// Diacritics, vowel marks and Quranic annotation marks
const DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g
const TATWEEL = /\u0640/g

/**
 * Removes diacritics and tatweel and converts Arabic digits to 0-9 without changing the letters.
 * NFKC turns presentation forms (text copied from PDF files, for example) into regular letters.
 */
function stripArabicMarks(text: string) {
  return toWesternDigits(
    text.normalize("NFKC").replace(DIACRITICS, "").replace(TATWEEL, "")
  )
}

/**
 * Full normalization for search: unifies alif, yaa, taa marbuta and hamza forms,
 * lowercases Latin letters, and replaces symbols with spaces.
 */
export function normalizeForSearch(text: string) {
  return (
    stripArabicMarks(text)
      .replace(/[أإآٱ]/g, "ا")
      // Some keyboards type the Persian yaa and kaf instead of the Arabic ones
      .replace(/[ىی]/g, "ي")
      .replace(/ک/g, "ك")
      .replace(/ة/g, "ه")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim()
  )
}

/**
 * Search terms from the user's text: normalized, without duplicates, and at most 6 words.
 * The definite article "ال" is removed from the start of a word, so "القميص" (the shirt) matches a product named "قميص" (shirt).
 */
export function toSearchTerms(query: string) {
  const terms = normalizeForSearch(query)
    .split(" ")
    .filter(Boolean)
    .map((term) =>
      term.startsWith("ال") && term.length >= 4 ? term.slice(2) : term
    )
  return [...new Set(terms)].slice(0, 6)
}
