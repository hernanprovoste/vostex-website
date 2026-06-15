import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "sonner";
import {
  SITE_URL,
  localeUrl,
  hreflangAlternates,
  OG_LOCALE,
  organizationJsonLd,
  websiteJsonLd,
  professionalServiceJsonLd,
} from "@/lib/seo";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const url = localeUrl(locale);
  const ogLocale = OG_LOCALE[locale] ?? "en_US";

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
      locale: ogLocale,
      alternateLocale: Object.values(OG_LOCALE).filter((l) => l !== ogLocale),
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

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-[#00C2FF] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#060D1A]"
        >
          {t("skip")}
        </a>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0D1F3C",
                border: "1px solid #1A2E4A",
                color: "#FFFFFF",
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
