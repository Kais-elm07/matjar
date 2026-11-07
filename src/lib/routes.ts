import type { CategoryLink } from "@/lib/catalog/types"

/**
 * The addresses of the store's product, category and static pages, in one place. They end with a
 * slash, the form the site serves (trailingSlash in next.config.ts); without it, the server answers with a redirect.
 */
export const productPath = (slug: string) => `/product/${slug}/`
export const categoryPath = (slug: string) => `/category/${slug}/`
export const contentPagePath = (slug: string) => `/pages/${slug}/`
export const searchPath = (query: string) =>
  `/search/?q=${encodeURIComponent(query)}`

/** The links of a category path, from the top category down, for the breadcrumbs and their search engine data. */
export function categoryTrail(path: CategoryLink[]) {
  return path.map((link) => ({
    name: link.name,
    href: categoryPath(link.slug),
  }))
}
