import type { PersistStorage } from "zustand/middleware"

import { isFiniteNumber, isRecord } from "@/lib/guards"

/**
 * Safe browser storage for the cart and wishlist.
 *
 * Some browsers block localStorage (blocked cookies, some in-app browsers,
 * and private browsing in older versions), so any access to it throws. A corrupt save (text that is not JSON) stops the restore.
 * This storage never throws: it falls back to an in-memory copy that is enough for the current visit,
 * and deletes a corrupt save instead of leaving the page on the loading skeleton.
 */

const memory = new Map<string, string>()

/** localStorage if it is available and writable, otherwise null. Checked once. */
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
    // Continue with the in-memory copy
  }
  return memory.get(name) ?? null
}

function write(name: string, value: string) {
  memory.set(name, value)
  try {
    browserStorage()?.setItem(name, value)
  } catch {
    // Storage filled up or was blocked during the visit: the visit continues from the in-memory copy,
    // so an older copy left in storage is not read later
    local = null
  }
}

function remove(name: string) {
  memory.delete(name)
  try {
    browserStorage()?.removeItem(name)
  } catch {
    // Nothing else can be done
  }
}

/**
 * Storage for zustand persist that never throws and drops a corrupt save.
 * The saved state comes back as `unknown`, because each store checks its shape in `merge`.
 */
export function safeStorage(): PersistStorage<unknown> {
  return {
    getItem(name) {
      const raw = read(name)
      if (raw === null) return null
      try {
        const saved: unknown = JSON.parse(raw)
        if (isRecord(saved)) {
          return {
            state: saved.state,
            version: isFiniteNumber(saved.version) ? saved.version : undefined,
          }
        }
      } catch {
        // The saved text is not JSON: it is removed below
      }
      remove(name)
      return null
    },
    setItem(name, value) {
      write(name, JSON.stringify(value))
    },
    removeItem: remove,
  }
}

/** For tests only: checks again whether localStorage is available. */
export function resetStorageProbe() {
  local = undefined
  memory.clear()
}
