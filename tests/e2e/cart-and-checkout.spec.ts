import { expect, test, type Page } from "@playwright/test"

import { isPhone, open, simpleProduct } from "./helpers"

/** زر الإضافة في صفحة المنتج، قبل أزرار الإضافة السريعة في المنتجات المقترحة. */
const addToCart = (page: Page) =>
  page
    .getByRole("main")
    .getByRole("button", { name: "أضف للسلة", exact: true })
    .first()

test("الإضافة للسلة وتعديل الكمية والحذف، مع بقاء السلة بعد إعادة التحميل", async ({
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

test("إتمام طلب تجريبي برقم جوال بالأرقام العربية وكوبون خصم", async ({
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

  // الإرسال دون تعبئة يعرض رسائل عربية تحت الحقول
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

  // ملخص الطلب يُطوى على الجوال، وفيه حقل الكوبون
  if (isPhone(page)) {
    await page.getByRole("button", { name: /ملخص الطلب/ }).click()
  }
  await page.getByLabel("كوبون الخصم", { exact: true }).fill("welcome10")
  await page.getByRole("button", { name: "تطبيق", exact: true }).click()
  await expect(page.getByText(/الخصم \(WELCOME10\)/).first()).toBeVisible()

  await confirm.click()
  await expect(page).toHaveURL(/\/checkout\/success\/$/)
  await expect(page.getByText(/رقم الطلب/)).toBeVisible()
  await expect(page.getByText(/طلب تجريبي/).first()).toBeVisible()
  // السلة فرغت بعد التأكيد
  await expect(page.getByLabel(/السلة \(\d+\)/)).toHaveCount(0)
})

test("حفظ منتج في المفضلة يظهر في صفحتها ويُزال منها", async ({ page }) => {
  await open(page, "/products/")
  const card = page.getByRole("article").first()
  const name = (await card.getByRole("heading").textContent())?.trim() ?? ""
  await card.getByRole("button", { name: `حفظ ${name} في المفضلة` }).click()
  await expect(page.getByText("أُضيف إلى المفضلة")).toBeVisible()
  // العدّاد في الرأس على الحاسوب، وفي الشريط السفلي على الجوال؛ getByRole يتجاهل المخفي منهما
  await expect(
    page.getByRole("link", { name: "المفضلة (1)" }).first()
  ).toBeVisible()

  await open(page, "/wishlist/")
  const saved = page.getByRole("article").filter({ hasText: name })
  await expect(saved).toBeVisible()
  await saved.getByRole("button", { name: `حفظ ${name} في المفضلة` }).click()
  await expect(page.getByText("لا توجد منتجات في المفضلة")).toBeVisible()
})
