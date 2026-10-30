"use client"

import { useCallback, useEffect, useState } from "react"

import type { ProductCard } from "./types"

let request: Promise<ProductCard[]> | null = null

/** تحميل فهرس البحث مرة واحدة فقط ومشاركته بين كل صناديق البحث في الصفحة. */
function loadSearchIndex() {
  request ??= fetch("/search-index.json")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response.json() as Promise<ProductCard[]>
    })
    .catch((error: unknown) => {
      request = null // السماح بإعادة المحاولة
      throw error
    })
  return request
}

type IndexState = { data: ProductCard[] | null; error: boolean }

/** فهرس البحث. يبدأ التحميل فقط عند enabled، مثلاً عند التركيز على حقل البحث. */
export function useSearchIndex(enabled = true) {
  const [state, setState] = useState<IndexState>({ data: null, error: false })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let active = true
    loadSearchIndex().then(
      (data) => active && setState({ data, error: false }),
      () => active && setState({ data: null, error: true })
    )
    return () => {
      active = false
    }
  }, [enabled, attempt])

  const retry = useCallback(() => {
    setState({ data: null, error: false })
    setAttempt((value) => value + 1)
  }, [])

  return { ...state, retry }
}
