export const SITE_URL = "https://vostex.io";
export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

/** Canonical path for a locale under localePrefix: as-needed (default "en" → "/"). */
export function localePath(locale: string): string {
  return locale === "en" ? "/" : `/${locale}`;
}

/** Absolute URL for a locale's home. */
export function localeUrl(locale: string): string {
  return locale === "en" ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;
}

/** hreflang map for alternates.languages. */
export function hreflangAlternates(): Record<string, string> {
  return {
    en: localeUrl("en"),
    es: localeUrl("es"),
    "x-default": localeUrl("en"),
  };
}

export const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
};
