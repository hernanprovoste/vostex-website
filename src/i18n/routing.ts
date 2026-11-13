import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: true,
  // Translated URLs. Keys are the internal paths (the folders under
  // src/app/[locale]); values are what visitors see per language, e.g.
  // /contact in English and /es/contacto in Spanish. Every new page must be
  // added here with both translations.
  pathnames: {
    "/": "/",
    "/contact": {
      en: "/contact",
      es: "/contacto",
    },
  },
});
