import { defineRouting } from "next-intl/routing"

/**
 * Supported locales on timebookingpro.com.
 *
 * Adding a locale:
 * 1. Add the code to `locales` below (keep alphabetical after `en`).
 * 2. Create `messages/<code>.json` with the same key-shape as `en.json`.
 * 3. That's it — the `[locale]` segment + middleware pick it up automatically.
 *
 * The voice agent supports 7 languages per product scope: Greek, English,
 * Spanish, Portuguese, French, German, Arabic. We start with English and
 * add translations as they're ready.
 */
export const routing = defineRouting({
  locales: ["en"] as const,
  defaultLocale: "en",
  // `as-needed` keeps `/` on the default locale — no `/en` prefix — so
  // existing links, SEO, and inbound traffic don't break. Non-default
  // locales get a prefix: `/fr`, `/de`, etc.
  localePrefix: "as-needed",
})

export type Locale = (typeof routing.locales)[number]
