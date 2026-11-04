import { ContactCards } from "@/components/content/contact-cards"

/** "تواصل معنا" في نهاية الصفحة الرئيسية: عنوان في المنتصف وبطاقات وسائل التواصل. */
export function ContactSection() {
  return (
    <section aria-labelledby="contact-heading" className="text-center">
      <h2 id="contact-heading" className="text-2xl font-bold md:text-3xl">
        تواصل معنا
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">
        نجيب عن استفساراتك قبل الطلب وبعده، عبر الوسيلة التي تناسبك.
      </p>
      <ContactCards className="mt-8 text-start lg:grid-cols-4" />
    </section>
  )
}
