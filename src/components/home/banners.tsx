import Image from "next/image"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { formatPrice } from "@/lib/catalog/money"
import type { CategoryBanner, ProductBanner } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

/** تدرج داكن من أسفل الصورة يضمن قراءة النص الأبيض فوقها (DESIGN.md: النص فوق الصور). */
const IMAGE_SHADE =
  "absolute inset-0 bg-gradient-to-t from-background/95 via-background/45 to-background/10"

/** مربع صورة لمنتج في شبكة العروض: الصورة تملؤه، وفي أسفله الشارة والعنوان والسعر. */
export function PromoTile({
  banner,
  className,
  sizes = "(min-width: 768px) 30vw, 50vw",
}: {
  banner: ProductBanner
  className?: string
  sizes?: string
}) {
  return (
    <Link
      href={banner.href}
      className={cn(
        "group relative block overflow-hidden rounded-xl border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring",
        className
      )}
    >
      {banner.image && (
        <Image
          src={banner.image.src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      )}
      <span aria-hidden className={IMAGE_SHADE} />
      <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1.5 p-4">
        {banner.tag && (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
            {banner.tag}
          </span>
        )}
        <span className="text-base leading-snug font-bold md:text-lg">
          {banner.title}
        </span>
        <span className="text-sm text-foreground/85">
          {banner.priceVaries ? "يبدأ من " : "بسعر "}
          <span className="font-bold text-primary">
            {formatPrice(banner.price)}
          </span>
        </span>
      </span>
    </Link>
  )
}

/** بطاقة الخصم بجانب مربعات العروض: نسبة الخصم الحقيقية القصوى وزر "تسوّق العروض". */
export function DiscountCard({
  headingId,
  maxDiscount,
  className,
}: {
  /** معرّف العنوان، يربطه القسم المحيط به عبر aria-labelledby */
  headingId: string
  /** أكبر نسبة خصم بين المنتجات المخفضة، أو 0 إن لم توجد عروض */
  maxDiscount: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-3 rounded-xl border bg-card p-6 md:p-8",
        className
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">عروض مختارة</p>
      <h2
        id={headingId}
        className="text-2xl leading-snug font-bold md:text-3xl"
      >
        {maxDiscount > 0 ? (
          <>
            خصومات تصل إلى{" "}
            <span className="text-primary" dir="ltr">
              {maxDiscount}%
            </span>
          </>
        ) : (
          "خصومات على منتجات مختارة"
        )}
      </h2>
      <p className="text-sm leading-7 text-muted-foreground md:text-base">
        وفّر أكثر على منتجات مختارة من كل الأقسام، والدفع عند الاستلام كالمعتاد.
      </p>
      <Link
        href="/products?sale=1"
        className={cn(
          buttonVariants({ variant: "cta", size: "xl" }),
          "mt-2 self-start"
        )}
      >
        تسوّق العروض
      </Link>
    </div>
  )
}

/** بطاقة فئة مصوّرة: صورة الفئة تملأ البطاقة، والعنوان والوصف والزر فوق تدرج داكن. */
export function SpotlightCard({ banner }: { banner: CategoryBanner }) {
  return (
    <Link
      href={banner.href}
      className="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-xl border bg-muted p-6 outline-none focus-visible:ring-3 focus-visible:ring-ring md:min-h-64 md:p-8"
    >
      {banner.image && (
        <Image
          src={banner.image}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      )}
      <span aria-hidden className={IMAGE_SHADE} />
      <span className="relative flex max-w-md flex-col items-start gap-2">
        <h3 className="text-xl leading-snug font-bold md:text-2xl">
          {banner.title}
        </h3>
        {banner.text && (
          <span className="text-sm text-foreground/85 md:text-base">
            {banner.text}
          </span>
        )}
        <span
          className={cn(
            buttonVariants({ variant: "cta", size: "lg" }),
            "mt-2 px-5"
          )}
        >
          تسوّق الآن
        </span>
      </span>
    </Link>
  )
}

/** لافتة عريضة لمنتج: صورته تملأ اللافتة، والنص في جهة البداية فوق تدرج داكن. */
export function WideBanner({ banner }: { banner: ProductBanner }) {
  return (
    <section
      aria-labelledby="wide-banner-heading"
      className="relative overflow-hidden rounded-xl border bg-muted"
    >
      {banner.image && (
        <Image
          src={banner.image.src}
          alt=""
          fill
          sizes="(min-width: 1280px) 1232px, 100vw"
          className="object-cover"
        />
      )}
      {/* الموقع عربي الاتجاه دائماً: التدرج الداكن من اليمين حيث النص، ويخف نحو الصورة في اليسار */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/70 to-background/25"
      />
      <div className="relative flex min-h-64 flex-col justify-center gap-3 p-6 md:min-h-80 md:max-w-xl md:p-12">
        {banner.tag && (
          <p className="inline-flex self-start rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
            {banner.tag}
          </p>
        )}
        <h2
          id="wide-banner-heading"
          className="text-2xl leading-snug font-bold md:text-4xl"
        >
          {banner.title}
        </h2>
        {banner.text && (
          <p className="text-base text-foreground/85">{banner.text}</p>
        )}
        <p className="flex flex-wrap items-baseline gap-x-2 text-base">
          {banner.priceVaries ? "يبدأ من" : "بسعر"}
          <span className="text-2xl font-bold text-primary md:text-3xl">
            {formatPrice(banner.price)}
          </span>
          {banner.compareAtPrice && (
            <>
              <span className="sr-only">بدلاً من</span>
              <del className="text-muted-foreground">
                {formatPrice(banner.compareAtPrice)}
              </del>
            </>
          )}
        </p>
        <Link
          href={banner.href}
          className={cn(
            buttonVariants({ variant: "cta", size: "xl" }),
            "mt-1 self-start"
          )}
        >
          تسوّق الآن
        </Link>
      </div>
    </section>
  )
}
