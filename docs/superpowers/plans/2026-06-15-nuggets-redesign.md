# Nuggets-Style Redesign + SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the Vostex one-pager into the "Nuggets" visual language (giant stacked display type, strong dark/white alternation, accent-word highlighting, hairline-divided items) while keeping the brand colors/fonts and the browser-window project mockups, and make the site SEO-technically complete.

**Architecture:** Pure front-end re-skin of existing `src/components/sections/*`, `src/components/layout/*`, `src/components/ui/*` and `src/app/globals.css`, plus a small SEO layer (per-locale `generateMetadata`, `sitemap.ts`, `robots.ts`, dynamic OG image, expanded JSON-LD) and a routing change to `localePrefix: 'as-needed'`. No new functionality, no new dependencies.

**Tech Stack:** Next.js 16 (App Router, Turbopack), Tailwind v4, framer-motion, next-intl v4, Lucide. Middleware is `src/proxy.ts` (renamed from `middleware.ts` in Next 16).

---

## Environment notes (read once)

- `next` and `pnpm` are NOT on PATH. Install deps with `corepack pnpm install`. Run the Next CLI via the local binary: `node node_modules/next/dist/bin/next <cmd>`.
- Build/typecheck gate used throughout: `node node_modules/next/dist/bin/next build`
- Dev server for visual/route checks: `node node_modules/next/dist/bin/next dev` (default port 3000).
- Working branch: `develop`. The working tree already contains an earlier redesign + prior UI fixes (skip link, JSON-LD Organization, contrast fixes). Build on top of it.
- Contrast rule (hard constraint): accent cyan `#00C2FF` only on dark backgrounds. On light backgrounds use `#0090C8` for large headings (≥24px) and `#0077A8` for small text. Body text on `#060D1A` uses `#94A3B8` (never `#4A5568`).

## File Structure

**Create:**
- `src/components/ui/SectionHeading.tsx` — reusable eyebrow + giant title (+ optional subtitle), tone-aware accent. Used by Problem, Services, Process, Portfolio, About, Contact.
- `src/components/ui/HairlineItem.tsx` — reusable "hairline-top → icon/number → title → text" item used by Problem, Services, Process, About.
- `src/app/sitemap.ts` — sitemap with per-locale alternates.
- `src/app/robots.ts` — robots + sitemap pointer.
- `src/app/[locale]/opengraph-image.tsx` — dynamic 1200×630 OG image per locale.
- `src/lib/seo.ts` — shared SEO constants (site URL, locales) + JSON-LD builders.

**Modify:**
- `src/app/globals.css` — accent classes, hairline helper, section spacing tokens.
- `src/i18n/routing.ts` — `localePrefix: 'as-needed'`.
- `src/app/page.tsx` — remove redirect (root now served as default locale).
- `src/proxy.ts` — confirm/adjust matcher for as-needed.
- `src/app/[locale]/layout.tsx` — `generateMetadata` per locale; expanded JSON-LD.
- `messages/en.json`, `messages/es.json` — SEO keys.
- `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`
- `src/components/sections/{Hero,Problem,Services,Process,Portfolio,About,Contact}.tsx`

---

## Task 1: Visual foundation — globals.css + SectionHeading + HairlineItem

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/ui/SectionHeading.tsx`
- Create: `src/components/ui/HairlineItem.tsx`

- [ ] **Step 1: Add accent + hairline + display helpers to globals.css**

Append after the `.text-glow-cyan` block in `src/app/globals.css`:

```css
/* === Nuggets-style helpers === */

/* Tone-aware accent word inside headings. Parent sets data-tone. */
[data-tone="light"] .accent { color: #0090C8; }
[data-tone="dark"] .accent { color: #00C2FF; }

/* Inline keyword highlight inside body copy (smaller text → stricter contrast). */
[data-tone="light"] .kw { color: #0077A8; font-weight: 600; }
[data-tone="dark"] .kw { color: #00C2FF; font-weight: 600; }

/* Hairline rule above an editorial item. */
.hairline-light { border-top: 1px solid rgba(13, 31, 60, 0.12); }
.hairline-dark { border-top: 1px solid rgba(255, 255, 255, 0.12); }

/* Giant stacked display heading. */
.display-stack {
  font-family: var(--font-space-grotesk);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 0.98;
}
```

- [ ] **Step 2: Create `src/components/ui/SectionHeading.tsx`**

```tsx
import { ReactNode } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

type Props = {
  eyebrow: string;
  title: ReactNode; // wrap accent words in <span className="accent">
  subtitle?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = "light",
  align = "left",
  className = "",
}: Props) {
  const titleColor = tone === "dark" ? "text-white" : "text-[#0D1F3C]";
  const eyebrowColor = tone === "dark" ? "text-[#00C2FF]" : "text-[#0077A8]";
  const subColor = tone === "dark" ? "text-[#94A3B8]" : "text-[#4A5568]";
  const alignCls = align === "center" ? "text-center mx-auto items-center" : "";

  return (
    <AnimatedSection
      data-tone={tone}
      className={`flex flex-col gap-5 ${alignCls} ${className}`}
    >
      <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowColor}`}>
        {eyebrow}
      </p>
      <h2
        className={`display-stack ${titleColor}`}
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg leading-relaxed max-w-2xl ${subColor}`}>{subtitle}</p>
      )}
    </AnimatedSection>
  );
}
```

> Note: `AnimatedSection` already spreads unknown props onto its `motion.div`? It does not — it only accepts `children/className/delay/direction`. So add a `data-tone` passthrough to `AnimatedSection` in Step 3.

- [ ] **Step 3: Allow `data-tone` passthrough on AnimatedSection**

Modify `src/components/ui/AnimatedSection.tsx` — update the `Props` type and the `motion.div`:

```tsx
type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  "data-tone"?: "light" | "dark";
};
```

And on the returned `motion.div`, add the attribute:

```tsx
    <motion.div
      data-tone={props["data-tone"]}
      className={className}
```

Update the function signature to capture the rest:

```tsx
export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  ...props
}: Props) {
```

- [ ] **Step 4: Create `src/components/ui/HairlineItem.tsx`**

```tsx
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

type Props = {
  tone?: "light" | "dark";
  /** Big index label like "01" — used by Process. Mutually exclusive with icon. */
  index?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
  /** Optional small tag, e.g. "Core". */
  tag?: string;
  accentTitle?: boolean;
  className?: string;
};

export function HairlineItem({
  tone = "light",
  index,
  icon: Icon,
  title,
  description,
  tag,
  accentTitle = false,
  className = "",
}: Props) {
  const hairline = tone === "dark" ? "hairline-dark" : "hairline-light";
  const accent = tone === "dark" ? "#00C2FF" : "#0090C8";
  const titleColor = accentTitle
    ? ""
    : tone === "dark"
      ? "text-white"
      : "text-[#0D1F3C]";
  const descColor = tone === "dark" ? "text-[#94A3B8]" : "text-[#4A5568]";
  const indexColor = tone === "dark" ? "text-[#00C2FF]" : "text-[#0090C8]";

  return (
    <div className={`${hairline} pt-6 flex flex-col gap-3 h-full ${className}`}>
      {index && (
        <span
          className={`text-sm font-semibold tabular-nums ${indexColor}`}
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {index}
        </span>
      )}
      {Icon && (
        <Icon
          size={24}
          strokeWidth={1.5}
          style={{ color: accent }}
        />
      )}
      <div className="flex items-center gap-2">
        <h3
          className={`text-lg font-bold ${titleColor}`}
          style={{
            fontFamily: "var(--font-space-grotesk)",
            ...(accentTitle ? { color: accent } : {}),
          }}
        >
          {title}
        </h3>
        {tag && (
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/25 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        )}
      </div>
      <p className={`text-sm leading-relaxed ${descColor}`}>{description}</p>
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `node node_modules/next/dist/bin/next build`
Expected: "Compiled successfully", "Finished TypeScript" with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/ui/SectionHeading.tsx src/components/ui/HairlineItem.tsx src/components/ui/AnimatedSection.tsx
git commit -m "feat(ui): add Nuggets-style foundation (accent/hairline helpers, SectionHeading, HairlineItem)"
```

---

## Task 2: Routing → `localePrefix: 'as-needed'`

**Files:**
- Modify: `src/i18n/routing.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/proxy.ts` (verify matcher)

- [ ] **Step 1: Read current proxy.ts**

Run: open `src/proxy.ts`. Confirm it creates the next-intl middleware from `routing`. (It should be `createMiddleware(routing)` with a `config.matcher`.) No code change needed if it imports `routing`; the `localePrefix` flows from routing config.

- [ ] **Step 2: Set localePrefix in routing.ts**

Replace `src/i18n/routing.ts` with:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: true,
});
```

- [ ] **Step 3: Remove the apex redirect**

The default locale is now served at `/`, so the manual redirect must go. Replace `src/app/page.tsx` so it renders the same home as `[locale]`. Simplest correct approach in next-intl as-needed: delete the redirect and let the `[locale]` segment handle `/`. Replace file contents with a re-export of the locale page is NOT valid (params differ). Instead, delete `src/app/page.tsx` entirely.

Run: `git rm src/app/page.tsx`

> Rationale: with `as-needed`, next-intl rewrites `/` to the default locale internally; the root `page.tsx` would shadow that and 404 params. Removing it lets `/[locale]/page.tsx` serve `/`.

- [ ] **Step 4: Verify build + routes**

Run: `node node_modules/next/dist/bin/next build`
Expected: build passes; route list shows `/[locale]` (dynamic) and no separate static `/` conflict.

Then run dev and check:
Run: `node node_modules/next/dist/bin/next dev` (background), then in another shell:
`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/` → Expected: `200`
`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/es` → Expected: `200`
`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/en` → Expected: `307` (redirects to `/`) or `200` per next-intl as-needed; either is acceptable as long as `/` and `/es` are 200.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/routing.ts
git rm src/app/page.tsx
git commit -m "feat(i18n): use localePrefix as-needed (English at /, Spanish at /es)"
```

---

## Task 3: Shared SEO module + per-locale metadata

**Files:**
- Create: `src/lib/seo.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `messages/en.json`, `messages/es.json`

- [ ] **Step 1: Add SEO message keys**

In `messages/en.json`, add a top-level `"seo"` object (after `"nav"`):

```json
  "seo": {
    "title": "VOSTEX — Engineered systems for real-world operations",
    "description": "Software engineering studio in Valdivia, Chile. We design and build custom software, platforms and automations so your business runs with clarity, speed and control.",
    "ogAlt": "VOSTEX — Engineered systems for real-world operations"
  },
```

In `messages/es.json`, add:

```json
  "seo": {
    "title": "VOSTEX — Sistemas de software para operaciones reales",
    "description": "Estudio de ingeniería de software en Valdivia, Chile. Diseñamos y construimos software, plataformas y automatizaciones a medida para que tu operación funcione con claridad, velocidad y control.",
    "ogAlt": "VOSTEX — Sistemas de software para operaciones reales"
  },
```

- [ ] **Step 2: Create `src/lib/seo.ts`**

```ts
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
```

- [ ] **Step 3: Replace the static `metadata` export with `generateMetadata` in `src/app/[locale]/layout.tsx`**

Remove the existing `export const metadata: Metadata = { ... }` block. Add these imports near the top:

```tsx
import { getTranslations } from "next-intl/server";
import {
  SITE_URL,
  localeUrl,
  hreflangAlternates,
  OG_LOCALE,
} from "@/lib/seo";
```

(`getTranslations` is already imported in this file from the prior skip-link work — do not duplicate the import.)

Add the function (above `LocaleLayout`):

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const url = localeUrl(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: url,
      languages: hreflangAlternates(),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
      siteName: "VOSTEX",
      locale: OG_LOCALE[locale] ?? "en_US",
      alternateLocale: Object.values(OG_LOCALE).filter(
        (l) => l !== (OG_LOCALE[locale] ?? "en_US")
      ),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    icons: {
      icon: "/assets/isotipo.svg",
      apple: "/assets/isotipo.svg",
    },
  };
}
```

> The OG/Twitter `images` are provided automatically by Next from `opengraph-image.tsx` (Task 5) — do not hardcode them here.

- [ ] **Step 4: Verify build**

Run: `node node_modules/next/dist/bin/next build`
Expected: passes. (Type: `generateMetadata` returns `Promise<Metadata>`.)

- [ ] **Step 5: Verify rendered tags**

Run dev server. Then:
`curl -s http://localhost:3000/ | grep -i 'hreflang'` → Expected: lines for `en`, `es`, `x-default`.
`curl -s http://localhost:3000/es | grep -i '<title>'` → Expected: Spanish title.
Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo.ts src/app/[locale]/layout.tsx messages/en.json messages/es.json
git commit -m "feat(seo): per-locale metadata, canonical and hreflang alternates"
```

---

## Task 4: sitemap.ts + robots.ts

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL, LOCALES, localeUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, localeUrl(l)])
  );

  return LOCALES.map((locale) => ({
    url: localeUrl(locale),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}

export const dynamic = "force-static";
void SITE_URL;
```

> `void SITE_URL;` keeps the import referenced if unused after edits; remove if you reference it directly. (You can drop the `SITE_URL` import instead — either is fine, just no unused-import error.)

Cleaner: drop `SITE_URL` from the import and the `void` line:

```ts
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
```

- [ ] **Step 2: Create `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

- [ ] **Step 3: Verify build + routes**

Run: `node node_modules/next/dist/bin/next build`
Expected: route list now includes `/sitemap.xml` and `/robots.txt`.

Run dev, then:
`curl -s http://localhost:3000/sitemap.xml` → Expected: XML with `https://vostex.io/` and `https://vostex.io/es` plus `xhtml:link` alternates.
`curl -s http://localhost:3000/robots.txt` → Expected: `Allow: /` and `Sitemap: https://vostex.io/sitemap.xml`.
Stop dev.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat(seo): add sitemap and robots with per-locale alternates"
```

---

## Task 5: Dynamic OG image per locale

**Files:**
- Create: `src/app/[locale]/opengraph-image.tsx`

- [ ] **Step 1: Create `src/app/[locale]/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VOSTEX";

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060D1A",
          padding: 80,
        }}
      >
        <div
          style={{
            color: "#00C2FF",
            fontSize: 28,
            letterSpacing: 8,
            fontWeight: 700,
          }}
        >
          VOSTEX
        </div>
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          {t("title").replace("VOSTEX — ", "")}
        </div>
        <div style={{ color: "#94A3B8", fontSize: 28 }}>vostex.io</div>
      </div>
    ),
    { ...size }
  );
}
```

> Uses the default system font (no custom font fetch) to avoid asset/network coupling. Renders on the Edge/Node runtime Next chooses for `opengraph-image`.

- [ ] **Step 2: Verify build + route**

Run: `node node_modules/next/dist/bin/next build`
Expected: passes; route list includes `/[locale]/opengraph-image`.

Run dev, then open `http://localhost:3000/opengraph-image` and `http://localhost:3000/es/opengraph-image` in a browser (or `curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:3000/opengraph-image` → Expected: `200 image/png`). Stop dev.

- [ ] **Step 3: Confirm metadata references the image**

Run: `curl -s http://localhost:3000/ | grep -i 'og:image'` → Expected: an `og:image` meta pointing at the generated image. (Next wires this automatically from `opengraph-image.tsx`.)

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/opengraph-image.tsx"
git commit -m "feat(seo): dynamic per-locale Open Graph image"
```

---

## Task 6: Expanded JSON-LD (WebSite + ProfessionalService)

**Files:**
- Modify: `src/lib/seo.ts` (add builders)
- Modify: `src/app/[locale]/layout.tsx` (render builders, replace inline Organization)

- [ ] **Step 1: Add JSON-LD builders to `src/lib/seo.ts`**

Append:

```ts
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
```

- [ ] **Step 2: Replace the inline `organizationSchema` in `src/app/[locale]/layout.tsx`**

Remove the existing `const organizationSchema = { ... }` object and its single `<script>`. Import the builders:

```tsx
import {
  SITE_URL,
  localeUrl,
  hreflangAlternates,
  OG_LOCALE,
  organizationJsonLd,
  websiteJsonLd,
  professionalServiceJsonLd,
} from "@/lib/seo";
```

In the body, replace the prior single JSON-LD `<script>` with:

```tsx
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              organizationJsonLd(),
              websiteJsonLd(),
              professionalServiceJsonLd(),
            ]),
          }}
        />
```

- [ ] **Step 3: Verify build + output**

Run: `node node_modules/next/dist/bin/next build`
Expected: passes.

Run dev, then: `curl -s http://localhost:3000/ | grep -c 'application/ld+json'` → Expected: `1` (one script tag containing an array of 3 objects). Validate the JSON array is well-formed. Stop dev.

- [ ] **Step 4: Commit**

```bash
git add src/lib/seo.ts "src/app/[locale]/layout.tsx"
git commit -m "feat(seo): add WebSite + ProfessionalService JSON-LD"
```

---

## Task 7: Hero re-skin (dark, left-aligned, giant)

**Files:**
- Modify: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Replace the centered hero block with a left-aligned editorial layout**

Replace the `return (...)` body of `src/components/sections/Hero.tsx` with:

```tsx
  return (
    <section
      data-tone="dark"
      className="relative min-h-dvh flex flex-col justify-center overflow-hidden bg-[#060D1A] bg-texture px-4 sm:px-6 lg:px-8 pt-24 pb-16"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 30%, rgba(0,194,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2FF]">
            VOSTEX
          </span>
        </motion.div>

        {/* Headline — stacked, last word accented */}
        <motion.h1
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: prefersReduced ? 0 : 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="display-stack text-white max-w-5xl"
          style={{ fontSize: "clamp(2.75rem, 8vw, 6rem)" }}
        >
          {words.map((word, i) => (
            <span key={i} className="inline-block mr-[0.25em]">
              {i === words.length - 1 ? <span className="accent">{word}</span> : word}
            </span>
          ))}
        </motion.h1>

        {/* Bottom row: subheadline (left) + CTAs (right) */}
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: prefersReduced ? 0 : 0.4 }}
          className="mt-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        >
          <p
            className="text-lg sm:text-xl text-[#94A3B8] max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {t("subheadline")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <GlowButton variant="primary" onClick={() => scrollTo("contact")}>
              {t("cta_primary")}
            </GlowButton>
            <GlowButton variant="secondary" onClick={() => scrollTo("portfolio")}>
              {t("cta_secondary")}
            </GlowButton>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollTo("services")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#94A3B8] hover:text-[#00C2FF] transition-colors cursor-pointer min-h-[44px]"
        aria-label={t("scroll")}
      >
        <span className="text-xs tracking-widest uppercase">{t("scroll")}</span>
        <ArrowDown size={16} />
      </motion.button>
    </section>
  );
```

> Keep the existing imports, `useTranslations`, `useReducedMotion`, `headline/words` logic and `scrollTo` helper unchanged. The `data-tone="dark"` on the section enables the `.accent` color via the global CSS rule.

- [ ] **Step 2: Verify build**

Run: `node node_modules/next/dist/bin/next build`
Expected: passes.

- [ ] **Step 3: Visual check**

Run dev → open `http://localhost:3000/`. Confirm: headline is large, left-aligned, last word cyan; subheadline + 2 CTAs share the bottom row on desktop and stack on mobile; no horizontal scroll at 375px. Stop dev.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat(hero): left-aligned giant display headline, Nuggets style"
```

---

## Task 8: Problem re-skin (white, hairline items)

**Files:**
- Modify: `src/components/sections/Problem.tsx`

- [ ] **Step 1: Replace Problem with SectionHeading + HairlineItem**

Replace the whole file `src/components/sections/Problem.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { FileSpreadsheet, EyeOff, UserX } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HairlineItem } from "@/components/ui/HairlineItem";

const painIcons = {
  spreadsheets: FileSpreadsheet,
  visibility: EyeOff,
  keypeople: UserX,
};

type PainKey = keyof typeof painIcons;

export function Problem() {
  const t = useTranslations("problem");
  const pains: PainKey[] = ["spreadsheets", "visibility", "keypeople"];

  return (
    <section className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <SectionHeading
          tone="light"
          eyebrow={t("label")}
          title={t("title")}
          subtitle={<span data-tone="light">{t("bridge")}</span>}
        />

        <div className="grid grid-cols-1 gap-8">
          {pains.map((key, i) => (
            <AnimatedSection key={key} delay={i * 0.1}>
              <HairlineItem
                tone="light"
                icon={painIcons[key]}
                title={t(`pains.${key}.title`)}
                description={t(`pains.${key}.description`)}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build + visual**

Run: `node node_modules/next/dist/bin/next build` → passes.
Run dev → confirm 3 pain points show hairline rule on top, icon in `#0090C8`, no gray boxes. Stop dev.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Problem.tsx
git commit -m "feat(problem): editorial hairline layout"
```

---

## Task 9: Services re-skin (now DARK, hairline columns)

**Files:**
- Modify: `src/components/sections/Services.tsx`

- [ ] **Step 1: Replace Services — dark section, intro split, hairline columns**

Replace the whole file `src/components/sections/Services.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Code2, Brain, Zap, Globe } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HairlineItem } from "@/components/ui/HairlineItem";

const serviceIcons = { build: Code2, intel: Brain, flow: Zap, launch: Globe };
type ServiceKey = keyof typeof serviceIcons;

export function Services() {
  const t = useTranslations("services");
  const services: { key: ServiceKey; featured: boolean }[] = [
    { key: "build", featured: true },
    { key: "flow", featured: false },
    { key: "intel", featured: false },
    { key: "launch", featured: false },
  ];

  return (
    <section
      id="services"
      data-tone="dark"
      className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-[#060D1A]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 items-end">
          <SectionHeading
            tone="dark"
            eyebrow={t("label")}
            title={t("title")}
          />
          <AnimatedSection delay={0.1}>
            <p className="text-[#94A3B8] text-lg leading-relaxed">{t("subtitle")}</p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map(({ key, featured }, index) => (
            <AnimatedSection key={key} delay={index * 0.1}>
              <HairlineItem
                tone="dark"
                icon={serviceIcons[key]}
                title={t(`items.${key}.name`)}
                description={`${t(`items.${key}.tagline`)} — ${t(`items.${key}.description`)}`}
                tag={featured ? t(`items.${key}.badge`) : undefined}
                accentTitle={featured}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

> `Build` keeps emphasis via `tag` ("Core service") + accent-colored title, replacing the old navy box. Tagline + description are joined into one description line to fit the hairline column format.

- [ ] **Step 2: Verify build + visual**

Run: `node node_modules/next/dist/bin/next build` → passes.
Run dev → confirm Services is dark, 4 hairline columns, Build's title is cyan with a "Core service" tag, secondary text is `#94A3B8` (legible). Stop dev.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Services.tsx
git commit -m "feat(services): dark section with hairline service columns"
```

---

## Task 10: Process re-skin (white, big numbers, hairline)

**Files:**
- Modify: `src/components/sections/Process.tsx`

- [ ] **Step 1: Replace Process**

Replace the whole file `src/components/sections/Process.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HairlineItem } from "@/components/ui/HairlineItem";

const stepKeys = ["diagnose", "design", "build", "launch"] as const;

export function Process() {
  const t = useTranslations("process");

  return (
    <section className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#0D1F3C]/10">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          tone="light"
          eyebrow={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stepKeys.map((key, i) => (
            <AnimatedSection key={key} delay={i * 0.1}>
              <HairlineItem
                tone="light"
                index={String(i + 1).padStart(2, "0")}
                title={t(`steps.${key}.title`)}
                description={t(`steps.${key}.description`)}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build + visual**

Run: `node node_modules/next/dist/bin/next build` → passes.
Run dev → confirm 01–04 numbered hairline columns. Stop dev.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Process.tsx
git commit -m "feat(process): numbered hairline steps"
```

---

## Task 11: Portfolio re-skin (white, editorial; keep browser window)

**Files:**
- Modify: `src/components/sections/Portfolio.tsx`

- [ ] **Step 1: Swap the header block to SectionHeading; keep the browser-window case intact**

In `src/components/sections/Portfolio.tsx`:

1. Add import:
```tsx
import { SectionHeading } from "@/components/ui/SectionHeading";
```

2. Replace the existing header `AnimatedSection` block (the one containing the `<p>` label, `<h2>`, and subtitle `<p>`) with:
```tsx
        <SectionHeading
          tone="light"
          eyebrow={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-16"
        />
```

3. Bump section padding: change `className="py-20 md:py-32 ...` to `className="py-24 md:py-36 ...` (keep the rest of that className: `px-4 sm:px-6 lg:px-8 bg-white border-t border-[#0D1F3C]/10`).

4. Leave the entire featured-case block (the browser chrome + `Image` screenshot + pills + testimonial + CTA) UNCHANGED — the browser-window mockup must stay exactly as is.

- [ ] **Step 2: Verify build + visual**

Run: `node node_modules/next/dist/bin/next build` → passes.
Run dev → confirm the heading is the new giant style and the browser-window Tognarelli case is visually unchanged. Stop dev.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Portfolio.tsx
git commit -m "feat(portfolio): editorial heading, keep browser-window case"
```

---

## Task 12: About re-skin (now DARK; commitments as the big row)

**Files:**
- Modify: `src/components/sections/About.tsx`

- [ ] **Step 1: Replace About — dark section, hairline commitments + values**

Replace the whole file `src/components/sections/About.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import {
  ShieldCheck, Layers, TrendingUp, Users, RefreshCw,
  Clock, LifeBuoy, KeyRound, MessageSquare,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HairlineItem } from "@/components/ui/HairlineItem";

const valueIcons = {
  reliability: ShieldCheck, versatility: Layers, scalability: TrendingUp,
  accessibility: Users, transformation: RefreshCw,
};
type ValueKey = keyof typeof valueIcons;

const commitmentIcons = {
  response: Clock, support: LifeBuoy, ownership: KeyRound, clarity: MessageSquare,
};
type CommitmentKey = keyof typeof commitmentIcons;

export function About() {
  const t = useTranslations("about");
  const values: ValueKey[] = ["reliability", "versatility", "scalability", "accessibility", "transformation"];
  const commitments: CommitmentKey[] = ["response", "support", "ownership", "clarity"];

  return (
    <section
      id="about"
      data-tone="dark"
      className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-[#060D1A]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 items-start">
          <SectionHeading tone="dark" eyebrow={t("label")} title={t("title")} />
          <AnimatedSection delay={0.1} className="flex flex-col gap-5">
            <p className="text-[#94A3B8] text-lg leading-relaxed">{t("description")}</p>
            <p className="text-xs text-[#94A3B8] font-medium">{t("founder")}</p>
          </AnimatedSection>
        </div>

        {/* Commitments — the qualitative "stat row" */}
        <AnimatedSection>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2FF] mb-8">
            {t("commitments_label")}
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {commitments.map((key, i) => (
            <AnimatedSection key={key} delay={i * 0.08}>
              <HairlineItem
                tone="dark"
                icon={commitmentIcons[key]}
                title={t(`commitments.${key}.title`)}
                description={t(`commitments.${key}.description`)}
              />
            </AnimatedSection>
          ))}
        </div>

        {/* Values */}
        <AnimatedSection>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2FF] mb-8">
            {t("values_label")}
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((key, i) => (
            <AnimatedSection key={key} delay={i * 0.08}>
              <HairlineItem
                tone="dark"
                icon={valueIcons[key]}
                title={t(`values.${key}.title`)}
                description={t(`values.${key}.description`)}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

> The navy logo card is dropped (the section is already dark/branded). Commitments now read as the big line-divided row that visually replaces Nuggets' stat band.

- [ ] **Step 2: Verify build + visual**

Run: `node node_modules/next/dist/bin/next build` → passes.
Run dev → confirm About is dark, commitments are a 4-up hairline row, values a 3-up hairline grid, all text legible (`#94A3B8`). Stop dev.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/About.tsx
git commit -m "feat(about): dark section, commitments as qualitative hairline row"
```

---

## Task 13: Contact re-skin (dark, giant heading)

**Files:**
- Modify: `src/components/sections/Contact.tsx`

- [ ] **Step 1: Swap the header block to SectionHeading (centered), keep the form unchanged**

In `src/components/sections/Contact.tsx`:

1. Add import:
```tsx
import { SectionHeading } from "@/components/ui/SectionHeading";
```

2. Add `data-tone="dark"` to the `<section>` element (so `.accent`/`.kw` resolve): change the opening section tag to include it alongside the existing classes:
```tsx
    <section id="contact" data-tone="dark" className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-[#0D1F3C] relative overflow-hidden">
```
(Note the padding bump from `py-20 md:py-32` to `py-24 md:py-36`.)

3. Replace the header `AnimatedSection` block (label `<p>` + `<h2>` + subtitle `<p>`) with:
```tsx
        <SectionHeading
          tone="dark"
          align="center"
          eyebrow={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
          className="mb-12"
        />
```

4. Leave the `<form>` and all field markup UNCHANGED (validation, spinner, a11y already done).

- [ ] **Step 2: Verify build + visual**

Run: `node node_modules/next/dist/bin/next build` → passes.
Run dev → confirm Contact heading is the giant centered style on navy; form works and is legible. Stop dev.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Contact.tsx
git commit -m "feat(contact): giant centered heading on dark"
```

---

## Task 14: Navbar + Footer polish for the new rhythm

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Confirm Navbar still behaves with the new section tones**

The Navbar's light/dark switch is keyed off the hero height (`main > section` offsetHeight), which is unchanged. No logic change needed. Verify the scrollspy still highlights `#services`, `#about`, `#contact` (these ids are preserved in Tasks 9, 12, 13). No edit unless a regression is found.

- [ ] **Step 2: Enlarge the footer wordmark (minor)**

In `src/components/layout/Footer.tsx`, change the brand `Image` height class from `h-7` to `h-8` and `width/height` props from `110/28` to `126/32`:
```tsx
            <Image
              src="/assets/logo-white.svg"
              alt="VOSTEX"
              width={126}
              height={32}
              className="h-8 w-auto"
            />
```

- [ ] **Step 3: Verify build + visual**

Run: `node node_modules/next/dist/bin/next build` → passes.
Run dev → scroll the whole page; confirm the dark/white rhythm reads Hero(dark) → Problem(white) → Services(dark) → Process(white) → Portfolio(white) → About(dark) → Contact(dark) → Footer(dark), and the navbar turns light only after the hero. Stop dev.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/Footer.tsx
git commit -m "chore(layout): footer wordmark size, confirm navbar rhythm"
```

---

## Task 15: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Production build**

Run: `node node_modules/next/dist/bin/next build`
Expected: passes; routes include `/[locale]`, `/[locale]/opengraph-image`, `/sitemap.xml`, `/robots.txt`.

- [ ] **Step 2: SEO route checks**

Run dev, then:
- `curl -s http://localhost:3000/ | grep -i 'rel="canonical"'` → `https://vostex.io/`
- `curl -s http://localhost:3000/es | grep -i 'rel="canonical"'` → `https://vostex.io/es`
- `curl -s http://localhost:3000/ | grep -ci 'hreflang'` → ≥ 3
- `curl -s http://localhost:3000/sitemap.xml` → both locale URLs present
- `curl -s http://localhost:3000/robots.txt` → `Sitemap:` line present
- `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/opengraph-image` → `200`

- [ ] **Step 3: Heading hierarchy check**

Run: `curl -s http://localhost:3000/ | grep -oE '<h[1-6]'` → Expected: exactly one `<h1`, then `<h2`/`<h3` with no skipped levels.

- [ ] **Step 4: Contrast + responsive spot check (manual)**

Open `http://localhost:3000/` at 375px and desktop. Confirm:
- No horizontal scroll at 375px.
- All accent words legible on their backgrounds (cyan on dark, deeper cyan on light).
- Dark sections' secondary text is `#94A3B8` (not the failing `#4A5568`).
- With OS "reduce motion" on, reveals are minimal.
Stop dev.

- [ ] **Step 5: Final commit (if any spot fixes were made)**

```bash
git add -A
git commit -m "chore: final redesign verification fixes"
```

---

## Self-Review

**Spec coverage:**
- §3 decisions → Tasks 2 (as-needed), 7 (hero dark/giant/keep message), 9 & 12 (Services/About to dark), 12 (commitments not stats), all visual tasks (Enfoque A). ✓
- §4 visual system → Task 1 (accent rule, hairline, display, spacing). ✓
- §5 per-section → Tasks 7–14. ✓ Portfolio browser window preserved (Task 11). ✓
- §6 SEO 1–9 → Task 3 (metadata/hreflang/canonical), Task 2 (as-needed + page.tsx + proxy), Task 4 (sitemap/robots), Task 5 (OG image), Task 6 (WebSite/ProfessionalService), Task 15 (heading hierarchy, alt/landmarks already present, CWV via next/font). ✓
- §8 verification criteria → Task 15. ✓

**Placeholder scan:** No TBD/TODO; every code step shows full code. The sitemap step shows one throwaway variant then the clean final — implementer uses the clean version. ✓

**Type consistency:** `SectionHeading` props (`eyebrow/title/subtitle/tone/align/className`) used consistently in Tasks 8–13. `HairlineItem` props (`tone/index/icon/title/description/tag/accentTitle`) used consistently in Tasks 8–12. `seo.ts` exports (`SITE_URL/LOCALES/localeUrl/hreflangAlternates/OG_LOCALE/*JsonLd`) match their call sites in Tasks 3–6. ✓

**Known risk to watch during execution:** removing `src/app/page.tsx` under `as-needed` (Task 2) — if `/` 404s after the change, the fix is ensuring `proxy.ts` uses `createMiddleware(routing)` and its matcher includes `/`. Verified via Task 2 Step 4 curl checks before proceeding.
