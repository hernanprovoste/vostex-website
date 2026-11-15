import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GlowButton } from "@/components/ui/GlowButton";

// Rendered inside src/app/[locale]/layout.tsx, so the page is already
// translated: the locale comes from the request, not from props.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notfound");
  return { title: t("title_tag") };
}

export default async function NotFound() {
  const t = await getTranslations("notfound");

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-dvh bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 pt-[calc(72px+clamp(3rem,10vh,7rem))] pb-[clamp(5rem,11vh,9rem)]"
      >
        <div className="max-w-7xl mx-auto">
          <span className="kicker">{t("label")}</span>
          <h1
            className="font-serif font-medium leading-[1.02] text-balance text-[#0D1F3C] mt-5"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)" }}
          >
            {t("title")}
          </h1>
          <p className="mt-6 max-w-[48ch] text-[#4A5568] leading-relaxed">
            {t("text")}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <GlowButton variant="cyan" href="/">
              {t("home")}
            </GlowButton>
            <Link
              href="/contact"
              className="link-arrow text-[#4A5568] hover:text-[#0D1F3C] transition-colors duration-150"
            >
              {t("contact")}{" "}
              <span aria-hidden className="text-[#00C2FF]">
                →
              </span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
