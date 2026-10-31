"use client"

import { useEffect, useState } from "react"

/**
 * يصبح true بعد اكتمال تحميل الصفحة وفراغ المتصفح.
 * تستخدمه النوافذ المنبثقة (السلة، والقائمة، وتكبير الصورة، والتصفية) لتحميل كودها
 * بعد ظهور المحتوى لا قبله، فتبقى جاهزة للفتح فوراً دون أن تؤخر الصفحة.
 */
export function useIdle() {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    let cancel = () => {}
    const schedule = () => {
      // Safari لا يدعم requestIdleCallback، فينتظر ثانية ونصفاً بعد التحميل
      if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(() => setIdle(true), {
          timeout: 3000,
        })
        cancel = () => window.cancelIdleCallback(id)
      } else {
        const id = setTimeout(() => setIdle(true), 1500)
        cancel = () => clearTimeout(id)
      }
    }
    if (document.readyState === "complete") schedule()
    else window.addEventListener("load", schedule, { once: true })
    return () => {
      window.removeEventListener("load", schedule)
      cancel()
    }
  }, [])

  return idle
}
