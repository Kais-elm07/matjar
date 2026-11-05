import { StoreShell } from "@/components/layout/store-shell"

interface StoreLayoutProps {
  children: React.ReactNode
}

/** تخطيط واجهة المتجر: كل الصفحات داخل هيكل المتجر الموحد. */
export default function StoreLayout({ children }: StoreLayoutProps) {
  return <StoreShell>{children}</StoreShell>
}
