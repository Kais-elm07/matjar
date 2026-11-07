import type { Metadata } from "next"

/** The admin panel (DESIGN.md: Admin panel): its own pages, outside the store's shell, never indexed. */
export const metadata: Metadata = {
  title: { default: "لوحة الإدارة", template: "%s | لوحة الإدارة" },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children
}
