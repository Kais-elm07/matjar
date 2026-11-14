"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveStocks } from "@/modules/admin/actions"
import { toWesternDigits } from "@/lib/arabic-digits"
import { toast } from "@/lib/toast"

interface StockEditorProps {
  /** Each variant's SKU, its options as text (or the SKU for a product without options), and its stock */
  variants: { sku: string; label: string; stock: number }[]
}

/** The stock of every variant of a product, edited from the products list without opening the product. */
export function StockEditor({ variants }: StockEditorProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [values, setValues] = useState(() =>
    Object.fromEntries(variants.map((v) => [v.sku, String(v.stock)]))
  )

  function save(event: React.FormEvent) {
    event.preventDefault()
    startTransition(async () => {
      const result = await saveStocks(
        variants.map(({ sku }) => ({
          sku,
          stock: Number(toWesternDigits(values[sku] ?? "").trim()),
        }))
      )
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      toast(result.message)
      router.refresh()
    })
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {variants.map((variant) => {
          const id = `stock-${variant.sku}`
          return (
            <li key={variant.sku} className="space-y-1.5">
              <Label htmlFor={id}>{variant.label}</Label>
              <Input
                id={id}
                inputMode="numeric"
                value={values[variant.sku] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [variant.sku]: event.target.value,
                  }))
                }
              />
            </li>
          )
        })}
      </ul>
      <Button type="submit" variant="cta" size="xl" disabled={pending}>
        {pending ? "جارٍ الحفظ..." : "حفظ المخزون"}
      </Button>
    </form>
  )
}
