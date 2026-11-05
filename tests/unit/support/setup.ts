/**
 * The cart and wishlist are saved in localStorage, which isn't available in Node.
 * A simple in-memory version is enough to test the two stores.
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
