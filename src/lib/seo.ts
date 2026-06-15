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

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VOSTEX",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo-color.svg`,
    description:
      "Software engineering studio. We design and build custom software, platforms and automations so your business can run with clarity, speed and control.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valdivia",
      addressCountry: "CL",
    },
    sameAs: [
      "https://linkedin.com/company/vostex",
      "https://github.com/vostex",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VOSTEX",
    url: SITE_URL,
    inLanguage: ["en", "es"],
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "VOSTEX",
    url: SITE_URL,
    image: `${SITE_URL}/assets/logo-color.svg`,
    areaServed: ["CL", "Latin America"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valdivia",
      addressCountry: "CL",
    },
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vostex Build — Custom Systems & Platforms" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vostex Intel — Decision Systems & Data" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vostex Flow — Process Automation & Orchestration" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vostex Launch — Digital Product & Experience" } },
    ],
  };
}
