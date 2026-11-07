import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test"

import { productApiPath } from "../../src/lib/routes"
import { ADMIN_TEST_PASSWORD } from "./admin-password"

/**
 * The admin panel: signing in, adding a product with a photo the store already has, changing its price
 * and hiding it, and the store showing each change. It writes to the shared test database, so it runs
 * on one device only.
 */
test.skip(
  ({ browserName, isMobile }) => browserName !== "chromium" || isMobile,
  "Writes to the shared database: one device is enough"
)

async function signIn(page: Page) {
  await page.goto("/admin/login/")
  await page.getByLabel("كلمة المرور").fill(ADMIN_TEST_PASSWORD)
  await page.getByRole("button", { name: "دخول" }).click()
  await expect(page).toHaveURL(/\/admin\/$/)
}

/** The product as the store's API shows it; it changes once the catalog is drawn again. */
async function storeProduct(request: APIRequestContext, slug: string) {
  const response = await request.get(productApiPath(slug))
  if (!response.ok()) return null
  const body: unknown = await response.json()
  if (typeof body !== "object" || body === null || !("price" in body)) {
    return null
  }
  return { price: body.price }
}

test("The panel needs the password, and refuses a wrong one", async ({
  page,
}) => {
  await page.goto("/admin/")
  await expect(page).toHaveURL(/\/admin\/login\/$/)
  await page.getByLabel("كلمة المرور").fill("not-the-password")
  await page.getByRole("button", { name: "دخول" }).click()
  // Next.js has an alert of its own (the route announcer), so the panel's is picked by its text
  await expect(
    page.getByRole("alert").filter({ hasText: "كلمة المرور" })
  ).toHaveText("كلمة المرور غير صحيحة.")
  await expect(page).toHaveURL(/\/admin\/login\/$/)
})

test("The store owner adds a product, changes its price and hides it, and the store follows", async ({
  page,
  request,
}) => {
  const stamp = Date.now()
  const slug = `e2e-product-${stamp}`
  const name = `منتج تجريبي ${stamp}`
  await signIn(page)

  // Adding
  await page.getByRole("link", { name: "إضافة منتج" }).click()
  await page.getByLabel("الاسم", { exact: true }).fill(name)
  await page.getByLabel("الرابط", { exact: true }).fill(slug)
  await page.getByLabel("الفئة", { exact: true }).selectOption({ index: 1 })
  await page
    .getByLabel("مسار الصورة 1", { exact: true })
    .fill("/images/products/classic-cotton-shirt-1")
  await page.getByLabel("الرمز", { exact: true }).fill(`E2E-${stamp}`)
  await page.getByLabel(/^السعر/).fill("99")
  await page.getByLabel("المخزون", { exact: true }).fill("5")
  await page.getByRole("button", { name: "حفظ المنتج" }).click()
  // Saving writes the product and refreshes the catalog: slower while the other tests run
  await expect(page).toHaveURL(/\/admin\/$/, { timeout: 15_000 })
  await expect(page.getByRole("link", { name })).toBeVisible()

  // The store shows it without a new build: the first request may still get the old copy
  await expect
    .poll(() => storeProduct(request, slug), { timeout: 20_000 })
    .toEqual({ price: 9900 })
  await page.goto(`/product/${slug}/`)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(name)

  // Changing the price
  await page.goto("/admin/")
  await page.getByRole("link", { name }).click()
  await page.getByLabel(/^السعر/).fill("79")
  await page.getByRole("button", { name: "حفظ المنتج" }).click()
  await expect(page).toHaveURL(/\/admin\/$/, { timeout: 15_000 })
  await expect
    .poll(() => storeProduct(request, slug), { timeout: 20_000 })
    .toEqual({ price: 7900 })

  // Hiding: the product leaves the store, but stays in the panel
  await page.getByRole("button", { name: `إخفاء ${name} من المتجر` }).click()
  await expect(
    page.getByRole("button", { name: `إظهار ${name} في المتجر` })
  ).toBeVisible()
  await expect
    .poll(() => storeProduct(request, slug), { timeout: 20_000 })
    .toBeNull()
})

test("A product with a wrong field is not saved, and the panel says why", async ({
  page,
}) => {
  await signIn(page)
  await page.getByRole("link", { name: "إضافة منتج" }).click()
  await page.getByLabel("الاسم", { exact: true }).fill("منتج ناقص")
  await page.getByLabel("الرابط", { exact: true }).fill("Not A Slug")
  await page.getByRole("button", { name: "حفظ المنتج" }).click()
  const problems = page
    .getByRole("alert")
    .filter({ hasText: "لم يُحفظ شيء" })
    .first()
  await expect(problems).toContainText("لم يُحفظ شيء")
  await expect(problems).toContainText("الرابط")
  await expect(page).toHaveURL(/\/admin\/products\/new\/$/)
})
