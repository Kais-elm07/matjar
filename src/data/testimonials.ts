import type { TestimonialInput } from "@/lib/catalog/types"

/**
 * Customer reviews on the home page.
 *
 * The section does not show while the list is empty. Add only real reviews here, with their authors' permission,
 * because made-up reviews mislead visitors. An example of the shape:
 *
 *   {
 *     name: "سارة", // Sarah
 *     role: "جدة", // Jeddah
 *     rating: 5,
 *     title: "توصيل سريع وتغليف ممتاز", // Fast delivery and excellent packaging
 *     text: "وصلني الطلب خلال يومين، والمنتج مطابق للصور تماماً.", // My order arrived within two days, and the product matches the photos exactly.
 *   },
 */
export const testimonials: TestimonialInput[] = []
