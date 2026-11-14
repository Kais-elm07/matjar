"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"

import { AdminField } from "@/modules/admin/components/admin-field"
import {
  ADMIN_CARD,
  ADMIN_FIELDS,
  ADMIN_SECTION_TITLE,
} from "@/modules/admin/components/admin-styles"
import { FormProblems } from "@/modules/admin/components/form-problems"
import { ProductImagesFields } from "@/modules/admin/components/product-images-fields"
import { ProductVariantsFields } from "@/modules/admin/components/product-variants-fields"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { saveProduct } from "@/modules/admin/actions"
import type { ProductFormValues } from "@/modules/admin/product-form"
import { adminPaths } from "@/lib/routes"
import { toast } from "@/lib/toast"

interface ProductFormProps {
  /** The product's id, or null for a new product */
  id: number | null
  initial: ProductFormValues
  /** The categories to choose from, each with its full path as its label */
  categories: { slug: string; label: string }[]
  /** Whether photos can be uploaded (Supabase Storage is set up) */
  uploadEnabled: boolean
}

/**
 * Adding or editing a product in the admin panel. The server checks everything again with the same
 * rules as the data files and answers with the problems to fix, or saves and returns to the list.
 */
export function ProductForm({
  id,
  initial,
  categories,
  uploadEnabled,
}: ProductFormProps) {
  const router = useRouter()
  const form = useForm<ProductFormValues>({ defaultValues: initial })
  const { register } = form
  const [problems, setProblems] = useState<string[]>([])
  const [pending, startTransition] = useTransition()

  function submit(values: ProductFormValues) {
    startTransition(async () => {
      const result = await saveProduct(id, values)
      if (!result.ok) {
        setProblems(result.problems)
        window.scrollTo({ top: 0 })
        return
      }
      setProblems([])
      toast(id === null ? "أُضيف المنتج إلى المتجر." : "حُفظ المنتج.")
      router.push(adminPaths.products)
    })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <FormProblems problems={problems} />

        <section aria-labelledby="basics-heading" className={ADMIN_CARD}>
          <h2 id="basics-heading" className={ADMIN_SECTION_TITLE}>
            البيانات الأساسية
          </h2>
          <div className={ADMIN_FIELDS}>
            <AdminField id="product-name" label="الاسم">
              <Input id="product-name" {...register("name")} />
            </AdminField>
            <AdminField
              id="product-slug"
              label="الرابط"
              hint="بأحرف إنجليزية صغيرة وأرقام وشرطات، مثل classic-shirt"
            >
              <Input id="product-slug" dir="ltr" {...register("slug")} />
            </AdminField>
            <AdminField id="product-category" label="الفئة">
              <NativeSelect
                id="product-category"
                className="w-full"
                {...register("category")}
              >
                <NativeSelectOption value="">اختر الفئة</NativeSelectOption>
                {categories.map((category) => (
                  <NativeSelectOption key={category.slug} value={category.slug}>
                    {category.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </AdminField>
            <AdminField
              id="product-popularity"
              label="ترتيب الأكثر مبيعاً"
              hint="رقم أكبر يضع المنتج أولاً في «الأكثر مبيعاً»"
            >
              <Input
                id="product-popularity"
                inputMode="numeric"
                {...register("popularity")}
              />
            </AdminField>
            <AdminField
              id="product-description"
              label="الوصف"
              optional
              hint="سطر فارغ بين الفقرات"
              className="md:col-span-2"
            >
              <Textarea
                id="product-description"
                rows={5}
                {...register("description")}
              />
            </AdminField>
            <AdminField
              id="product-specs"
              label="المواصفات"
              optional
              hint="مواصفة في كل سطر، مثل: الخامة: قطن"
              className="md:col-span-2"
            >
              <Textarea id="product-specs" rows={4} {...register("specs")} />
            </AdminField>
          </div>
        </section>

        <ProductImagesFields uploadEnabled={uploadEnabled} />
        <ProductVariantsFields />

        <section aria-labelledby="dates-heading" className={ADMIN_CARD}>
          <h2 id="dates-heading" className={ADMIN_SECTION_TITLE}>
            العرض والظهور
          </h2>
          <div className={ADMIN_FIELDS}>
            <AdminField
              id="product-created"
              label="تاريخ الإضافة"
              hint="يرتّب «وصل حديثاً»"
            >
              <Input
                id="product-created"
                type="date"
                {...register("createdAt")}
              />
            </AdminField>
            <AdminField
              id="product-sale-ends"
              label="آخر يوم في العرض"
              optional
              hint="يحتاج سعراً قبل الخصم في متغير واحد على الأقل"
            >
              <Input
                id="product-sale-ends"
                type="date"
                {...register("saleEndsAt")}
              />
            </AdminField>
            <Controller
              control={form.control}
              name="hidden"
              render={({ field }) => (
                <label className="flex min-h-11 items-center gap-3 text-sm font-medium md:col-span-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                  إخفاء المنتج من المتجر
                </label>
              )}
            />
          </div>
        </section>

        <FormProblems problems={problems} />
        <Button type="submit" variant="cta" size="xl" disabled={pending}>
          {pending ? "جارٍ الحفظ..." : "حفظ المنتج"}
        </Button>
      </form>
    </FormProvider>
  )
}
