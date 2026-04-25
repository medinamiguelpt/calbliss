import { headers } from "next/headers"
import { setRequestLocale } from "next-intl/server"
import { pickTagline } from "@/lib/taglines"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { TechStrip } from "@/components/sections/tech-strip"
import { HowItWorks } from "@/components/sections/how-it-works"
import { AgentNamer } from "@/components/sections/agent-namer"
import { Features } from "@/components/sections/features"
import { BeforeAfter } from "@/components/sections/before-after"
import { ForWho } from "@/components/sections/for-who"
import { Pricing } from "@/components/sections/pricing"
import { Calculator } from "@/components/sections/calculator"
import { FinalCTA } from "@/components/sections/final-cta"
import { HomeJsonLd } from "@/components/seo/json-ld"
import { WaveDivider } from "@/components/ui/wave-divider"

export default async function Home(
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params
  setRequestLocale(locale)

  const headersList = await headers()
  const variant = (headersList.get("x-variant") ?? "a") as "a" | "b"
  // Pricing section default is deterministic (GR / EUR) per the unified-picker brief —
  // no geo-IP guessing on the pricing page. Geo headers stay available for other use cases.

  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Hero variant={variant} />
        <TechStrip />
        <HowItWorks  headline={pickTagline("howItWorks")} />
        <AgentNamer  headline={pickTagline("agentNamer")} />
        <WaveDivider opacity={0.5} />
        <Features    headline={pickTagline("features")} />
        <BeforeAfter headline={pickTagline("beforeAfter")} />
        <WaveDivider opacity={0.6} flip />
        <ForWho      headline={pickTagline("forWho")} />
        <Pricing     headline={pickTagline("pricing")} />
        <WaveDivider opacity={0.5} />
        <Calculator  headline={pickTagline("calculator")} />
        <FinalCTA    headline={pickTagline("finalCta")} />
      </main>
      <Footer />
      <HomeJsonLd />
    </>
  )
}
