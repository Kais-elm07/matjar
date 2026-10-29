import Form from "next/form"
import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

/** حقل البحث: يفتح صفحة النتائج /search?q=... (تُبنى في مرحلة الكتالوج). */
export function SearchForm({ className }: { className?: string }) {
  return (
    <Form action="/search" role="search" className={cn("w-full", className)}>
      <InputGroup className="h-11 rounded-full bg-muted/60 has-[[data-slot=input-group-control]:focus-visible]:bg-background">
        <InputGroupAddon className="ps-4">
          <SearchIcon aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          name="q"
          placeholder="ابحث عن منتج..."
          aria-label="ابحث في المتجر"
          enterKeyHint="search"
          autoComplete="off"
          className="text-base"
        />
      </InputGroup>
    </Form>
  )
}
