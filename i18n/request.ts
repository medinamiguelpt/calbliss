import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

/**
 * Per-request i18n config loader. Called by next-intl for every request.
 * Loads the matching JSON file from /messages/ based on the requested locale,
 * falling back to the default locale if the requested one isn't supported.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
