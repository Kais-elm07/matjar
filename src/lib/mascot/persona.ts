/**
 * How Najm behaves on each page (DESIGN.md: Mascot):
 * - welcome: the home page; he greets the visitor once per visit, without his cart.
 * - shopping: product lists, search, product pages and the wishlist; his cart stands beside him.
 * - cart: the cart page; he says what is in the cart.
 * - checkout: the checkout form; he stays quiet so he doesn't cover the fields.
 * - order-placed: the confirmation page; he celebrates and sends the cart off with the order.
 * - elsewhere: the help pages and the 404 page; he just keeps the visitor company.
 */
type Persona =
  "welcome" | "shopping" | "cart" | "checkout" | "order-placed" | "elsewhere"

const SHOPPING_PAGES = [
  "/products",
  "/category/",
  "/product/",
  "/search",
  "/wishlist",
]

/** The persona for a page address. The store's addresses end with a slash, which is ignored. */
export function personaFor(pathname: string): Persona {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
  if (path === "/") return "welcome"
  if (path === "/cart") return "cart"
  if (path === "/checkout") return "checkout"
  if (path === "/checkout/success") return "order-placed"
  if (SHOPPING_PAGES.some((page) => path.startsWith(page))) return "shopping"
  return "elsewhere"
}

/** Whether Najm's cart stands beside him on a page with this persona. */
export function showsCart(persona: Persona) {
  return persona !== "welcome" && persona !== "elsewhere"
}
