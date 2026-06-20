"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { GlowButton } from "@/components/ui/GlowButton";

type FormData = {
  name: string;
  email: string;
  company: string;
  message: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function Contact() {
  const t = useTranslations("contact");
  const tForm = useTranslations("contact.form");

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const turnstile = useRef<TurnstileInstance>(null);

  const validate = (): Errors => {
    const errs: Errors = {};
    if (!form.name.trim()) errs.name = tForm("err_name");
    if (!form.email.trim()) errs.email = tForm("err_email_required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = tForm("err_email_invalid");
    if (!form.message.trim()) errs.message = tForm("err_message");
    return errs;
  };

  const handleBlur = (field: keyof FormData) => {
    const errs = validate();
    setErrors((prev) => {
      const next = { ...prev };
      if (errs[field]) next[field] = errs[field];
      else delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      document.getElementById(`field-${Object.keys(errs)[0]}`)?.focus();
      return;
    }

    if (SITE_KEY && !token) {
      toast.error(tForm("err_captcha"), { duration: 5000 });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website: honeypot.current?.value ?? "", // honeypot
          turnstileToken: token,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success(tForm("success"), { duration: 5000 });
      setForm({ name: "", email: "", company: "", message: "" });
      setErrors({});
      setToken("");
      turnstile.current?.reset();
    } catch {
      toast.error(tForm("error"), { duration: 5000 });
      turnstile.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full bg-white border rounded-[2px] px-4 py-3 text-[#0D1F3C] text-sm placeholder-[#8A97A8] transition-colors duration-150 focus:outline-none focus:border-[#00C2FF] focus-visible:ring-2 focus-visible:ring-[#00C2FF]/30 min-h-[44px] ${
      errors[field] ? "border-red-500" : "border-[#0D1F3C]/13"
    }`;

  const labelClass = "block text-[0.7rem] uppercase tracking-[0.14em] text-[#4A5568] mb-2";

  return (
    <section
      id="contact"
      className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-[clamp(5rem,11vh,9rem)]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: copy */}
        <div>
          <span className="kicker">{t("label")}</span>
          <h2
            className="font-serif font-medium leading-[1.02] text-balance text-[#0D1F3C] mt-5"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)" }}
          >
            {t("title")}
          </h2>
          <p className="mt-6 max-w-[42ch] text-[#4A5568] leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Right: form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="field-name" className={labelClass}>
                {tForm("name")} <span className="text-red-500">*</span>
              </label>
              <input
                id="field-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={tForm("name_placeholder")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onBlur={() => handleBlur("name")}
                className={inputClass("name")}
              />
              {errors.name && (
                <p role="alert" className="text-xs text-red-500 mt-1.5">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="field-email" className={labelClass}>
                {tForm("email")} <span className="text-red-500">*</span>
              </label>
              <input
                id="field-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                placeholder={tForm("email_placeholder")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={() => handleBlur("email")}
                className={inputClass("email")}
              />
              {errors.email && (
                <p role="alert" className="text-xs text-red-500 mt-1.5">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="field-company" className={labelClass}>
              {tForm("company")}
            </label>
            <input
              id="field-company"
              name="organization"
              type="text"
              autoComplete="organization"
              placeholder={tForm("company_placeholder")}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className={inputClass("company")}
            />
          </div>

          <div className="mt-5">
            <label htmlFor="field-message" className={labelClass}>
              {tForm("message")} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="field-message"
              name="message"
              rows={5}
              placeholder={tForm("message_placeholder")}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              onBlur={() => handleBlur("message")}
              className={`${inputClass("message")} min-h-[120px] resize-y`}
            />
            {errors.message && (
              <p role="alert" className="text-xs text-red-500 mt-1.5">{errors.message}</p>
            )}
          </div>

          {/* Honeypot — hidden from users, bots tend to fill it */}
          <div aria-hidden className="absolute left-[-9999px] w-px h-px overflow-hidden" >
            <label htmlFor="field-website">Website</label>
            <input
              id="field-website"
              ref={honeypot}
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Cloudflare Turnstile — only rendered when configured */}
          {SITE_KEY && (
            <div className="mt-6">
              <Turnstile
                ref={turnstile}
                siteKey={SITE_KEY}
                onSuccess={setToken}
                onExpire={() => setToken("")}
                onError={() => setToken("")}
                options={{ theme: "light", size: "flexible" }}
              />
            </div>
          )}

          <GlowButton
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-6"
          >
            {loading ? (
              <>
                <svg className="animate-spin" width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                {tForm("submitting")}
              </>
            ) : (
              <>
                {tForm("submit")}
                <span aria-hidden>→</span>
              </>
            )}
          </GlowButton>
        </form>
      </div>
    </section>
  );
}
