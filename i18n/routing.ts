import { defineRouting } from "next-intl/routing"

/**
 * Supported locales on timebookingpro.com.
 *
 * Locale codes are region-suffixed where ambiguity matters (es could be LatAm,
 * pt could be Brazilian, etc.) so the Accept-Language matching and SEO tags
 * are precise. URL prefixes stay short via `prefixes` mapping below.
 *
 * Adding a locale:
 * 1. Add the code to `locales`.
 * 2. Add a URL prefix in `prefixes` (unless the locale code already works as a clean URL).
 * 3. Create `messages/<code>.json` with the same key shape as `en.json`.
 * 4. Update LOCALE_META in components/ui/locale-switcher.tsx with the flag + label.
 */
export const routing = defineRouting({
  locales: ["en", "el", "es-ES", "pt-PT", "fr-FR", "de-DE", "ar-SA"] as const,
  defaultLocale: "en",
  // `as-needed` keeps `/` on the default locale — no `/en` prefix — so existing
  // links, SEO, and inbound traffic don't break. Non-default locales get their
  // mapped prefix.
  localePrefix: {
    mode: "as-needed",
    prefixes: {
      "es-ES": "/es",
      "pt-PT": "/pt",
      "fr-FR": "/fr",
      "de-DE": "/de",
      "ar-SA": "/ar",
    },
  },
})

export type Locale = (typeof routing.locales)[number]

/** Locales that render right-to-left. Layout sets <html dir="rtl"> for these. */
export const RTL_LOCALES = new Set<Locale>(["ar-SA"])
