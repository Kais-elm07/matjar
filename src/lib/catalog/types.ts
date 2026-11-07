import type { OptionGroup, VariantOptions } from "@/lib/catalog/options"
import type { Tone } from "@/lib/tone"

// ---------------------------------------------------------------------------
// Shape of the data as written in the src/data files (prices in riyals)
// ---------------------------------------------------------------------------

export type CategoryInput = {
  /** The URL slug: English, lowercase, with hyphens, such as "home-kitchen" */
  slug: string
  name: string
  description?: string
  /**
   * The category's cover: the path of a product photo without an extension, such as
   * "/images/products/portable-speaker-2", shown on its tile. Default: the first photo of the
   * category's most popular product.
   */
  image?: string
  /** The parent category's slug, if this is a subcategory */
  parent?: string
}

export type ProductImageInput = {
  /** Image path without an extension, such as "/images/products/classic-cotton-shirt-1" */
  src: string
  /** Image description for screen readers. Default: the product name */
  alt?: string
  /** The color value this image belongs to; the gallery moves to it when that color is chosen */
  color?: string
  /**
   * The color of the light behind this photo, such as "#c2410c", instead of the color pnpm images
   * measures from the photo (DESIGN.md: the product's tone)
   */
  tone?: string
}

export type VariantInput = {
  sku: string
  /** { "المقاس": "L", "اللون": "أزرق" } (size L, color blue), or leave it empty for a product without options */
  options?: Record<string, string>
  price: number
  compareAtPrice?: number
  stock: number
}

export type ProductInput = {
  /** The URL slug: English, lowercase, with hyphens, such as "classic-cotton-shirt" */
  slug: string
  name: string
  /** The category's slug (it can be a subcategory) */
  category: string
  /** Paragraphs separated by a blank line; lines that start with "- " become bullet points */
  description: string
  specs?: { label: string; value: string }[]
  images: ProductImageInput[]
  variants: VariantInput[]
  /** For sorting by "الأكثر مبيعاً" (best selling): a higher number means a higher position */
  popularity?: number
  /** Date added, as 2026-10-30, for sorting by "الأحدث" (newest) */
  createdAt: string
  /**
   * The last day of the sale, as 2026-12-31. Shows the product in the "عروض لفترة محدودة" (limited-time deals) section
   * with a real countdown, and it leaves the section after this date. Needs a price before discount.
   * After the sale ends, the price goes back to the price before discount when the site is rebuilt, so rebuild once the sale ends.
   */
  saleEndsAt?: string
  /** Hide the product from the site without deleting it from the file */
  hidden?: boolean
}

/** A promo card for a product: its image and price come from the products file automatically. */
export type ProductBannerInput = {
  /** The product's slug */
  product: string
  title: string
  text?: string
  /** Text of the small badge. Default: the discount percentage, if the product has a discount */
  tag?: string
}

/** A promo card for a category: its image comes from the categories file. */
export type CategoryBannerInput = {
  /** The category's slug */
  category: string
  title: string
  text?: string
}

export type HomeContentInput = {
  /** Slides of the main hero at the top of the page */
  heroSlides: ProductBannerInput[]
  /** Three promo cards under the trust strip */
  promos: ProductBannerInput[]
  /** Two category cards after "الأكثر مبيعاً" (best sellers) */
  spotlights: CategoryBannerInput[]
  /** A wide card before the customer reviews, or null to hide it */
  wideBanner: ProductBannerInput | null
}

/** A real customer review. Do not add made-up reviews. */
export type TestimonialInput = {
  name: string
  /** The customer's description or city, such as "الرياض" (Riyadh) */
  role?: string
  rating: 1 | 2 | 3 | 4 | 5
  title: string
  text: string
}

// ---------------------------------------------------------------------------
// The unified shape after validation (prices in the smallest unit: halala)
// ---------------------------------------------------------------------------

export type CategoryLink = { slug: string; name: string }

/** A category in the category filter: name, slug and parent category */
export type CategoryOption = CategoryLink & { parentSlug: string | null }

/** A top-level category with its subcategories, as the header's category menu and the mobile menu show them. */
export type NavCategory = CategoryLink & { children: CategoryLink[] }

/**
 * How a photo is shown (DESIGN.md: the product's tone and Product photos): the tone of the light behind it,
 * and whether it is a cut-out, which floats on that light, or a regular photo, which is framed.
 */
export type PhotoLook = { tone: Tone; cutout: boolean }

/** A category's cover on its tile: a product photo with its look. Decorative, so it has no description. */
export type CoverPhoto = { src: string } & PhotoLook

export type Category = {
  slug: string
  name: string
  description: string | null
  image: CoverPhoto | null
  parentSlug: string | null
  childSlugs: string[]
  /** The path from the top-level category down to this category */
  path: CategoryLink[]
  /** Number of products in the category and its subcategories */
  productCount: number
}

export type ProductImage = {
  src: string
  alt: string
  color: string | null
} & PhotoLook

export type Variant = {
  sku: string
  options: VariantOptions
  price: number
  compareAtPrice: number | null
  stock: number
}

export type Product = {
  slug: string
  name: string
  description: string
  specs: { label: string; value: string }[]
  categoryPath: CategoryLink[]
  images: ProductImage[]
  variants: Variant[]
  optionGroups: OptionGroup[]
  /** The lowest price among the variants */
  price: number
  /** The price before discount of the cheapest variant, if there is a discount */
  compareAtPrice: number | null
  maxPrice: number
  inStock: boolean
  popularity: number
  createdAt: string
  saleEndsAt: string | null
}

/** A product's image in the cart and the order: only the path and the screen reader description. */
export type CardImage = { src: string; alt: string }

/** The photo on a product card: the image with its look, for the light in its photo box. */
export type CardPhoto = CardImage & PhotoLook

/** Product card data: everything the lists, filters and sorting need in the browser, and nothing else. */
export type ProductCardData = {
  slug: string
  name: string
  price: number
  compareAtPrice: number | null
  priceVaries: boolean
  inStock: boolean
  image: CardPhoto | null
  /** The most specific category name, shown above the product name on the card */
  categoryName: string | null
  /** For single-variant products: add to the cart directly from the card */
  quickAdd: { sku: string; stock: number } | null
  saleEndsAt: string | null
  /** The category path as slugs, for filtering by category */
  categorySlugs: string[]
  /** Variant options and availability, for filtering by size and color */
  variants: { options: VariantOptions; inStock: boolean }[]
  popularity: number
  createdAt: string
}

/** A card in the search index (the products API): the card plus normalized text for Arabic search. */
export type SearchCardData = ProductCardData & { searchText: string }

/** The answer of GET /api/products/: the matching cards and how many there are. */
export type ProductsResponse = { items: SearchCardData[]; total: number }

/** The card of a deal with a real end date, for "عروض لفترة محدودة" (Limited-time deals) and its countdown. */
export type DealCard = ProductCardData & { saleEndsAt: string }

/** A product banner (a hero slide, a promo tile or the wide banner) after it is linked to the product's data. */
export type ProductBanner = {
  href: string
  title: string
  text: string | null
  tag: string | null
  image: ProductImage | null
  price: number
  compareAtPrice: number | null
  priceVaries: boolean
}

/** A category promo card after it is linked to the category's data. */
export type CategoryBanner = {
  href: string
  title: string
  text: string | null
  image: CoverPhoto | null
}

/**
 * What pnpm images measured in each photo (public/images/image-meta.json), by its path in the data files:
 * its main color, or null when it has no clear color, and whether it is a cut-out.
 */
export type ImageMeta = Record<
  string,
  { color: string | null; cutout: boolean }
>

/**
 * A product Najm, the store's mascot, suggests after something is added to the cart: only what his
 * speech bubble shows and what adding it in one click needs (quickAdd, for a single-variant product).
 */
export type SimilarProduct = Pick<
  ProductCardData,
  "slug" | "name" | "price" | "compareAtPrice" | "priceVaries" | "quickAdd"
> & { image: CardImage | null }

/** The in-stock products similar to each product, by its slug (similar-products.json). */
export type SimilarProducts = Record<string, SimilarProduct[]>

/**
 * Prices and stock of every variant by SKU, which the cart saved in the browser is compared against.
 * options is the option combination key (optionsKey), to catch a SKU that now points to other options.
 */
export type CartCatalog = Record<
  string,
  {
    price: number
    compareAtPrice: number | null
    stock: number
    options: string
  }
>
