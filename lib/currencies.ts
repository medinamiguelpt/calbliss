/**
 * Currencies — per-tier local prices and locale-aware formatting.
 *
 * We do NOT convert EUR at runtime — every tier has a hand-picked, round
 * local price per currency. This mirrors how mature SaaS products handle
 * multi-currency (Linear, Notion, Vercel): psychologically clean numbers
 * in each market rather than FX output like €229 → $247.32.
 */

import { YEARLY_DISCOUNT, type TierPricing } from "./pricing";

export type CurrencyCode =
  | "EUR" | "USD" | "GBP" | "CHF" | "CAD" | "AUD"
  | "SEK" | "NOK" | "DKK" | "PLN" | "AED" | "JPY";

export interface Currency {
  code: CurrencyCode;
  locale: string;
  name: string;
  flag: string;
  decimals: 0 | 2;
  tierMonthly: Record<TierPricing["id"], number>;
  roundStep: number;
  overageByTier: Record<TierPricing["id"], number>;
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  EUR: { code: "EUR", locale: "en-IE", name: "Euro", flag: "🇪🇺", decimals: 2,
    tierMonthly: { starter: 229, professional: 429, enterprise: 859 }, roundStep: 1,
    overageByTier: { starter: 0.6, professional: 0.5, enterprise: 0.4 } },
  USD: { code: "USD", locale: "en-US", name: "US Dollar", flag: "🇺🇸", decimals: 2,
    tierMonthly: { starter: 249, professional: 479, enterprise: 939 }, roundStep: 1,
    overageByTier: { starter: 0.65, professional: 0.55, enterprise: 0.45 } },
  GBP: { code: "GBP", locale: "en-GB", name: "British Pound", flag: "🇬🇧", decimals: 2,
    tierMonthly: { starter: 199, professional: 379, enterprise: 759 }, roundStep: 1,
    overageByTier: { starter: 0.55, professional: 0.45, enterprise: 0.35 } },
  CHF: { code: "CHF", locale: "de-CH", name: "Swiss Franc", flag: "🇨🇭", decimals: 2,
    tierMonthly: { starter: 229, professional: 429, enterprise: 859 }, roundStep: 1,
    overageByTier: { starter: 0.6, professional: 0.5, enterprise: 0.4 } },
  CAD: { code: "CAD", locale: "en-CA", name: "Canadian Dollar", flag: "🇨🇦", decimals: 2,
    tierMonthly: { starter: 339, professional: 649, enterprise: 1299 }, roundStep: 1,
    overageByTier: { starter: 0.9, professional: 0.75, enterprise: 0.6 } },
  AUD: { code: "AUD", locale: "en-AU", name: "Australian Dollar", flag: "🇦🇺", decimals: 2,
    tierMonthly: { starter: 379, professional: 699, enterprise: 1399 }, roundStep: 1,
    overageByTier: { starter: 0.99, professional: 0.79, enterprise: 0.65 } },
  SEK: { code: "SEK", locale: "sv-SE", name: "Swedish Krona", flag: "🇸🇪", decimals: 2,
    tierMonthly: { starter: 2599, professional: 4899, enterprise: 9749 }, roundStep: 10,
    overageByTier: { starter: 6.9, professional: 5.7, enterprise: 4.5 } },
  NOK: { code: "NOK", locale: "nb-NO", name: "Norwegian Krone", flag: "🇳🇴", decimals: 2,
    tierMonthly: { starter: 2649, professional: 4949, enterprise: 9899 }, roundStep: 10,
    overageByTier: { starter: 6.9, professional: 5.7, enterprise: 4.5 } },
  DKK: { code: "DKK", locale: "da-DK", name: "Danish Krone", flag: "🇩🇰", decimals: 2,
    tierMonthly: { starter: 1699, professional: 3199, enterprise: 6399 }, roundStep: 10,
    overageByTier: { starter: 4.5, professional: 3.7, enterprise: 3.0 } },
  PLN: { code: "PLN", locale: "pl-PL", name: "Polish Zloty", flag: "🇵🇱", decimals: 2,
    tierMonthly: { starter: 999, professional: 1849, enterprise: 3699 }, roundStep: 1,
    overageByTier: { starter: 2.6, professional: 2.2, enterprise: 1.7 } },
  AED: { code: "AED", locale: "en-AE", name: "UAE Dirham", flag: "🇦🇪", decimals: 2,
    tierMonthly: { starter: 899, professional: 1699, enterprise: 3399 }, roundStep: 1,
    overageByTier: { starter: 2.4, professional: 2.0, enterprise: 1.6 } },
  JPY: { code: "JPY", locale: "ja-JP", name: "Japanese Yen", flag: "🇯🇵", decimals: 0,
    tierMonthly: { starter: 37000, professional: 70000, enterprise: 140000 }, roundStep: 100,
    overageByTier: { starter: 100, professional: 85, enterprise: 70 } },
};

export const CURRENCY_ORDER: CurrencyCode[] = [
  "EUR","USD","GBP","CHF","CAD","AUD","SEK","NOK","DKK","PLN","AED","JPY",
];

function prettyLocal(value: number, step: number): number {
  const rounded = Math.ceil(value / step) * step;
  return rounded - (step >= 10 ? 1 : step === 1 ? 1 : 0);
}

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency.decimals,
  }).format(amount);
}

export function yearlyLocal(currency: Currency, tierId: TierPricing["id"]): number {
  const monthly = currency.tierMonthly[tierId];
  return prettyLocal(monthly * 12 * (1 - YEARLY_DISCOUNT), currency.roundStep);
}

export function yearlyMonthlyEquivalentLocal(currency: Currency, tierId: TierPricing["id"]): number {
  return Math.round(yearlyLocal(currency, tierId) / 12);
}

export function yearlySavingsLocal(currency: Currency, tierId: TierPricing["id"]): number {
  return currency.tierMonthly[tierId] * 12 - yearlyLocal(currency, tierId);
}

export function applyDiscountLocal(amount: number, pct: number, step: number): number {
  return prettyLocal(amount * (1 - pct), step);
}
