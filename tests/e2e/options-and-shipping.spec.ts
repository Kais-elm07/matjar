import { expect, test } from "@playwright/test"

import { coupons } from "../../src/data/coupons"
import { shipping } from "../../src/data/shipping"
import { formatPrice, toMinorUnits } from "../../src/lib/catalog/money"
import { isPhone, loadProducts, open, simpleProduct } from "./helpers"

test("اختيار خيارات المنتج ثم إضافته للسلة بالخيارات نفسها", async ({
  page,
  request,
}) => {
  const product = (await loadProducts(request)).find(
    (card) => card.inStock && card.quickAdd === null
  )
  if (!product) throw new Error("لا يوجد منتج متوفر بأكثر من خيار")
  await open(page, `/product/${product.slug}/`)

  const main = page.getByRole("main")
  const groups = main.locator("fieldset")
  await expect(groups.first()).toBeVisible()

  // اختيار قيمة أخرى متوفرة في المجموعة الأولى إن وُجدت
  const other = groups
    .first()
    .getByRole("button", { pressed: false })
    .filter({ hasNotText: "نفد" })
    .first()
  if (await other.isEnabled().catch(() => false)) await other.click()

  const chosen = (await groups.locator("legend").allTextContents()).map(
    (text) => text.replace(/\s+/g, " ").trim()
  )
  await main
    .getByRole("button", { name: "أضف للسلة", exact: true })
    .first()
    .click()

  const drawer = page.getByRole("dialog", { name: /سلة التسوق/ })
  await expect(drawer.getByText(product.name)).toBeVisible()
  for (const option of chosen) {
    await expect(drawer).toContainText(option)
  }
})

test("كوبون خاطئ يُرفض، والتوصيل السريع يضيف رسومه", async ({
  page,
  request,
}) => {
  const product = await simpleProduct(request, { minStock: 1 })
  await open(page, `/product/${product.slug}/`)
  await page
    .getByRole("main")
    .getByRole("button", { name: "أضف للسلة", exact: true })
    .first()
    .click()
  await page
    .getByRole("dialog", { name: /سلة التسوق/ })
    .getByRole("link", { name: "إتمام الطلب" })
    .click()
  await expect(page.locator("html[data-stores-ready]")).toBeAttached()

  if (isPhone(page)) {
    await page.getByRole("button", { name: /ملخص الطلب/ }).click()
  }
  const codes = new Set(coupons.map((coupon) => coupon.code))
  const wrong = ["NOPE", "WRONG1", "XYZ123"].find((code) => !codes.has(code))!
  await page.getByLabel("كوبون الخصم", { exact: true }).fill(wrong)
  await page.getByRole("button", { name: "تطبيق", exact: true }).click()
  await expect(page.getByText("رمز الكوبون غير صحيح")).toBeVisible()

  const city = shipping.cities.find((item) => item.express)
  if (!city) throw new Error("لا توجد مدينة بتوصيل سريع في بيانات الشحن")
  await page.getByLabel("المدينة", { exact: true }).selectOption(city.name)
  await page.getByText("توصيل سريع", { exact: true }).click()

  // رسوم السريع = سعر المدينة + الإضافة، إلا إن كان الطلب مؤهلاً للشحن المجاني بكوبون
  const fee = formatPrice(toMinorUnits(city.fee + shipping.express.extraFee))
  await expect(page.getByRole("radio", { name: /توصيل سريع/ })).toBeChecked()
  await expect(
    page.locator("label").filter({ hasText: "توصيل سريع" })
  ).toContainText(fee)
})
