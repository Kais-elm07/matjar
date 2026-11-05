"use client"

import { useCallback, useEffect, useState } from "react"

import { isSearchIndex } from "@/lib/catalog/guards"
import type { SearchCardData } from "@/lib/catalog/types"
import { staticJsonLoader } from "@/lib/static-json"

/** Loads the search index only once and shares it between all search boxes on the page. */
const loadSearchIndex = staticJsonLoader("/search-index.json", isSearchIndex)

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
