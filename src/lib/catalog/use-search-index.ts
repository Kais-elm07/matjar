"use client"

import { useCallback, useEffect, useState } from "react"

import { isSearchIndex } from "./guards"
import type { SearchCardData } from "./types"

let request: Promise<SearchCardData[]> | null = null

/** تحميل فهرس البحث مرة واحدة فقط ومشاركته بين كل صناديق البحث في الصفحة. */
function loadSearchIndex() {
  request ??= fetch("/search-index.json")
    .then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const index: unknown = await response.json()
      if (!isSearchIndex(index)) throw new Error("Invalid search index")
      return index
    })
    .catch((error: unknown) => {
      request = null // السماح بإعادة المحاولة
      throw error
    })
  return request
}

type IndexState = { data: SearchCardData[] | null; error: boolean }

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
