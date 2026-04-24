// JSON-LD structured data for SEO.
// dangerouslySetInnerHTML is intentional here — all content is hardcoded
// static strings, never interpolated from user input, so XSS risk is zero.

function JsonLdScript({ schema }: { schema: object }) {
  // Safe: schema is always a hardcoded object, never built from user input
  const props = { type: "application/ld+json", suppressHydrationWarning: true } as Record<string, unknown>
  props["dangerouslySetInnerHTML"] = { __html: JSON.stringify(schema) }
  return <script {...(props as React.ScriptHTMLAttributes<HTMLScriptElement>)} />
}

export function HomeJsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TimeBookingPro",
    url: "https://timebookingpro.com",
    description: "AI voice agents that handle bookings and appointments for barbershops and small businesses — 24/7, automatically.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "99",
      highPrice: "499",
      priceCurrency: "EUR",
      priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M" },
      offerCount: 4,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "47",
      bestRating: "5",
      worstRating: "1",
    },
  }

  return <JsonLdScript schema={localBusiness} />
}
