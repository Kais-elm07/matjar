interface JsonLdProps {
  data: object
}

/**
 * بيانات منظمة لمحركات البحث (JSON-LD).
 * استبدال "<" يمنع إغلاق وسم script من داخل النص.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
