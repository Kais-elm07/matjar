import { expect, test } from "@playwright/test"

import { isPhone, loadProducts, open, priceOf } from "./helpers"

test("Search finds the product even when taa marbuta (ة) is typed as ه", async ({
  page,
  request,
}) => {
  // A product with a word in its name that ends in taa marbuta, searched for with ه as many people type it
  const product = (await loadProducts(request)).find((card) =>
    card.name.split(" ").some((word) => word.endsWith("ة"))
  )
  if (!product) throw new Error("No product has a taa marbuta (ة) in its name")
  const word = product.name.split(" ").find((entry) => entry.endsWith("ة"))
  if (!word) throw new Error("The product name has no word ending in ة")
  const query = `${word.slice(0, -1)}ه`

  await open(page, "/")
  // On phones the search field appears after tapping the search button in the header
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

test("A search with no results shows a clear message", async ({ page }) => {
  await open(page, `/search/?q=${encodeURIComponent("زرافة")}`)
  await expect(page.getByText(/لم نجد نتائج/)).toBeVisible()
})

test("The on-sale filter and sorting by price update the URL and the results", async ({
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

  // Every product shown has a price before the discount
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
      // Every card has a readable price; otherwise the sort check would pass without comparing anything
      if (numbers.length === 0 || numbers.some((price) => !(price > 0))) {
        return "unreadable prices"
      }
      return numbers.every(
        (price, index) => index === 0 || numbers[index - 1] <= price
      )
    })
    .toBe(true)
})
