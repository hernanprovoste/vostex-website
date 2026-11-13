import { useTranslations } from "next-intl";
import { WHATSAPP_PHONE } from "@/lib/contact-flow";

const nextKeys = ["review", "reply", "talk"] as const;

/** "What happens after you send it" — three numbered, hairline-divided steps. */
export function NextSteps() {
  const t = useTranslations("contact");

  return (
    <div className="border-t border-[#0D1F3C]/13">
      <p className="pt-5 pb-1 text-[0.7rem] uppercase tracking-[0.14em] text-[#4A5568]">
        {t("next.title")}
      </p>
      <ol>
        {nextKeys.map((key, i) => (
          <li
            key={key}
            className="grid grid-cols-[2rem_1fr] gap-3 py-4 border-b border-[#0D1F3C]/13"
          >
            <span
              aria-hidden
              className="font-serif text-[1.1rem] text-[#0090C8] tnum"
            >
              0{i + 1}
            </span>
            <div>
              <p className="font-bold text-[0.95rem] text-[#0D1F3C]">
                {t(`next.items.${key}.title`)}
              </p>
              <p className="text-[0.9rem] text-[#4A5568] leading-relaxed">
                {t(`next.items.${key}.description`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Alternative for visitors who would rather not fill in the questions. */
export function DirectContact() {
  const t = useTranslations("contact");
  const tWhatsApp = useTranslations("whatsapp");

  const href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    tWhatsApp("message")
  )}`;

  return (
    <p className="text-[0.9rem] text-[#4A5568]">
      {t("direct.text")}{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="link-arrow text-[#0D1F3C] ml-1"
      >
        {t("direct.cta")} <span className="ar">→</span>
      </a>
    </p>
  );
}
