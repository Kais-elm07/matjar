import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test"

import sharp from "sharp"

import { formatPrice } from "../../src/lib/money"
import { productApiPath } from "../../src/lib/routes"
import { ADMIN_TEST_PASSWORD } from "./admin-password"
import { FAKE_STORAGE_URL } from "./fake-storage-address"

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
  // Signing in opens the products list, read from the database: slower while the other tests run
  await expect(page).toHaveURL(/\/admin\/$/, { timeout: 15_000 })
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
  // Its share image is drawn by the next deploy; until then it points to the site's image
  const share = await request.get(`/og/product/${slug}.jpg`, {
    maxRedirects: 0,
  })
  expect(share.status()).toBe(307)
  expect(share.headers().location).toBe("/og/site.jpg")

  // Changing the price
  await page.goto("/admin/")
  await page.getByRole("link", { name }).click()
  await page.getByLabel(/^السعر/).fill("79")
  await page.getByRole("button", { name: "حفظ المنتج" }).click()
  await expect(page).toHaveURL(/\/admin\/$/, { timeout: 15_000 })
  await expect
    .poll(() => storeProduct(request, slug), { timeout: 20_000 })
    .toEqual({ price: 7900 })

  // A visitor who reaches the product by a link gets the new price at once, although its page was
  // saved before the change: a link's prefetch never draws a stale copy again
  await page
    .getByRole("listitem")
    .filter({ has: page.getByRole("link", { name, exact: true }) })
    .getByRole("link", { name: "عرض", exact: true })
    .click()
  await expect(page).toHaveURL(new RegExp(`/product/${slug}/$`))
  await expect(
    page.getByRole("main").getByText(formatPrice(7900), { exact: true }).first()
  ).toBeVisible()

  // Hiding: the product leaves the store, but stays in the panel
  await page.goto("/admin/")
  await page.getByRole("button", { name: `إخفاء ${name} من المتجر` }).click()
  // Hiding writes the product and refreshes the list: slower while the other tests run
  await expect(
    page.getByRole("button", { name: `إظهار ${name} في المتجر` })
  ).toBeVisible({ timeout: 15_000 })
  await expect
    .poll(() => storeProduct(request, slug), { timeout: 20_000 })
    .toBeNull()
})

/** A cut-out photo for the upload: an orange disc on a transparent background, as PNG */
function cutoutPhoto() {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">' +
    '<circle cx="450" cy="450" r="360" fill="#c2410c"/></svg>'
  return sharp(Buffer.from(svg)).png().toBuffer()
}

/**
 * The product stays hidden: the server is built without SUPABASE_URL, so the store's pages, which
 * other tests open at the same time, would block its photo from the fake storage (the CSP). The look
 * the product's photo takes is tested against the database in tests/db/uploaded-images.test.ts.
 */
test("The store owner uploads a photo, and the product keeps its address in the storage", async ({
  page,
  request,
}) => {
  const stamp = Date.now()
  const slug = `e2e-photo-${stamp}`
  const name = `منتج بصورة ${stamp}`
  await signIn(page)
  await page.getByRole("link", { name: "إضافة منتج" }).click()
  await page.getByLabel("الاسم", { exact: true }).fill(name)
  await page.getByLabel("الرابط", { exact: true }).fill(slug)
  await page.getByLabel("الفئة", { exact: true }).selectOption({ index: 1 })
  await page.getByLabel("الرمز", { exact: true }).fill(`E2E-P-${stamp}`)
  await page.getByLabel(/^السعر/).fill("120")
  await page.getByLabel("المخزون", { exact: true }).fill("3")
  await page.getByRole("checkbox", { name: "إخفاء المنتج من المتجر" }).check()

  // Uploading: the server prepares the copies, keeps them in the (fake) storage and fills the path
  const chooser = page.waitForEvent("filechooser")
  await page.getByRole("button", { name: "رفع الصورة 1" }).click()
  await (
    await chooser
  ).setFiles({
    name: "photo.png",
    mimeType: "image/png",
    buffer: await cutoutPhoto(),
  })
  const path = page.getByLabel("مسار الصورة 1", { exact: true })
  await expect(path).toHaveValue(
    new RegExp(
      `^${FAKE_STORAGE_URL}/storage/v1/object/public/product-images/products/[0-9a-f-]{36}$`
    ),
    { timeout: 15_000 }
  )
  const src = await path.inputValue()
  const copy = await request.get(`${src}-400.webp`)
  expect(copy.ok()).toBe(true)
  expect(copy.headers()["content-type"]).toBe("image/webp")

  // Saved hidden, with the uploaded photo's address
  await page.getByRole("button", { name: "حفظ المنتج" }).click()
  await expect(page).toHaveURL(/\/admin\/$/, { timeout: 15_000 })
  await expect(
    page.getByRole("button", { name: `إظهار ${name} في المتجر` })
  ).toBeVisible()
  await page.getByRole("link", { name }).click()
  await expect(page.getByLabel("مسار الصورة 1", { exact: true })).toHaveValue(
    src
  )
  expect((await request.get(productApiPath(slug))).status()).toBe(404)
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
