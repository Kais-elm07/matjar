/**
 * Whether something happens for the first time in this visit (this browser tab), such as Najm's greeting,
 * and marks it as done. Kept in sessionStorage, so a new tab greets again; if storage is blocked, it is
 * remembered for the open page only.
 */
const seen = new Set<string>()

export function firstTimeThisVisit(key: string) {
  const name = `matjar-mascot-${key}`
  if (seen.has(name)) return false
  seen.add(name)
  try {
    if (sessionStorage.getItem(name)) return false
    sessionStorage.setItem(name, "1")
  } catch {
    // Storage is blocked: the in-memory set above is enough for this page
  }
  return true
}
