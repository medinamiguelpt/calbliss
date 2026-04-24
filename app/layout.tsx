import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import Script from "next/script"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages, getTranslations } from "next-intl/server"
import { Providers } from "@/components/providers"
import { AmbientShift } from "@/components/ui/ambient-shift"
import { CookieBanner } from "@/components/ui/cookie-banner"
import { PageIntro } from "@/components/ui/page-intro"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { ScrollHue } from "@/components/ui/scroll-hue"
import { SectionSound } from "@/components/ui/section-sound"
import { ScrollToTop } from "@/components/ui/scroll-to-top"
import { RippleGlobal } from "@/components/ui/ripple-global"
import { AnchorHighlight } from "@/components/ui/anchor-highlight"
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("metadata")])

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://timebookingpro.com"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      url: "https://timebookingpro.com",
      siteName: t("siteName"),
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakartaSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PageIntro />
          <ScrollProgress />
          <Providers>{children}</Providers>
          <CookieBanner />
          <ScrollHue />
          <AmbientShift />
          <SectionSound />
          <ScrollToTop />
          <RippleGlobal />
          <AnchorHighlight />
          <KeyboardShortcuts />
          {/* Plausible Analytics — privacy-friendly, no cookies required */}
          <Script
            defer
            data-domain="timebookingpro.com"
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
          {/* Google Tag Manager — add GTM_ID env var to activate */}
          {process.env.NEXT_PUBLIC_GTM_ID && (
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`}
            </Script>
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
