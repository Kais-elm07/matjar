import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

import { expect, test, type Page } from "@playwright/test"

import { coupons } from "../../src/data/coupons"
import { fileRows } from "../../src/modules/catalog/file-rows"
import { optionsKey } from "../../src/modules/catalog/variant-key"
import { MAX_LINE_QUANTITY } from "../../src/lib/checkout/quantity"
import {
  isPhone,
  loadProducts,
  open,
  shownStock,
  simpleProduct,
} from "./helpers"

/** The first percentage coupon in the store data, so the test isn't tied to a specific code. */
const percentCoupon = coupons.find((coupon) => coupon.type === "percent")

/** The add button on the product page, before the quick-add buttons in the suggested products. */
const addToCart = (page: Page) =>
  page
    .getByRole("main")
    .getByRole("button", { name: "أضف للسلة", exact: true })
    .first()

/** Fills the checkout's required fields, with the mobile number in Arabic-Indic digits. */
async function fillAddress(page: Page) {
  await page.getByLabel("الاسم الكامل", { exact: true }).fill("أحمد محمد")
  await page.getByLabel("رقم الجوال", { exact: true }).fill("٠٥٠١٢٣٤٥٦٧")
  await page.getByLabel("المدينة", { exact: true }).selectOption({ index: 1 })
  await page.getByLabel("الحي", { exact: true }).fill("النرجس")
  await page
    .getByLabel("الشارع ورقم المبنى", { exact: true })
    .fill("شارع الملك فهد 12")
}

test("Adding to the cart, changing the quantity and removing, with the cart kept after a reload", async ({
  page,
  request,
}) => {
  const product = await simpleProduct(request, { minStock: 2 })
  await open(page, `/product/${product.slug}/`)
  await addToCart(page).click()

  const drawer = page.getByRole("dialog", { name: /سلة التسوق/ })
  await expect(drawer).toBeVisible()
  await expect(drawer.getByText(product.name)).toBeVisible()
  await drawer.getByRole("button", { name: "زيادة الكمية" }).click()
  await expect(drawer.getByRole("heading", { name: /\(2\)/ })).toBeVisible()

  await drawer.getByRole("link", { name: "عرض السلة" }).click()
  await expect(page).toHaveURL(/\/cart\/$/)

  await page.reload()
  await expect(page.locator("html[data-stores-ready]")).toBeAttached()
  await expect(page.getByRole("main").locator("output")).toHaveText("2")

  await page
    .getByRole("button", { name: `حذف ${product.name} من السلة` })
    .click()
  await expect(page.getByText("سلتك فارغة")).toBeVisible()
})

test("Placing a demo order with a mobile number in Arabic-Indic digits and a discount coupon", async ({
  page,
  request,
}) => {
  const product = await simpleProduct(request, { minStock: 1 })
  if (!product.quickAdd)
    throw new Error("A single-variant product has quickAdd")
  const { sku } = product.quickAdd
  await open(page, `/product/${product.slug}/`)
  await addToCart(page).click()
  await page
    .getByRole("dialog", { name: /سلة التسوق/ })
    .getByRole("link", { name: "إتمام الطلب" })
    .click()
  await expect(page).toHaveURL(/\/checkout\/$/)
  await expect(page.locator("html[data-stores-ready]")).toBeAttached()

  // Submitting without filling in the fields shows Arabic messages under them
  const confirm = page.getByRole("button", { name: /تأكيد الطلب/ })
  await confirm.click()
  await expect(page.getByText("اكتب اسمك الكامل")).toBeVisible()
  await expect(
    page.getByText("رقم الجوال يبدأ بـ 05 ويتكون من 10 أرقام")
  ).toBeVisible()

  await fillAddress(page)

  // On phones the order summary is collapsed, and it holds the coupon field
  if (isPhone(page)) {
    await page.getByRole("button", { name: /ملخص الطلب/ }).click()
  }
  if (!percentCoupon)
    throw new Error("No percentage coupon in src/data/coupons.ts")
  // In lowercase: the code is accepted regardless of letter case
  await page
    .getByLabel("كوبون الخصم", { exact: true })
    .fill(percentCoupon.code.toLowerCase())
  await page.getByRole("button", { name: "تطبيق", exact: true }).click()
  await expect(
    page.getByText(`الخصم (${percentCoupon.code})`).first()
  ).toBeVisible()

  await confirm.click()
  // The server saved the order, and the order has a page of its own
  await expect(page).toHaveURL(/\/orders\/[a-z0-9]+\/$/)
  await expect(page.getByText(/رقم الطلب/)).toBeVisible()
  await expect(page.getByText(/طلب تجريبي/).first()).toBeVisible()
  await expect(page.getByText(`الخصم (${percentCoupon.code})`)).toBeVisible()
  // The cart is empty after confirming: the cart button in the header has no counter
  await expect(
    page.getByRole("button", { name: "السلة", exact: true }).first()
  ).toBeVisible()

  // The order is read from the database, so its page still shows it after a reload
  await page.reload()
  await expect(page.getByText("أحمد محمد")).toBeVisible()

  // The order lowered the stock below what src/data starts it at (the tests write src/data into the
  // database before they run), and the store's saved files are drawn again from the database and
  // show it; the first request after an order may still get the old copy while the new one is drawn
  const seeded = fileRows({}).products.find((row) => row.slug === product.slug)
  const startingStock = seeded?.variants[0]?.stock ?? 0
  await expect
    .poll(() => shownStock(request, sku), { timeout: 15_000 })
    .toBeLessThan(startingStock)
})

test("An order for more pieces than are left is answered on the spot, and the cart is corrected", async ({
  page,
  request,
}) => {
  const product = (await loadProducts(request)).find(
    (card) =>
      card.quickAdd !== null &&
      card.quickAdd.stock > 0 &&
      card.quickAdd.stock < MAX_LINE_QUANTITY
  )
  if (!product?.quickAdd) {
    throw new Error("No single-variant product with fewer than 10 pieces left")
  }
  const { sku, stock } = product.quickAdd
  // A cart that is behind the store: it asks for one piece more than is left, and the copy of the
  // prices and stock the browser checks it against still says there are plenty
  const behind = {
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: 99,
  }
  await page.addInitScript(
    (lines) => {
      localStorage.setItem(
        "matjar-cart",
        JSON.stringify({ state: { lines }, version: 1 })
      )
    },
    [
      {
        ...behind,
        sku,
        slug: product.slug,
        name: product.name,
        image: null,
        options: {},
        quantity: stock + 1,
      },
    ]
  )
  await page.route("**/cart-catalog.json", (route) =>
    route.fulfill({ json: { [sku]: { ...behind, options: optionsKey({}) } } })
  )

  await open(page, "/checkout/")
  await fillAddress(page)
  await page.getByRole("button", { name: /تأكيد الطلب/ }).click()

  // The server refuses the order and sends the stock as it is now; nothing is loaded again
  await expect(
    page.getByRole("alert").filter({ hasText: product.name })
  ).toHaveText(`قلّت كمية «${product.name}» لتناسب المخزون المتوفر.`)
  await expect(page).toHaveURL(/\/checkout\/$/)
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("matjar-cart")))
    .toContain(`"quantity":${stock}`)
})

/** The built file with the cart panel's code: the only one that holds its title, "سلة التسوق" (Shopping cart). */
function cartPanelFile() {
  const folder = ".next/static/chunks"
  const file = readdirSync(folder).find(
    (name) =>
      name.endsWith(".js") &&
      readFileSync(path.join(folder, name), "utf8").includes("سلة التسوق")
  )
  if (!file) throw new Error("No built file holds the cart panel's title")
  return file
}

test("When the cart panel can't be downloaded, the cart button opens the cart page", async ({
  page,
}) => {
  await page.route(`**/_next/static/chunks/${cartPanelFile()}`, (route) =>
    route.abort()
  )

  await open(page, "/")
  await page.getByRole("button", { name: "السلة", exact: true }).first().click()
  await expect(page).toHaveURL(/\/cart\/$/)
  await expect(page.getByRole("heading", { name: "سلة التسوق" })).toBeVisible()
})

test("An order address that doesn't exist shows the 404 page", async ({
  page,
}) => {
  const response = await page.goto("/orders/no-such-order/")
  expect(response?.status()).toBe(404)
  await expect(
    page.getByRole("heading", { name: "عذراً، لم نجد هذه الصفحة" })
  ).toBeVisible()
})

test("A product saved to the wishlist appears on the wishlist page and can be removed from it", async ({
  page,
}) => {
  await open(page, "/products/")
  const card = page.getByRole("article").first()
  const name = (await card.getByRole("heading").textContent())?.trim() ?? ""
  await card.getByRole("button", { name: `حفظ ${name} في المفضلة` }).click()
  await expect(page.getByText("أُضيف إلى المفضلة")).toBeVisible()
  // The counter is in the header on desktop and in the bottom bar on phones; getByRole ignores the hidden one
  await expect(
    page.getByRole("link", { name: "المفضلة (1)" }).first()
  ).toBeVisible()

  await open(page, "/wishlist/")
  const saved = page.getByRole("article").filter({ hasText: name })
  await expect(saved).toBeVisible()
  await saved.getByRole("button", { name: `حفظ ${name} في المفضلة` }).click()
  await expect(page.getByText("لا توجد منتجات في المفضلة")).toBeVisible()
})

test("A saved product that is no longer in the store is dropped from the wishlist", async ({
  page,
  request,
}) => {
  const [product] = await loadProducts(request)
  if (!product) throw new Error("The store has no products")
  await page.addInitScript(
    (slugs) => {
      localStorage.setItem(
        "matjar-wishlist",
        JSON.stringify({ state: { slugs }, version: 1 })
      )
    },
    [product.slug, "no-such-product"]
  )

  await open(page, "/wishlist/")
  await expect(
    page.getByRole("article").filter({ hasText: product.name })
  ).toBeVisible()
  await expect(
    page.getByText("بعض ما حفظته لم يعد في المتجر، فحذفناه من المفضلة.")
  ).toBeVisible()
  // The counter no longer counts the product that left
  await expect(
    page.getByRole("link", { name: "المفضلة (1)" }).first()
  ).toBeVisible()
})
