"use client";

import { useTranslations } from "next-intl";
import { GlowButton } from "@/components/ui/GlowButton";
import { DirectContact, NextSteps } from "@/components/contact/ContactAside";

/**
 * Home-page closing section. The questionnaire itself lives on its own page
 * (/contact) so people can read and answer it without the rest of the site
 * around them; this section only invites them there.
 */
export function Contact() {
  const t = useTranslations("contact");

  return (
    <section
      id="contact"
      className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-[clamp(5rem,11vh,9rem)]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-20 items-start">
        <div>
          <span className="kicker">{t("label")}</span>
          <h2
            className="font-serif font-medium leading-[1.02] text-balance text-[#0D1F3C] mt-5"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)" }}
          >
            {t("title")}
          </h2>
          <p className="mt-6 max-w-[46ch] text-[#4A5568] leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="mt-9 flex flex-col items-start gap-5">
            <GlowButton variant="cyan" href="/contact">
              {t("cta")} <span aria-hidden>→</span>
            </GlowButton>
            <DirectContact />
          </div>
        </div>

        <NextSteps />
      </div>
    </section>
  );
}
