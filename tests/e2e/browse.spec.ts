import { expect, test } from "@playwright/test"

import { siteConfig } from "../../src/config/site"
import { getWithRetry, loadProducts, open } from "./helpers"

test("Browsing from the home page to a category, then to a product", async ({
  page,
}) => {
  await open(page, "/")
  await expect(page).toHaveTitle(new RegExp(siteConfig.name))
  await expect(page.locator("h1")).toContainText(siteConfig.name)

  const tile = page
    .getByRole("region", { name: "تسوّق حسب الفئة" })
    .getByRole("listitem")
    .first()
    .getByRole("link")
  const href = (await tile.getAttribute("href"))?.replace(/\/$/, "")
  await tile.click()
  await expect(page).toHaveURL(new RegExp(`${href}/?$`))
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

  const product = page
    .getByRole("article")
    .first()
    .getByRole("heading")
    .getByRole("link")
  const name = (await product.textContent())?.trim() ?? ""
  await product.click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(name)
})

test("An unknown URL shows a 404 page in Arabic", async ({ page }) => {
  const response = await page.goto("/no-such-page/")
  expect(response?.status()).toBe(404)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "عذراً، لم نجد هذه الصفحة"
  )
  await page.getByRole("link", { name: "العودة إلى الرئيسية" }).click()
  await expect(page).toHaveURL(/\/$/)
})

test("A line break the host adds to <head> doesn't break the page in the browser", async ({
  page,
}) => {
  // Netlify adds a line break and a comment after <meta charSet> in every page it serves
  const meta = '<meta charSet="utf-8"/>'
  let changed = false
  await page.route(
    (url) => url.pathname === "/",
    async (route) => {
      // The same address also answers the page's RSC requests
      if (route.request().resourceType() !== "document") return route.fallback()
      const response = await route.fetch()
      const html = await response.text()
      changed = html.includes(meta)
      await route.fulfill({
        response,
        body: html.replace(meta, `${meta}\n<!-- Added by the host -->`),
      })
    }
  )
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })

  await open(page, "/")
  expect(changed).toBe(true)
  // React reports the mismatch after hydrating, so give it a moment
  await page.waitForTimeout(500)
  expect(errors).toEqual([])
})

test("FAQ items open when the question is clicked", async ({ page }) => {
  await open(page, "/pages/faq/")
  const question = page.locator("details.faq-item").first()
  await expect(question).not.toHaveAttribute("open")
  await question.locator("summary").click()
  await expect(question).toHaveAttribute("open", "")
})

test("Every product has a JPEG share image", async ({ page, request }) => {
  const [product] = await loadProducts(request)
  await page.goto(`/product/${product.slug}/`)
  const image = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content")
  expect(image).toContain(`/og/product/${product.slug}.jpg`)
  const response = await getWithRetry(request, new URL(image ?? "").pathname)
  expect(response.ok()).toBe(true)
  expect(response.headers()["content-type"]).toContain("image/jpeg")
})
