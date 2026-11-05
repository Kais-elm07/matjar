import { expect, test } from "@playwright/test"

import { open } from "./helpers"

test.describe("On mobile", () => {
  test.skip(
    ({ isMobile }) => !isMobile,
    "The mobile menu and the bottom bar only appear on phones"
  )

  test("The mobile menu opens from the header, goes to a page, then closes", async ({
    page,
  }) => {
    await open(page, "/")
    await page.getByRole("button", { name: "فتح القائمة" }).click()
    const menu = page.getByRole("dialog", { name: "القائمة الرئيسية" })
    await expect(menu).toBeVisible()

    await menu.getByRole("link", { name: "كل المنتجات" }).click()
    await expect(page).toHaveURL(/\/products\/$/)
    await expect(menu).toBeHidden()
  })

  test("The bottom bar opens the menu and the cart drawer", async ({
    page,
  }) => {
    await open(page, "/")
    const bar = page.getByRole("navigation", { name: "التنقل السريع" })

    await bar.getByRole("button", { name: "الفئات" }).click()
    const menu = page.getByRole("dialog", { name: "القائمة الرئيسية" })
    await expect(menu).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(menu).toBeHidden()

    await bar.getByRole("button", { name: "السلة" }).click()
    const drawer = page.getByRole("dialog", { name: /سلة التسوق/ })
    await expect(drawer).toBeVisible()
    await expect(drawer.getByText("سلتك فارغة")).toBeVisible()
  })
})
