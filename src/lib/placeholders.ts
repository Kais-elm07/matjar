/**
 * Ids for loading placeholders. A skeleton has no data of its own to take a key from,
 * so each placeholder gets a fixed id, such as "product-1", to use as its React key.
 */
export function placeholderIds(prefix: string, count: number) {
  return Array.from(
    { length: count },
    (_, position) => `${prefix}-${position + 1}`
  )
}
