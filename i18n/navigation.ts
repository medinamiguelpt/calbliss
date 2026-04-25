import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

/**
 * Locale-aware navigation primitives. Always import these instead of the
 * raw `next/link` / `next/navigation` equivalents inside translated UI —
 * they automatically rewrite hrefs to include the active locale prefix
 * and respect the URL-prefix mapping defined in `./routing`.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
