/**
 * How many pieces of one variant an order may hold: the cart in the browser and the server that saves
 * the order apply the same rule, so this file has no React or browser code.
 */

/** Maximum quantity of a single variant in the cart, even if the stock is larger. */
export const MAX_LINE_QUANTITY = 10

/** Maximum quantity allowed for a line, given its stock. */
export function lineLimit(stock: number) {
  return Math.max(0, Math.min(stock, MAX_LINE_QUANTITY))
}
