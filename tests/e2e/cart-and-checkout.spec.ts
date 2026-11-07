import { expect, test, type Page } from "@playwright/test"

import { coupons } from "../../src/data/coupons"
import { isPhone, open, simpleProduct } from "./helpers"

/** The first percentage coupon in the store data, so the test isn't tied to a specific code. */
const percentCoupon = coupons.find((coupon) => coupon.type === "percent")

/** The add button on the product page, before the quick-add buttons in the suggested products. */
const addToCart = (page: Page) =>
  page
    .getByRole("main")
    .getByRole("button", { name: "أضف للسلة", exact: true })
    .first()

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

  await page.getByLabel("الاسم الكامل", { exact: true }).fill("أحمد محمد")
  await page.getByLabel("رقم الجوال", { exact: true }).fill("٠٥٠١٢٣٤٥٦٧")
  await page.getByLabel("المدينة", { exact: true }).selectOption({ index: 1 })
  await page.getByLabel("الحي", { exact: true }).fill("النرجس")
  await page
    .getByLabel("الشارع ورقم المبنى", { exact: true })
    .fill("شارع الملك فهد 12")

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
