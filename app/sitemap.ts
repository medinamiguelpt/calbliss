import { MetadataRoute } from "next"
import { SITE_URL, COMPETITOR_SLUGS, VERTICALS } from "@/lib/constants"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL,                        lastModified: new Date(), changeFrequency: "weekly",  priority: 1 },
    { url: `${SITE_URL}/help`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/affiliate`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/partners`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/dashboard`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...VERTICALS.map((v) => ({
      url: `${SITE_URL}/for/${v}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...COMPETITOR_SLUGS.map((c) => ({
      url: `${SITE_URL}/vs/${c}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
