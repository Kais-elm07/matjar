import { expect, type APIRequestContext, type Page } from "@playwright/test"

import { isCartCatalog, isProductsResponse } from "../../src/lib/catalog/guards"
import type { SearchCardData } from "../../src/lib/catalog/types"
import { productsApiPath } from "../../src/lib/routes"

/**
 * Opens the page and waits until it is interactive and the cart and wishlist are restored,
 * so the test never clicks a button before it works (the marker is in src/lib/state/hydration.ts).
 */
export async function open(page: Page, path: string) {
  await page.goto(path)
  await expect(page.locator("html[data-stores-ready]")).toBeAttached()
}

/** The site's products from the products API, so the tests aren't tied to a specific product. */
export async function loadProducts(
  request: APIRequestContext
): Promise<SearchCardData[]> {
  const response = await request.get(productsApiPath)
  expect(response.ok()).toBe(true)
  const body: unknown = await response.json()
  if (!isProductsResponse(body))
    throw new Error("Unexpected products API answer")
  return body.items
}

/** An in-stock product with a single variant, added to the cart in one click, with enough stock for the requested quantity. */
export async function simpleProduct(
  request: APIRequestContext,
  { minStock = 2, minPrice = 0 } = {}
) {
  const product = (await loadProducts(request)).find(
    (card) =>
      card.inStock &&
      card.quickAdd !== null &&
      card.quickAdd.stock >= minStock &&
      card.price >= minPrice
  )
  if (!product)
    throw new Error("No in-stock product with a single variant in the data")
  return product
}

/** Is the device a phone? On phones, the filters and the order summary open with a tap. */
export const isPhone = (page: Page) =>
  (page.viewportSize()?.width ?? 1280) < 768

/** The number in a text such as "1,299 ر.س" (1,299 SAR) */
export const priceOf = (text: string) =>
  Number(text.replace(/[^\d.]/g, "").replace(/\.$/, ""))

/** An HTTP request that retries when the connection to the local preview server drops briefly (ECONNRESET). */
export async function getWithRetry(
  request: APIRequestContext,
  url: string,
  attempts = 3
) {
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await request.get(url)
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
    }
  }
  throw lastError
}

/** A variant's stock as the store shows it, in /cart-catalog.json (drawn again when the catalog changes). */
export async function shownStock(request: APIRequestContext, sku: string) {
  const response = await getWithRetry(request, "/cart-catalog.json")
  const body: unknown = await response.json()
  if (!isCartCatalog(body)) throw new Error("Unexpected cart catalog shape")
  return body[sku]?.stock ?? 0
}
