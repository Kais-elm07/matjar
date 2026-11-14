"use client"

import { useCallback, useEffect, useState } from "react"

import { isProductsResponse } from "@/modules/catalog/guards"
import type { SearchCardData } from "@/modules/catalog/types"
import { jsonLoader } from "@/lib/json-loader"
import { productsApiPath } from "@/lib/routes"

/**
 * Loads every product card from the products API only once and shares it between all search boxes on
 * the page; matching then runs in the browser at every key press, without waiting for the network.
 */
const loadProducts = jsonLoader(productsApiPath, isProductsResponse)

type IndexState = { data: SearchCardData[] | null; error: boolean }

/** The search index. Loading starts only when enabled, for example when the search field gets focus. */
export function useSearchIndex(enabled = true) {
  const [state, setState] = useState<IndexState>({ data: null, error: false })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let active = true
    loadProducts().then(
      ({ items }) => active && setState({ data: items, error: false }),
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
