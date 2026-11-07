/**
 * A loader for JSON the browser downloads from the site: the products API, and the files prepared at
 * build time (cart-catalog.json, similar-products.json).
 * It is requested once per visit and shared by every caller, and its shape is checked with a
 * type guard, because a broken deploy or an old cached copy shouldn't break the page.
 * A failed request is forgotten, so the next call tries again.
 */
export function jsonLoader<T>(
  url: string,
  isValid: (value: unknown) => value is T,
  init?: RequestInit
) {
  let request: Promise<T> | null = null
  return function load() {
    request ??= fetch(url, init)
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data: unknown = await response.json()
        if (!isValid(data)) throw new Error(`Invalid ${url}`)
        return data
      })
      .catch((error: unknown) => {
        request = null
        throw error
      })
    return request
  }
}
