import { existsSync } from "node:fs"

import { defineConfig, devices } from "@playwright/test"

const PORT = 3200
const isCI = Boolean(process.env.CI)

// على جهاز التطوير يُستخدم Chrome المثبت بدل تنزيل Chromium،
// وفي GitHub Actions تُنزَّل المتصفحات الثلاثة بالأمر playwright install
const chrome = isCI ? {} : { channel: "chrome" }

// Firefox يعمل دائماً في GitHub Actions، ومحلياً عند الطلب: E2E_FIREFOX=1 pnpm test:e2e،
// لأن نسخة Playwright الحالية منه لا تبدأ على بعض أجهزة Windows (لا يجد مكتبة mozglue)
const withFirefox = isCI || Boolean(process.env.E2E_FIREFOX)

// الاختبارات تعمل على النسخة المبنية، فبدونها تفشل كلها بأخطاء 404 مربكة
if (!existsSync("out/index.html")) {
  throw new Error(
    "لا توجد نسخة مبنية في out/. شغّل pnpm build أولاً ثم pnpm test:e2e."
  )
}

/**
 * اختبارات المتصفح (pnpm test:e2e) على النسخة الثابتة في out/ كما ستُنشر،
 * فشغّل pnpm build قبلها. أربعة أجهزة: حاسوب بـ Chrome وFirefox،
 * وجوال Android بمحرك Chrome (مثل Samsung Internet)، وiPhone بمحرك Safari.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "ar-SA",
    // التتبع عند إعادة المحاولة فقط، ولقطة شاشة عند الفشل، فيبقى التقرير خفيفاً
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `node node_modules/serve/build/main.js out --listen ${PORT} --no-clipboard`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !isCI,
  },
  projects: [
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"], ...chrome },
    },
    { name: "galaxy-s24", use: { ...devices["Galaxy S24"], ...chrome } },
    { name: "iphone-15", use: { ...devices["iPhone 15"] } },
    ...(withFirefox
      ? [{ name: "desktop-firefox", use: { ...devices["Desktop Firefox"] } }]
      : []),
  ],
})
