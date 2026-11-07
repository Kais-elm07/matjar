"use client"

import { useId, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

import { productPath, searchPath } from "@/lib/routes"
import { searchCards } from "@/lib/search/search-cards"
import { useSearchIndex } from "@/lib/search/use-search-index"
import { cn } from "@/lib/utils"

const MAX_SUGGESTIONS = 6

// The suggestions list's code loads when the field gets focus, before the first letter, not with every page
const loadSuggestions = () =>
  import("@/components/search/search-suggestions").then(
    (mod) => mod.SearchSuggestions
  )
const SearchSuggestions = dynamic(loadSuggestions, { ssr: false })

interface SearchBoxProps {
  className?: string
  autoFocus?: boolean
  variant?: "default" | "header"
  /** Called after going to a result or the results page, for example to close the mobile search field */
  onSubmitted?: () => void
}

/**
 * The search field, with instant suggestions while typing.
 * The arrow keys move between suggestions, Enter opens the suggestion or the results page,
 * and Escape closes the list.
 * variant="header": the field in the middle of the header on desktop, with a softer border, smaller
 * text and a wider list of suggestions (DESIGN.md: search-input).
 */
export function SearchBox({
  className,
  autoFocus = false,
  variant = "default",
  onSubmitted,
}: SearchBoxProps) {
  const router = useRouter()
  const fieldId = useId()
  const listId = `${fieldId}-suggestions`
  const optionId = (position: number) => `${fieldId}-option-${position}`
  const inputRef = useRef<HTMLInputElement>(null)
  const header = variant === "header"

  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  // The search index loads the first time the field gets focus
  const [needsIndex, setNeedsIndex] = useState(false)
  const { data: searchIndex, error } = useSearchIndex(needsIndex)

  const trimmed = query.trim()
  const results = useMemo(
    () =>
      searchIndex && trimmed
        ? searchCards(searchIndex, trimmed).slice(0, MAX_SUGGESTIONS)
        : [],
    [searchIndex, trimmed]
  )
  const showPanel = open && trimmed.length > 0

  function close() {
    setOpen(false)
    setActiveIndex(-1)
  }

  function finish() {
    close()
    inputRef.current?.blur()
    onSubmitted?.()
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const selected = results[activeIndex]
    if (selected) router.push(productPath(selected.slug))
    else if (trimmed) router.push(searchPath(trimmed))
    else return
    finish()
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((current) => Math.min(current + 1, results.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, -1))
    } else if (event.key === "Escape") {
      close()
    }
  }

  return (
    <form
      role="search"
      action="/search/"
      onSubmit={submit}
      className={cn("relative w-full", className)}
    >
      <div
        className={cn(
          "flex items-center rounded-full border bg-muted text-foreground transition-colors focus-within:border-primary/70",
          "h-11",
          header ? "border-border/70 ps-0.5 pe-2" : "ps-1 pe-3"
        )}
      >
        <button
          type="submit"
          aria-label="بحث"
          // The invisible ::after area makes the 36 px button a 44 px touch target
          className="relative flex size-9 shrink-0 items-center justify-center rounded-full outline-none after:absolute after:-inset-1 hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring [&_svg]:size-5"
        >
          <SearchIcon aria-hidden />
        </button>
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={query}
          autoFocus={autoFocus}
          placeholder="ابحث عن منتج..."
          aria-label="ابحث في المتجر"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          enterKeyHint="search"
          autoComplete="off"
          className={cn(
            "min-w-0 flex-1 self-stretch bg-transparent outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden",
            header ? "text-sm" : "text-base"
          )}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => {
            setNeedsIndex(true)
            setOpen(true)
            void loadSuggestions()
          }}
          onBlur={close}
          onKeyDown={onKeyDown}
        />
      </div>

      {showPanel && (
        <div
          // Prevent losing focus when a suggestion is clicked
          onMouseDown={(event) => event.preventDefault()}
          className={cn(
            "absolute top-full z-50 mt-2 overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-lg",
            header ? "inset-x-0 min-w-80" : "inset-x-0"
          )}
        >
          <SearchSuggestions
            query={trimmed}
            results={results}
            status={error ? "error" : searchIndex ? "ready" : "loading"}
            listId={listId}
            optionId={optionId}
            activeIndex={activeIndex}
            onNavigate={finish}
          />
        </div>
      )}
    </form>
  )
}
