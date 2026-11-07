import { expect, test, type Page } from "@playwright/test"

import { open, simpleProduct } from "./helpers"

// Najm shows in these tests: they start without the saved choice that hides him in the others
test.use({ storageState: { cookies: [], origins: [] } })

/** The add button on the product page, before the quick-add buttons in the suggested products. */
const addToCart = (page: Page) =>
  page
    .getByRole("main")
    .getByRole("button", { name: "أضف للسلة", exact: true })
    .first()

const cartPanel = (page: Page) =>
  page.getByRole("dialog", { name: /سلة التسوق/ })

/**
 * Brings Najm onto the page. His code loads after the visitor's first move once the page is idle, so the
 * key press is repeated until he is ready (the marker is in use-added-products.ts). Without WebGL 2 there is
 * no Najm, and adding to the cart opens the cart panel, which the other tests cover.
 */
async function wakeNajm(page: Page) {
  const canDraw = await page.evaluate(
    () => document.createElement("canvas").getContext("webgl2") !== null
  )
  test.skip(!canDraw, "This browser has no WebGL 2 here, so Najm can't show")
  await expect(async () => {
    await page.keyboard.press("Shift")
    await expect(page.locator("html[data-mascot-ready]")).toBeAttached({
      timeout: 1000,
    })
  }).toPass()
}

test("Najm catches an added product and suggests similar ones, instead of the cart panel", async ({
  page,
  request,
}) => {
  const product = await simpleProduct(request)
  await open(page, `/product/${product.slug}/`)
  await wakeNajm(page)

  await addToCart(page).click()
  const najm = page.getByRole("status", { name: "نجم" })
  await expect(najm).toContainText(`وضعتُ «${product.name}» في سلتك.`)
  await expect(najm.getByRole("listitem").first()).toBeVisible()
  await expect(cartPanel(page)).toBeHidden()

  // The cart panel opens from his bubble
  await najm.getByRole("button", { name: "عرض السلة" }).click()
  await expect(cartPanel(page)).toBeVisible()
  await expect(cartPanel(page).getByText(product.name)).toBeVisible()
})

test("The footer button hides Najm for good, and adding to the cart opens the cart panel again", async ({
  page,
  request,
}) => {
  const product = await simpleProduct(request)
  await open(page, `/product/${product.slug}/`)
  await wakeNajm(page)

  await page.getByRole("button", { name: "إخفاء نجم" }).click()
  await expect(page.locator("html[data-mascot-ready]")).not.toBeAttached()
  await addToCart(page).click()
  await expect(cartPanel(page)).toBeVisible()

  await page.reload()
  await expect(page.getByRole("button", { name: "إظهار نجم" })).toBeAttached()
})
