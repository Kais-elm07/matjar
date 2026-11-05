import { StoreShell } from "@/components/layout/store-shell"

interface StoreLayoutProps {
  children: React.ReactNode
}

/** The storefront layout: every page sits inside the shared store shell. */
export default function StoreLayout({ children }: StoreLayoutProps) {
  return <StoreShell>{children}</StoreShell>
}
