import { NextResponse } from "next/server"
import Stripe from "stripe"
import { checkoutQuerySchema, parseQuery } from "@/lib/schemas"

const PLANS: Record<string, { monthly: string; annual: string; name: string }> = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "",
    annual:  process.env.STRIPE_PRICE_STARTER_ANNUAL  ?? "",
    name: "Starter",
  },
  growth: {
    monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY ?? "",
    annual:  process.env.STRIPE_PRICE_GROWTH_ANNUAL  ?? "",
    name: "Growth",
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
    annual:  process.env.STRIPE_PRICE_PRO_ANNUAL  ?? "",
    name: "Pro",
  },
}

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://timebookingpro.com"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const parsed = parseQuery(checkoutQuerySchema, searchParams)
  if (parsed.error) return NextResponse.redirect(new URL("/#pricing", req.url))
  const { plan, billing, ref } = parsed.data

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.redirect(new URL("/#get-started", req.url))
  }

  const planConfig = PLANS[plan]
  if (!planConfig) return NextResponse.redirect(new URL("/#pricing", req.url))

  const priceId = billing === "annual" ? planConfig.annual : planConfig.monthly
  if (!priceId) {
    console.warn(`[checkout] Missing Stripe price ID for ${plan}/${billing}`)
    return NextResponse.redirect(new URL("/#get-started", req.url))
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${BASE}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${BASE}/#pricing`,
      allow_promotion_codes: true,
      metadata: { plan, billing, ref },
    })
    return NextResponse.redirect(session.url!)
  } catch (err) {
    console.error("[checkout]", err)
    return NextResponse.redirect(new URL("/#get-started", req.url))
  }
}
