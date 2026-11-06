import { expect, test, type Locator } from "@playwright/test"

import { products } from "../../src/data/products"
import { isPhone, open } from "./helpers"

/** The tone (hue) in an element's style, which the stage's slides and the two layers of its light carry. */
const hueOf = (element: Locator) =>
  element.evaluate((node) =>
    node instanceof HTMLElement ? node.style.getPropertyValue("--tone-h") : ""
  )

/** The opacity the stage gives the upper layer of its light, which shows the next slide's tone during a swipe. */
const opacityOf = (element: Locator) =>
  element.evaluate((node) =>
    node instanceof HTMLElement ? node.style.opacity : ""
  )

test("Choosing a color moves the gallery to that color's photo, and the light behind it takes the photo's tone", async ({
  page,
}) => {
  // A product with photos of at least two colors, from the data, so the test isn't tied to one product
  const product = products.find(
    (candidate) =>
      !candidate.hidden &&
      new Set(candidate.images.map((image) => image.color).filter(Boolean))
        .size >= 2
  )
  if (!product) throw new Error("No product with photos of two colors")
  // With reduced motion the gallery moves at once, which also checks that the light still follows the
  // photo without the 3D turn. A smooth scroll would make the test wait on an animation that Playwright's
  // WebKit on Windows doesn't advance in a page running beside the other tests.
  await page.emulateMedia({ reducedMotion: "reduce" })
  await open(page, `/product/${product.slug}/`)
  const main = page.getByRole("main")

  // The color of a photo other than the one the page opens with
  const opening = await main
    .getByRole("button", { name: /^عرض الصورة/ })
    .evaluateAll((thumbs) =>
      thumbs.findIndex((thumb) => thumb.getAttribute("aria-current") === "true")
    )
  const target = product.images.findIndex(
    (image) => image.color && image.color !== product.images[opening]?.color
  )
  const color = product.images[target]?.color ?? ""
  await main
    .locator("fieldset")
    .getByRole("button", { name: new RegExp(`^${color}`) })
    .click()

  // The gallery moves to the first photo of that color
  await expect(
    main.getByRole("button", { name: `عرض الصورة ${target + 1}` })
  ).toHaveAttribute("aria-current", "true")

  // The light takes that photo's tone, with nothing of the next photo's tone over it
  const slideHue = await hueOf(
    main.locator('[data-slot="stage-track"] > *').nth(target)
  )
  expect(slideHue).not.toBe("")
  const light = main.locator('[data-slot="stage-light"] > *')
  await expect.poll(() => hueOf(light.first())).toBe(slideHue)
  // The browser keeps an opacity of 0.000 as "0"
  await expect.poll(() => opacityOf(light.nth(1))).toBe("0")
})

test("The gallery's thumbnails and arrows move between the photos", async ({
  page,
}) => {
  const product = products.find(
    (candidate) => !candidate.hidden && candidate.images.length >= 3
  )
  if (!product) throw new Error("No product with three photos")
  await open(page, `/product/${product.slug}/`)
  const main = page.getByRole("main")
  const thumb = (number: number) =>
    main.getByRole("button", { name: `عرض الصورة ${number}` })

  await thumb(2).click()
  await expect(thumb(2)).toHaveAttribute("aria-current", "true")

  if (isPhone(page)) {
    // On a phone the arrows are hidden, and the counter shows the photo's number
    await expect(
      main.getByText(`2 / ${product.images.length}`, { exact: true })
    ).toBeVisible()
    return
  }
  await main.getByRole("button", { name: "الصورة التالية" }).click()
  await expect(thumb(3)).toHaveAttribute("aria-current", "true")
  await main.getByRole("button", { name: "الصورة السابقة" }).click()
  await expect(thumb(2)).toHaveAttribute("aria-current", "true")
})
