import type { BannerTheme } from "@/lib/catalog/types"

/**
 * ألوان بطاقات الصفحة الرئيسية حسب السمة في src/data/home.ts.
 * كل تركيبة تجتاز تباين 4.5:1: الكهرماني على الكحلي 9.1:1، والكحلي على الكهرماني 9.1:1.
 */
export const BANNER_THEME: Record<
  BannerTheme,
  {
    surface: string
    tag: string
    muted: string
    price: string
    button: "cta" | "default"
  }
> = {
  primary: {
    surface: "bg-primary text-primary-foreground",
    tag: "bg-highlight text-highlight-foreground",
    muted: "text-primary-foreground-muted",
    price: "text-highlight",
    button: "cta",
  },
  highlight: {
    surface: "bg-highlight text-highlight-foreground",
    tag: "bg-primary text-primary-foreground",
    muted: "text-highlight-foreground/80",
    price: "text-primary",
    button: "default",
  },
  light: {
    surface: "bg-muted text-foreground",
    tag: "bg-primary text-primary-foreground",
    muted: "text-muted-foreground",
    price: "text-primary",
    button: "cta",
  },
}
