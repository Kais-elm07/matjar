import { expect, test } from "@playwright/test"

import { open } from "./helpers"

test.describe("على الجوال", () => {
  test.skip(
    ({ isMobile }) => !isMobile,
    "قائمة الجوال والشريط السفلي يظهران على الجوال فقط"
  )

  test("قائمة الجوال تفتح من الرأس وتنقل إلى صفحة ثم تُغلق", async ({
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

  test("الشريط السفلي يفتح القائمة ونافذة السلة", async ({ page }) => {
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
