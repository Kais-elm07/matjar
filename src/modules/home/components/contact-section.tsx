import { ContactCards } from "@/modules/content/components/contact-cards"

/** "تواصل معنا" (Contact us) at the end of the home page: a centered heading and the contact channel cards. */
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
