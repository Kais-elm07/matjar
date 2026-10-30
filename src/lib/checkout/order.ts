"use client"

import { useSyncExternalStore } from "react"

import type { VariantOptions } from "@/lib/catalog/options"

import type { OrderTotals } from "./types"

/** الطلب التجريبي كما تعرضه صفحة التأكيد. لا يُرسل لأي جهة. */
export type PlacedOrder = {
  number: string
  placedAt: string
  customer: { name: string; phone: string; city: string; address: string }
  shipping: { label: string; days: string }
  couponCode: string | null
  lines: {
    sku: string
    name: string
    options: VariantOptions
    quantity: number
    price: number
    image: { src: string; alt: string } | null
  }[]
  totals: OrderTotals
}

// sessionStorage: يبقى الطلب لعرض صفحة التأكيد فقط، ويُمحى عند إغلاق التبويب
const KEY = "matjar-last-order"

/** رقم طلب تجريبي فريد تقريباً بتاريخ جهاز الزائر، مثل 261031-4827. */
export function createOrderNumber(date = new Date()) {
  const pad = (value: number) => value.toString().padStart(2, "0")
  const stamp = `${pad(date.getFullYear() % 100)}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  const random = crypto.getRandomValues(new Uint16Array(1))[0] % 10000
  return `${stamp}-${random.toString().padStart(4, "0")}`
}

export function saveLastOrder(order: PlacedOrder) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order))
  } catch {
    // التخزين ممنوع في بعض أوضاع التصفح الخاص، فتعرض الصفحة رسالة عامة
  }
}

const readRaw = () => {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

/**
 * آخر طلب تجريبي في هذا التبويب: "pending" أثناء البناء وأول عرض،
 * ثم الطلب، أو null إن لم يوجد طلب حديث.
 */
export function useLastOrder(): PlacedOrder | null | "pending" {
  const raw = useSyncExternalStore(
    () => () => {},
    readRaw,
    () => "pending"
  )
  if (raw === "pending" || raw === null) return raw
  try {
    return JSON.parse(raw) as PlacedOrder
  } catch {
    return null
  }
}
