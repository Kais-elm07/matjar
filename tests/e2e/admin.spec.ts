import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test"

import sharp from "sharp"

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
  // Hiding writes the product and refreshes the list: slower while the other tests run
  await expect(
    page.getByRole("button", { name: `إظهار ${name} في المتجر` })
  ).toBeVisible({ timeout: 15_000 })
  await expect
    .poll(() => storeProduct(request, slug), { timeout: 20_000 })
    .toBeNull()
})

/** The first photo of a product as the store's API shows it, or null while the product isn't there. */
async function storePhoto(request: APIRequestContext, slug: string) {
  const response = await request.get(productApiPath(slug))
  if (!response.ok()) return null
  const body: unknown = await response.json()
  if (typeof body !== "object" || body === null || !("images" in body)) {
    return null
  }
  const [first]: unknown[] = Array.isArray(body.images) ? body.images : []
  if (typeof first !== "object" || first === null) return null
  return {
    src: "src" in first ? first.src : null,
    cutout: "cutout" in first ? first.cutout : null,
  }
}

/** A cut-out photo for the upload: an orange disc on a transparent background, as PNG */
function cutoutPhoto() {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">' +
    '<circle cx="450" cy="450" r="360" fill="#c2410c"/></svg>'
  return sharp(Buffer.from(svg)).png().toBuffer()
}

test("The store owner uploads a photo, and the product shows it from the storage", async ({
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

  await page.getByRole("button", { name: "حفظ المنتج" }).click()
  await expect(page).toHaveURL(/\/admin\/$/, { timeout: 15_000 })

  // The store shows the uploaded photo, as a cut-out (the look measured on upload), and its copies exist
  await expect
    .poll(() => storePhoto(request, slug), { timeout: 20_000 })
    .toEqual({ src, cutout: true })
  const copy = await request.get(`${src}-400.webp`)
  expect(copy.ok()).toBe(true)
  expect(copy.headers()["content-type"]).toBe("image/webp")

  // Hidden again, so the products of repeated local runs don't fill the store
  await page.getByRole("button", { name: `إخفاء ${name} من المتجر` }).click()
  // Hiding writes the product and refreshes the list: slower while the other tests run
  await expect(
    page.getByRole("button", { name: `إظهار ${name} في المتجر` })
  ).toBeVisible({ timeout: 15_000 })
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
