import { StarIcon } from "lucide-react"

import type { TestimonialInput } from "@/modules/catalog/types"
import { cn } from "@/lib/utils"

/** The five stars of a rating, each named by its value. */
const STARS = [1, 2, 3, 4, 5]

interface TestimonialsProps {
  testimonials: TestimonialInput[]
}

/** Customer reviews: shown only when there are real reviews in src/data/testimonials.ts. */
export function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null
  return (
    <section aria-labelledby="testimonials-heading">
      <h2
        id="testimonials-heading"
        className="mb-6 text-2xl font-bold md:text-3xl"
      >
        آراء عملائنا
      </h2>
      <ul className="grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <li
            key={`${testimonial.name}-${testimonial.title}`}
            className="space-y-3 rounded-2xl border bg-card p-6"
          >
            <p
              role="img"
              aria-label={`التقييم ${testimonial.rating} من 5`}
              className="flex gap-0.5 text-primary"
            >
              {STARS.map((star) => (
                <StarIcon
                  key={star}
                  aria-hidden
                  className={cn(
                    "size-4",
                    star <= testimonial.rating ? "fill-current" : "text-border"
                  )}
                />
              ))}
            </p>
            <p className="font-bold">{testimonial.title}</p>
            <p className="text-sm leading-7 text-muted-foreground">
              {testimonial.text}
            </p>
            <p className="text-sm font-bold">
              {testimonial.name}
              {testimonial.role && (
                <span className="font-normal text-muted-foreground">
                  {" "}
                  · {testimonial.role}
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
