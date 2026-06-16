import type { MetadataRoute } from "next";
import { LOCALES, localeUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((l) => [l, localeUrl(l)]));

  return LOCALES.map((locale) => ({
    url: localeUrl(locale),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}

export const dynamic = "force-static";
