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
import { emptyImage, type ProductFormValues } from "@/lib/admin/product-form"
import { cn } from "@/lib/utils"

/** The product's photos in order: the first is its main photo. */
export function ProductImagesFields() {
  const { register } = useFormContext<ProductFormValues>()
  const { fields, append, remove } = useFieldArray<ProductFormValues, "images">(
    { name: "images" }
  )

  return (
    <section aria-labelledby="images-heading" className={ADMIN_CARD}>
      <h2 id="images-heading" className={ADMIN_SECTION_TITLE}>
        الصور
      </h2>
      <ol className="space-y-4">
        {fields.map((field, index) => (
          <li
            key={field.id}
            className={cn(ADMIN_ROW, "md:grid-cols-[2fr_1fr_1fr_auto]")}
          >
            <AdminField
              id={`image-${index}-src`}
              label={`مسار الصورة ${index + 1}`}
              hint={
                index === 0 ? (
                  <>
                    دون مقاس أو امتداد، مثل{" "}
                    <span dir="ltr">
                      /images/products/classic-cotton-shirt-1
                    </span>
                  </>
                ) : undefined
              }
            >
              <Input
                id={`image-${index}-src`}
                dir="ltr"
                {...register(`images.${index}.src`)}
              />
            </AdminField>
            <AdminField id={`image-${index}-color`} label="لونها" optional>
              <Input
                id={`image-${index}-color`}
                {...register(`images.${index}.color`)}
              />
            </AdminField>
            <AdminField id={`image-${index}-alt`} label="وصفها" optional>
              <Input
                id={`image-${index}-alt`}
                {...register(`images.${index}.alt`)}
              />
            </AdminField>
            <Button
              variant="outline"
              size="xl"
              disabled={fields.length === 1}
              aria-label={`حذف الصورة ${index + 1}`}
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
        onClick={() => append({ ...emptyImage })}
      >
        إضافة صورة
      </Button>
    </section>
  )
}
