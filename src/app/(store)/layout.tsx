import { StoreShell } from "@/components/layout/store-shell"

/** The storefront layout: every page sits inside the shared store shell. */
export default function StoreLayout({ children }: LayoutProps<"/">) {
  return <StoreShell>{children}</StoreShell>
}
