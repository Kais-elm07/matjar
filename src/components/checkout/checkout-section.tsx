interface CheckoutSectionProps {
  step: number
  title: string
  children: React.ReactNode
}

/** A numbered step in the order form: an orange circle with the number and a title, in a thin-bordered card. */
export function CheckoutSection({
  step,
  title,
  children,
}: CheckoutSectionProps) {
  return (
    <section
      aria-labelledby={`checkout-step-${step}`}
      className="rounded-xl border p-4 md:p-6"
    >
      <h2
        id={`checkout-step-${step}`}
        className="mb-4 flex items-center gap-3 text-lg font-bold"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}
