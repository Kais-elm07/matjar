import type { BannerTheme } from "@/lib/catalog/types"

/**
 * ألوان بطاقات الصفحة الرئيسية حسب السمة في src/data/home.ts.
 * primary: كحلي بنص أبيض. highlight: داكن (#111) بنص أبيض. light: رمادي فاتح بنص داكن.
 * لا كهرماني هنا، فهو لشارات الخصم فقط.
 */
export const BANNER_THEME: Record<
  BannerTheme,
  {
    surface: string
    tag: string
    muted: string
    price: string
    button: "cta" | "on-image"
  }
> = {
  primary: {
    surface: "bg-primary text-primary-foreground",
    tag: "bg-background text-foreground",
    muted: "text-primary-foreground-muted",
    price: "text-primary-foreground",
    button: "on-image",
  },
  highlight: {
    surface: "bg-foreground text-background",
    tag: "bg-background text-foreground",
    muted: "text-background/70",
    price: "text-background",
    button: "on-image",
  },
  light: {
    surface: "bg-muted text-foreground",
    tag: "bg-background text-foreground",
    muted: "text-muted-foreground",
    price: "text-primary",
    button: "cta",
  },
}
