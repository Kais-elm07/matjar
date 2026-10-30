/**
 * أدوات النص العربي للبحث والروابط.
 * التطبيع يوحّد أشكال الحروف المتشابهة حتى يجد البحث "أحمر" عند كتابة "احمر".
 */

// التشكيل والحركات وعلامات القرآن
const DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g
const TATWEEL = /\u0640/g

function toWesternDigits(text: string) {
  return text
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
}

/** يزيل التشكيل والتطويل ويحوّل الأرقام العربية إلى 0-9 دون تغيير الحروف. */
export function stripArabicMarks(text: string) {
  return toWesternDigits(
    text.normalize("NFC").replace(DIACRITICS, "").replace(TATWEEL, "")
  )
}

/**
 * تطبيع كامل للبحث: يوحّد الألف والياء والتاء المربوطة والهمزات،
 * ويحوّل الحروف اللاتينية إلى صغيرة، ويستبدل الرموز بمسافات.
 */
export function normalizeForSearch(text: string) {
  return stripArabicMarks(text)
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
}

/**
 * كلمات البحث من نص المستخدم: مطبّعة، بدون تكرار، وبحد أقصى 6 كلمات.
 * تُحذف "ال" التعريف من بداية الكلمة حتى تطابق "القميص" منتجاً اسمه "قميص".
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

/**
 * رابط مقروء من الاسم: "قميص قطني أزرق" يصبح "قميص-قطني-أزرق".
 * يحتفظ بالحروف العربية واللاتينية والأرقام فقط.
 */
export function slugify(text: string) {
  return stripArabicMarks(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "")
}

/** يفك ترميز الرابط إن كان مرمّزاً (مثل %D9%82)، ويعيده كما هو إن لم يكن. */
export function decodeSlug(slug: string) {
  if (!slug.includes("%")) return slug
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}
