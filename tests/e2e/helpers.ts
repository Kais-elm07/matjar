import { expect, type APIRequestContext, type Page } from "@playwright/test"

import type { SearchCardData } from "../../src/lib/catalog/types"

/**
 * يفتح الصفحة وينتظر حتى تصبح تفاعلية وتُستعاد السلة والمفضلة،
 * فلا يضغط الاختبار زراً قبل أن يعمل (العلامة في src/lib/store/hydration.ts).
 */
export async function open(page: Page, path: string) {
  await page.goto(path)
  await expect(page.locator("html[data-stores-ready]")).toBeAttached()
}

/** منتجات الموقع من فهرس البحث المنشور، حتى لا ترتبط الاختبارات بمنتج بعينه. */
export async function loadProducts(
  request: APIRequestContext
): Promise<SearchCardData[]> {
  const response = await request.get("/search-index.json")
  expect(response.ok()).toBe(true)
  return response.json()
}

/** منتج متوفر بمتغير واحد، يُضاف للسلة بضغطة، ويكفي مخزونه للكمية المطلوبة. */
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
  if (!product) throw new Error("لا يوجد منتج متوفر بمتغير واحد في البيانات")
  return product
}

/** هل الجهاز جوال؟ على الجوال تُفتح التصفية وملخص الطلب بضغطة. */
export const isPhone = (page: Page) =>
  (page.viewportSize()?.width ?? 1280) < 768

/** الأرقام في نص مثل "1,299 ر.س" */
export const priceOf = (text: string) =>
  Number(text.replace(/[^\d.]/g, "").replace(/\.$/, ""))

/** طلب HTTP يعيد المحاولة عند انقطاع الاتصال العابر بخادم المعاينة المحلي (ECONNRESET). */
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
