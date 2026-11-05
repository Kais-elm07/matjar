interface JsonLdProps {
  data: object
}

/**
 * Structured data for search engines (JSON-LD).
 * Replacing "<" prevents the script tag from being closed from inside the text.
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
