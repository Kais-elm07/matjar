/**
 * السلة والمفضلة تُحفظان في localStorage، وهو غير متاح في Node.
 * نسخة بسيطة في الذاكرة تكفي لاختبار المتجرين.
 */
const items = new Map<string, string>()

const memoryStorage: Storage = {
  get length() {
    return items.size
  },
  clear: () => items.clear(),
  getItem: (key) => items.get(key) ?? null,
  key: (index) => [...items.keys()][index] ?? null,
  removeItem: (key) => {
    items.delete(key)
  },
  setItem: (key, value) => {
    items.set(key, String(value))
  },
}

Object.defineProperty(globalThis, "localStorage", {
  value: memoryStorage,
  configurable: true,
})
