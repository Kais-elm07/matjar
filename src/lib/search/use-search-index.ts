"use client"

import { useCallback, useEffect, useState } from "react"

import { isSearchIndex } from "@/lib/catalog/guards"
import type { SearchCardData } from "@/lib/catalog/types"

let request: Promise<SearchCardData[]> | null = null

/** Loads the search index only once and shares it between all search boxes on the page. */
function loadSearchIndex() {
  request ??= fetch("/search-index.json")
    .then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const index: unknown = await response.json()
      if (!isSearchIndex(index)) throw new Error("Invalid search index")
      return index
    })
    .catch((error: unknown) => {
      request = null // Allow a retry
      throw error
    })
  return request
}

type IndexState = { data: SearchCardData[] | null; error: boolean }

/** The search index. Loading starts only when enabled, for example when the search field gets focus. */
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
