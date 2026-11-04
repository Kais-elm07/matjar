import type { PersistStorage, StorageValue } from "zustand/middleware"

/**
 * تخزين السلة والمفضلة في المتصفح بأمان.
 *
 * بعض المتصفحات تمنع localStorage (حظر ملفات تعريف الارتباط، وبعض المتصفحات داخل التطبيقات،
 * والتصفح الخاص في نسخ قديمة)، فيرمي أي وصول إليه خطأً. ومحفوظ تالف (نص ليس JSON) يوقف الاستعادة.
 * هذا التخزين لا يرمي أي خطأ: يرجع إلى نسخة في الذاكرة تكفي للزيارة الحالية،
 * ويحذف المحفوظ التالف بدل أن تبقى الصفحة على هيكل التحميل.
 */

const memory = new Map<string, string>()

/** localStorage إن كان متاحاً وقابلاً للكتابة، وإلا null. يُفحص مرة واحدة. */
let local: Storage | null | undefined

function browserStorage() {
  if (local !== undefined) return local
  try {
    const probe = "__matjar_probe__"
    globalThis.localStorage.setItem(probe, probe)
    globalThis.localStorage.removeItem(probe)
    local = globalThis.localStorage
  } catch {
    local = null
  }
  return local
}

function read(name: string) {
  try {
    const storage = browserStorage()
    if (storage) return storage.getItem(name)
  } catch {
    // يُكمل بالنسخة في الذاكرة
  }
  return memory.get(name) ?? null
}

function write(name: string, value: string) {
  memory.set(name, value)
  try {
    browserStorage()?.setItem(name, value)
  } catch {
    // امتلأ التخزين أو مُنع أثناء الزيارة: تكمل الزيارة من النسخة في الذاكرة،
    // حتى لا تُقرأ لاحقاً نسخة أقدم بقيت في التخزين
    local = null
  }
}

function remove(name: string) {
  memory.delete(name)
  try {
    browserStorage()?.removeItem(name)
  } catch {
    // لا شيء آخر يمكن فعله
  }
}

/** تخزين لـ zustand persist لا يرمي أخطاء، ويتجاهل المحفوظ التالف. */
export function safeStorage<State>(): PersistStorage<State> {
  return {
    getItem(name) {
      const raw = read(name)
      if (raw === null) return null
      try {
        return JSON.parse(raw) as StorageValue<State>
      } catch {
        remove(name)
        return null
      }
    },
    setItem(name, value) {
      write(name, JSON.stringify(value))
    },
    removeItem: remove,
  }
}

/** للاختبارات فقط: يعيد فحص توفر localStorage من جديد. */
export function resetStorageProbe() {
  local = undefined
  memory.clear()
}
