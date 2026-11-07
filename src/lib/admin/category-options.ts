/**
 * The categories as options for a select menu, each labeled with its full path, such as
 * "ملابس › رجالي" (clothing › men), in the store's order.
 */
export function categoryOptions(
  categories: { slug: string; name: string; parent: string }[]
) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  return categories.map((category) => {
    const names: string[] = []
    const seen = new Set<string>()
    let current: typeof category | undefined = category
    while (current && !seen.has(current.slug)) {
      seen.add(current.slug)
      names.unshift(current.name)
      current = current.parent ? bySlug.get(current.parent) : undefined
    }
    return { slug: category.slug, label: names.join(" › ") }
  })
}
