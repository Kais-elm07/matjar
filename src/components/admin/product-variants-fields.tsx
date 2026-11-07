"use client"

import { useFieldArray, useFormContext } from "react-hook-form"

import { AdminField } from "@/components/admin/admin-field"
import {
  ADMIN_CARD,
  ADMIN_ROW,
  ADMIN_SECTION_TITLE,
} from "@/components/admin/admin-styles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { siteConfig } from "@/config/site"
import { emptyVariant, type ProductFormValues } from "@/lib/admin/product-form"
import { cn } from "@/lib/utils"

const { symbol } = siteConfig.currency

/** The product's variants: one row for each size and color combination, with its price and stock. */
export function ProductVariantsFields() {
  const { register } = useFormContext<ProductFormValues>()
  const { fields, append, remove } = useFieldArray<
    ProductFormValues,
    "variants"
  >({ name: "variants" })

  return (
    <section aria-labelledby="variants-heading" className={ADMIN_CARD}>
      <h2 id="variants-heading" className={ADMIN_SECTION_TITLE}>
        المتغيرات والأسعار
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        متغير واحد لمنتج دون خيارات، ومتغير لكل تركيبة من المقاس واللون. اكتب
        الخيارات هكذا: المقاس: M، اللون: أبيض
      </p>
      <ol className="space-y-4">
        {fields.map((field, index) => (
          <li
            key={field.id}
            className={cn(
              ADMIN_ROW,
              "grid-cols-2 md:grid-cols-[1fr_2fr_1fr_1fr_1fr_auto]"
            )}
          >
            <AdminField id={`variant-${index}-sku`} label="الرمز">
              <Input
                id={`variant-${index}-sku`}
                dir="ltr"
                {...register(`variants.${index}.sku`)}
              />
            </AdminField>
            <AdminField
              id={`variant-${index}-options`}
              label="الخيارات"
              optional
              className="col-span-2 md:col-span-1"
            >
              <Input
                id={`variant-${index}-options`}
                {...register(`variants.${index}.options`)}
              />
            </AdminField>
            <AdminField
              id={`variant-${index}-price`}
              label={`السعر (${symbol})`}
            >
              <Input
                id={`variant-${index}-price`}
                inputMode="decimal"
                {...register(`variants.${index}.price`)}
              />
            </AdminField>
            <AdminField
              id={`variant-${index}-compare`}
              label="قبل الخصم"
              optional
            >
              <Input
                id={`variant-${index}-compare`}
                inputMode="decimal"
                {...register(`variants.${index}.compareAtPrice`)}
              />
            </AdminField>
            <AdminField id={`variant-${index}-stock`} label="المخزون">
              <Input
                id={`variant-${index}-stock`}
                inputMode="numeric"
                {...register(`variants.${index}.stock`)}
              />
            </AdminField>
            <Button
              variant="outline"
              size="xl"
              disabled={fields.length === 1}
              aria-label={`حذف المتغير ${index + 1}`}
              onClick={() => remove(index)}
            >
              حذف
            </Button>
          </li>
        ))}
      </ol>
      <Button
        variant="outline"
        size="xl"
        className="mt-4"
        onClick={() => append({ ...emptyVariant })}
      >
        إضافة متغير
      </Button>
    </section>
  )
}
