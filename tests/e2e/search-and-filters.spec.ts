import { expect, test } from "@playwright/test"

import { isPhone, loadProducts, open, priceOf } from "./helpers"

test("البحث يجد المنتج رغم كتابة التاء المربوطة هاءً", async ({
  page,
  request,
}) => {
  // منتج في اسمه كلمة تنتهي بتاء مربوطة، يُبحث عنه بالهاء كما يكتب كثيرون
  const product = (await loadProducts(request)).find((card) =>
    card.name.split(" ").some((word) => word.endsWith("ة"))
  )
  if (!product) throw new Error("لا يوجد منتج في اسمه تاء مربوطة")
  const word = product.name.split(" ").find((entry) => entry.endsWith("ة"))
  if (!word) throw new Error("The product name has no word ending in ة")
  const query = `${word.slice(0, -1)}ه`

  await open(page, "/")
  // على الجوال يظهر حقل البحث بعد الضغط على زر البحث في الرأس
  if (isPhone(page)) {
    await page.getByRole("button", { name: "البحث", exact: true }).click()
  }
  const box = page.getByRole("combobox", { name: "ابحث في المتجر" })
  await box.fill(query)
  await expect(page.getByRole("option", { name: product.name })).toBeVisible()

  await box.press("Enter")
  await expect(page).toHaveURL(/\/search\/?\?q=/)
  await expect(page.getByRole("heading", { level: 1 })).toContainText(query)
  await expect(
    page.getByRole("article").filter({ hasText: product.name })
  ).toBeVisible()
})

test("البحث بلا نتائج يعرض رسالة واضحة", async ({ page }) => {
  await open(page, `/search/?q=${encodeURIComponent("زرافة")}`)
  await expect(page.getByText(/لم نجد نتائج/)).toBeVisible()
})

test("فلتر العروض والترتيب بالسعر يحدّثان الرابط والنتائج", async ({
  page,
}) => {
  await open(page, "/products/")

  if (isPhone(page)) {
    await page.getByRole("button", { name: "تصفية", exact: true }).click()
    const sheet = page.getByRole("dialog", { name: "تصفية النتائج" })
    await sheet.getByText("العروض فقط").click()
    await expect(page).toHaveURL(/sale=1/)
    await sheet.getByRole("button", { name: /عرض النتائج/ }).click()
    await expect(sheet).toBeHidden()
  } else {
    await page
      .getByRole("complementary", { name: "تصفية النتائج" })
      .getByText("العروض فقط")
      .click()
    await expect(page).toHaveURL(/sale=1/)
  }

  // كل منتج ظاهر عليه سعر قبل الخصم
  const cards = page.getByRole("article")
  await expect(cards.first()).toBeVisible()
  for (const card of await cards.all()) {
    await expect(card.locator("del")).toBeVisible()
  }

  await page.getByLabel("ترتيب حسب").selectOption("price-asc")
  await expect(page).toHaveURL(/sort=price-asc/)
  await expect
    .poll(async () => {
      const prices = await cards.locator("[data-slot=price]").allTextContents()
      const numbers = prices.map(priceOf)
      // كل بطاقة لها سعر مقروء، وإلا لنجح فحص الترتيب دون أن يقارن شيئاً
      if (numbers.length === 0 || numbers.some((price) => !(price > 0))) {
        return "أسعار غير مقروءة"
      }
      return numbers.every(
        (price, index) => index === 0 || numbers[index - 1] <= price
      )
    })
    .toBe(true)
})
