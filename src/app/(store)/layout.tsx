import { StoreShell } from "@/components/layout/store-shell"

/** تخطيط واجهة المتجر: كل الصفحات داخل هيكل المتجر الموحد. */
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <StoreShell>{children}</StoreShell>
}
