/**
 * A stable key for a variant's option combination, such as "اللون=أزرق|المقاس=M" (color=blue|size=M), unaffected by field order.
 * Compares two variants or two copies of the data (the saved cart and the published site).
 * In its own small file because the cart needs it on every page, without the color and size tables in options.ts.
 */
export function optionsKey(options: Record<string, string>) {
  return Object.keys(options)
    .sort()
    .map((name) => `${name}=${options[name]}`)
    .join("|")
}
