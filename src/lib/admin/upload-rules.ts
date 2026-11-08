/**
 * The rules for a photo uploaded in the admin panel, shared by the upload button, which checks the
 * file before sending it, and the server (src/lib/admin/actions.ts and uploads.ts), which checks it again.
 */

/**
 * The largest file accepted. The Server Action's limit in next.config.ts (bodySizeLimit) leaves room
 * above it for the form's own bytes, and a Netlify function takes a request of up to 6 MB.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

/** The photo types accepted, for the file picker and the server's check */
export const UPLOAD_TYPES = ["image/png", "image/webp", "image/jpeg"]

/** The narrowest photo accepted: narrower ones look blurred in the product's gallery. */
export const MIN_UPLOAD_WIDTH = 600

/** The largest photo in pixels (width × height), so a small file can't unpack into a huge image. */
export const MAX_UPLOAD_PIXELS = 40_000_000

export const UPLOAD_MESSAGES = {
  missing: "اختر صورة لرفعها.",
  tooLarge: "حجم الصورة أكبر من 4 ميغابايت. صغّرها ثم ارفعها من جديد.",
  wrongType: "الصورة يجب أن تكون PNG أو WebP أو JPEG.",
  notAnImage: "تعذّرت قراءة الملف كصورة. جرّب صورة أخرى.",
  tooBig: "أبعاد الصورة كبيرة جداً. صغّرها إلى 4000 بكسل أو أقل ثم ارفعها.",
  narrow: (width: number) =>
    `عرض الصورة ${width} بكسل، وأقل عرض مقبول ${MIN_UPLOAD_WIDTH} بكسل. الأفضل 1200 بكسل أو أكثر.`,
  off: "رفع الصور غير مفعّل: أضف SUPABASE_URL وSUPABASE_SECRET_KEY إلى متغيرات البيئة (DEPLOYMENT.md).",
  storage: (status: number) =>
    `تعذّر حفظ الصورة في التخزين (الرمز ${status}). تأكد من إعداد Supabase Storage كما في DEPLOYMENT.md.`,
  unreachable: "تعذّر الوصول إلى التخزين. حاول مرة أخرى بعد قليل.",
}

/** The problem with a file before it is sent, or null when the server can check it. */
export function uploadFileProblem(file: { size: number; type: string }) {
  if (file.size === 0) return UPLOAD_MESSAGES.missing
  if (!UPLOAD_TYPES.includes(file.type)) return UPLOAD_MESSAGES.wrongType
  if (file.size > MAX_UPLOAD_BYTES) return UPLOAD_MESSAGES.tooLarge
  return null
}
