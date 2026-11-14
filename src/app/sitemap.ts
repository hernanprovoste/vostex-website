import type { MetadataRoute } from "next";
import { LOCALES, localeUrl, pageAlternates, pageUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((l) => [l, localeUrl(l)]));

  const home: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: localeUrl(locale),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
  }));

  const contact: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: pageUrl(locale, "/contact"),
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.8,
    alternates: { languages: pageAlternates("/contact") },
  }));

  return [...home, ...contact];
}

export const dynamic = "force-static";
