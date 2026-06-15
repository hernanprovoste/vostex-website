export const SITE_URL = "https://vostex.io";
export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

/** Absolute URL for a locale's home. */
export function localeUrl(locale: string): string {
  return locale === "en" ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;
}

/** hreflang map for alternates.languages. */
export function hreflangAlternates(): Record<string, string> {
  const languages = Object.fromEntries(LOCALES.map((l) => [l, localeUrl(l)]));
  return { ...languages, "x-default": localeUrl("en") };
}

export const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
};
