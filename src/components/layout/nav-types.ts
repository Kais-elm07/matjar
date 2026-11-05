/** A top-level category with its subcategories, as the header's category menu and the mobile menu show them. */
export type NavCategory = {
  slug: string
  name: string
  children: { slug: string; name: string }[]
}
