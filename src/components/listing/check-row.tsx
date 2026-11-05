"use client"

import { Checkbox } from "@/components/ui/checkbox"

interface CheckRowProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function CheckRow({ label, checked, onCheckedChange }: CheckRowProps) {
  return (
    <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      {label}
    </label>
  )
}
