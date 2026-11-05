import type { LucideIcon } from "lucide-react"

interface TrustItemProps {
  icon: LucideIcon
  text: string
}

export function TrustItem({ icon: Icon, text }: TrustItemProps) {
  return (
    <li className="flex items-center gap-2">
      <Icon className="size-4 shrink-0 text-primary" aria-hidden />
      {text}
    </li>
  )
}
