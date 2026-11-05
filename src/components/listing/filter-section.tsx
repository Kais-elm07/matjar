interface FilterSectionProps {
  title: string
  children: React.ReactNode
}

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section className="space-y-3 border-t pt-5">
      <h3 className="text-sm font-bold">{title}</h3>
      {children}
    </section>
  )
}
