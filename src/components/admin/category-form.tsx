"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { AdminField } from "@/components/admin/admin-field"
import { ADMIN_CARD, ADMIN_FIELDS } from "@/components/admin/admin-styles"
import { FormProblems } from "@/components/admin/form-problems"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { saveCategory } from "@/lib/admin/actions"
import type { CategoryFormValues } from "@/lib/admin/category-form"
import { toast } from "@/lib/toast"

interface CategoryFormProps {
  /** The category's slug before the change, or null for a new category */
  original: string | null
  initial: CategoryFormValues
  /** The categories that can be its parent, each labeled with its full path */
  parents: { slug: string; label: string }[]
  /** The heading of the form's card */
  title: string
}

/** Adding or editing a category: its name, address, parent, description and cover photo. */
export function CategoryForm({
  original,
  initial,
  parents,
  title,
}: CategoryFormProps) {
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm<CategoryFormValues>({
    defaultValues: initial,
  })
  const [problems, setProblems] = useState<string[]>([])
  const [pending, startTransition] = useTransition()
  const prefix = `category-${original ?? "new"}`

  function submit(values: CategoryFormValues) {
    startTransition(async () => {
      const result = await saveCategory(original, values)
      if (!result.ok) {
        setProblems(result.problems)
        return
      }
      setProblems([])
      toast(original === null ? "أُضيفت الفئة." : "حُفظت الفئة.")
      if (original === null) reset()
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      aria-label={title}
      className={`${ADMIN_CARD} space-y-4`}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <FormProblems problems={problems} />
      <div className={ADMIN_FIELDS}>
        <AdminField id={`${prefix}-name`} label="الاسم">
          <Input id={`${prefix}-name`} {...register("name")} />
        </AdminField>
        <AdminField id={`${prefix}-slug`} label="الرابط">
          <Input id={`${prefix}-slug`} dir="ltr" {...register("slug")} />
        </AdminField>
        <AdminField id={`${prefix}-parent`} label="الفئة الأم" optional>
          <NativeSelect
            id={`${prefix}-parent`}
            className="w-full"
            {...register("parent")}
          >
            <NativeSelectOption value="">فئة رئيسية</NativeSelectOption>
            {parents.map((parent) => (
              <NativeSelectOption key={parent.slug} value={parent.slug}>
                {parent.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </AdminField>
        <AdminField
          id={`${prefix}-image`}
          label="صورة الغلاف"
          optional
          hint="مسار صورة منتج، أو اتركه فارغاً لصورة المنتج الأكثر مبيعاً"
        >
          <Input id={`${prefix}-image`} dir="ltr" {...register("imageSrc")} />
        </AdminField>
        <AdminField
          id={`${prefix}-description`}
          label="الوصف"
          optional
          className="md:col-span-2"
        >
          <Input id={`${prefix}-description`} {...register("description")} />
        </AdminField>
      </div>
      <Button type="submit" variant="cta" size="xl" disabled={pending}>
        {pending ? "جارٍ الحفظ..." : "حفظ الفئة"}
      </Button>
    </form>
  )
}
