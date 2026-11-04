"use client"

import { useId, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, LoaderIcon, SearchIcon } from "lucide-react"

import { searchCards } from "@/lib/catalog/filter"
import { formatPrice } from "@/lib/catalog/money"
import { useSearchIndex } from "@/lib/catalog/use-search-index"
import { cn } from "@/lib/utils"

const MAX_SUGGESTIONS = 6

const searchHref = (query: string) => `/search/?q=${encodeURIComponent(query)}`

/**
 * حقل البحث مع اقتراحات فورية أثناء الكتابة.
 * الأسهم تتنقل بين الاقتراحات، وEnter يفتح الاقتراح أو صفحة النتائج، وEscape يغلق القائمة.
 * variant="header": حبة رمادية قصيرة تتسع عند التركيز، وتأخذ لون الرأس فوق الواجهة.
 */
export function SearchBox({
  className,
  defaultValue = "",
  autoFocus = false,
  variant = "default",
  onSubmitted,
}: {
  className?: string
  defaultValue?: string
  autoFocus?: boolean
  variant?: "default" | "header"
  /** يُستدعى بعد الانتقال إلى نتيجة أو صفحة النتائج، لإغلاق حقل بحث الجوال مثلاً */
  onSubmitted?: () => void
}) {
  const router = useRouter()
  const id = useId()
  const listId = `${id}-suggestions`
  const inputRef = useRef<HTMLInputElement>(null)
  const header = variant === "header"

  const [query, setQuery] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [indexWanted, setIndexWanted] = useState(false)
  const { data: index, error } = useSearchIndex(indexWanted)

  const trimmed = query.trim()
  const results = useMemo(
    () =>
      index && trimmed
        ? searchCards(index, trimmed).slice(0, MAX_SUGGESTIONS)
        : [],
    [index, trimmed]
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
    if (selected) router.push(`/product/${selected.slug}`)
    else if (trimmed) router.push(searchHref(trimmed))
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
      className={cn(
        "relative",
        header
          ? "w-40 transition-[width] duration-300 focus-within:w-64 lg:w-52 lg:focus-within:w-80"
          : "w-full",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center rounded-full border transition-colors focus-within:border-ring/50",
          header
            ? "h-10 border-transparent bg-muted ps-0.5 pe-2 text-foreground group-data-[tone=light]/hdr:bg-white/15 group-data-[tone=light]/hdr:text-primary-foreground"
            : "h-11 border-border bg-background ps-1 pe-3 text-foreground"
        )}
      >
        <button
          type="submit"
          aria-label="بحث"
          className="flex size-9 shrink-0 items-center justify-center rounded-full outline-none hover:bg-foreground/5 group-data-[tone=light]/hdr:hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-ring [&_svg]:size-5"
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
            activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
          }
          enterKeyHint="search"
          autoComplete="off"
          className={cn(
            "min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden",
            header
              ? "text-sm group-data-[tone=light]/hdr:placeholder:text-white/75"
              : "text-base"
          )}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => {
            setIndexWanted(true)
            setOpen(true)
          }}
          onBlur={close}
          onKeyDown={onKeyDown}
        />
      </div>

      {showPanel && (
        <div
          // منع فقدان التركيز عند النقر على اقتراح
          onMouseDown={(event) => event.preventDefault()}
          className={cn(
            "absolute top-full z-50 mt-2 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg",
            header ? "inset-x-0 min-w-80" : "inset-x-0"
          )}
        >
          {error ? (
            <p className="p-4 text-sm text-muted-foreground">
              تعذّر تحميل الاقتراحات. اضغط Enter للبحث.
            </p>
          ) : !index ? (
            <p className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
              <LoaderIcon className="size-4 animate-spin" aria-hidden />
              جارٍ البحث...
            </p>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm">
              لا توجد منتجات تطابق «{trimmed}». جرّب كلمة أخرى.
            </p>
          ) : (
            <ul id={listId} role="listbox" aria-label="اقتراحات البحث">
              {results.map((product, index) => (
                <li
                  key={product.slug}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <Link
                    href={`/product/${product.slug}`}
                    tabIndex={-1}
                    onClick={finish}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 transition-colors hover:bg-muted",
                      index === activeIndex && "bg-muted"
                    )}
                  >
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      {product.image && (
                        <Image
                          src={product.image.src}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 text-sm font-medium">
                        {product.name}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {product.priceVaries && "من "}
                        {formatPrice(product.price)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={searchHref(trimmed)}
            tabIndex={-1}
            onClick={finish}
            className="flex items-center justify-between gap-2 border-t px-3 py-3 text-sm font-medium text-primary transition-colors hover:bg-muted"
          >
            عرض كل النتائج لـ «{trimmed}»
            <ArrowLeftIcon className="size-4 ltr:rotate-180" aria-hidden />
          </Link>
        </div>
      )}
    </form>
  )
}
