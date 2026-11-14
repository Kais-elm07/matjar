"use client"

import { useFieldArray, useFormContext } from "react-hook-form"

import { AdminField } from "@/modules/admin/components/admin-field"
import {
  ADMIN_CARD,
  ADMIN_ROW,
  ADMIN_SECTION_TITLE,
} from "@/modules/admin/components/admin-styles"
import { PhotoPreview } from "@/modules/admin/components/photo-preview"
import { PhotoUploadButton } from "@/modules/admin/components/photo-upload-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  emptyImage,
  type ProductFormValues,
} from "@/modules/admin/product-form"
import { cn } from "@/lib/utils"

interface ProductImagesFieldsProps {
  /** Whether the server can keep uploaded photos (src/modules/admin/uploads.ts) */
  uploadEnabled: boolean
}

/** The product's photos in order: the first is its main photo. */
export function ProductImagesFields({
  uploadEnabled,
}: ProductImagesFieldsProps) {
  const { register, setValue } = useFormContext<ProductFormValues>()
  const { fields, append, remove } = useFieldArray<ProductFormValues, "images">(
    { name: "images" }
  )
  // How to fill a photo: upload it, or write the path of a photo the store already has
  const example = <span dir="ltr">/images/products/classic-cotton-shirt-1</span>
  const pathHint = uploadEnabled ? (
    <>
      ارفع صورة مفرّغة الخلفية (PNG أو WebP، حتى 4 ميغابايت)، أو اكتب مسار صورة
      في المتجر دون مقاس أو امتداد، مثل {example}
    </>
  ) : (
    <>دون مقاس أو امتداد، مثل {example}. رفع الصور غير مفعّل على هذا الخادم.</>
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
            <div className="flex items-start gap-3">
              <PhotoPreview index={index} />
              <AdminField
                id={`image-${index}-src`}
                label={`مسار الصورة ${index + 1}`}
                className="flex-1"
                hint={index === 0 ? pathHint : undefined}
              >
                <div className="flex gap-2">
                  <Input
                    id={`image-${index}-src`}
                    dir="ltr"
                    className="min-w-0 flex-1"
                    {...register(`images.${index}.src`)}
                  />
                  {uploadEnabled && (
                    <PhotoUploadButton
                      number={index + 1}
                      onUploaded={(src) =>
                        setValue(`images.${index}.src`, src, {
                          shouldDirty: true,
                        })
                      }
                    />
                  )}
                </div>
              </AdminField>
            </div>
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
