import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactFlow } from "@/components/contact/ContactFlow";
import { DirectContact, NextSteps } from "@/components/contact/ContactAside";
import { OG_LOCALE, SITE_URL, pageAlternates, pageUrl } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const url = pageUrl(locale, "/contact");
  const ogLocale = OG_LOCALE[locale] ?? "en_US";

  return {
    metadataBase: new URL(SITE_URL),
    title: t("contact_title"),
    description: t("contact_description"),
    alternates: {
      canonical: url,
      languages: pageAlternates("/contact"),
    },
    openGraph: {
      title: t("contact_title"),
      description: t("contact_description"),
      url,
      siteName: "VOSTEX",
      locale: ogLocale,
      alternateLocale: Object.values(OG_LOCALE).filter((l) => l !== ogLocale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("contact_title"),
      description: t("contact_description"),
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-dvh bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 pt-[calc(72px+clamp(2rem,6vh,4rem))] pb-[clamp(5rem,11vh,9rem)]"
      >
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="link-arrow text-[#4A5568] hover:text-[#0D1F3C] transition-colors duration-150 mb-10"
          >
            <span aria-hidden className="text-[#00C2FF]">
              ←
            </span>{" "}
            {t("page.back")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-x-16 gap-y-12 lg:gap-y-0 items-start">
            {/* Heading — on mobile the flow comes right after it */}
            <div className="lg:col-start-1 lg:row-start-1">
              <span className="kicker">{t("label")}</span>
              <h1
                className="font-serif font-medium leading-[1.02] text-balance text-[#0D1F3C] mt-5"
                style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)" }}
              >
                {t("title")}
              </h1>
              <p className="mt-6 max-w-[42ch] text-[#4A5568] leading-relaxed">
                {t("subtitle")}
              </p>
              <p className="mt-4 max-w-[42ch] text-[0.9rem] text-[#4A5568] leading-relaxed">
                {t("page.calm")}
              </p>
            </div>

            {/* Card-by-card flow (Turnstile + honeypot live on its last step) */}
            <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
              <ContactFlow />
            </div>

            <div className="lg:col-start-1 lg:row-start-2 lg:mt-10 flex flex-col gap-6">
              <NextSteps />
              <DirectContact />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
