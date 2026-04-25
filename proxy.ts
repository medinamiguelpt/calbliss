import createMiddleware from "next-intl/middleware"
import type { NextRequest } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export function proxy(request: NextRequest) {
  // next-intl handles locale detection + redirect to the right `/locale/...`.
  // Whatever response it produces (rewrite / redirect / passthrough) is what
  // we return — we just attach the A/B cookie + header on top.
  const response = intlMiddleware(request)

  // A/B test headline variant — sticky for 30 days, set/read regardless of locale.
  if (!request.cookies.get("cb-variant")) {
    const variant = Math.random() < 0.5 ? "a" : "b"
    response.cookies.set("cb-variant", variant, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    })
    response.headers.set("x-variant", variant)
  } else {
    const variant = request.cookies.get("cb-variant")?.value ?? "a"
    response.headers.set("x-variant", variant)
  }

  return response
}

export const config = {
  // Match all paths except API, Next internals, and static assets (anything with a dot).
  // next-intl's middleware decides what to rewrite/redirect within this set.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
