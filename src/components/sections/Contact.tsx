"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlowButton } from "@/components/ui/GlowButton";

type FormData = {
  name: string;
  email: string;
  company: string;
  message: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

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

  const validate = (): Errors => {
    const errs: Errors = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleBlur = (field: keyof FormData) => {
    const errs = validate();
    if (errs[field]) {
      setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstKey}`)?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success(tForm("success"), { duration: 5000 });
      setForm({ name: "", email: "", company: "", message: "" });
      setErrors({});
    } catch {
      toast.error(tForm("error"), { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full bg-[#060D1A] border rounded-lg px-4 py-3 text-white text-sm placeholder-[#4A5568] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 focus:border-[#00C2FF] min-h-[44px] ${
      errors[field]
        ? "border-red-500 focus:ring-red-500/30"
        : "border-[#1A2E4A] hover:border-[#00C2FF]/30"
    }`;

  return (
    <section id="contact" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0D1F3C] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,194,255,0.04) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2FF] mb-4">
            {t("label")}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {t("title")}
          </h2>
          <p className="text-[#94A3B8] text-lg">{t("subtitle")}</p>
        </AnimatedSection>

        {/* Form card */}
        <AnimatedSection delay={0.2}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-[#1A2E4A] bg-[#060D1A] p-6 md:p-10 flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="field-name" className="text-xs font-medium text-[#94A3B8]">
                  {tForm("name")} <span className="text-red-400">*</span>
                </label>
                <input
                  id="field-name"
                  type="text"
                  autoComplete="name"
                  placeholder={tForm("name_placeholder")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onBlur={() => handleBlur("name")}
                  className={inputClass("name")}
                />
                {errors.name && (
                  <p role="alert" className="text-xs text-red-400 mt-0.5">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="field-email" className="text-xs font-medium text-[#94A3B8]">
                  {tForm("email")} <span className="text-red-400">*</span>
                </label>
                <input
                  id="field-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder={tForm("email_placeholder")}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onBlur={() => handleBlur("email")}
                  className={inputClass("email")}
                />
                {errors.email && (
                  <p role="alert" className="text-xs text-red-400 mt-0.5">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="field-company" className="text-xs font-medium text-[#94A3B8]">
                {tForm("company")}
              </label>
              <input
                id="field-company"
                type="text"
                autoComplete="organization"
                placeholder={tForm("company_placeholder")}
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputClass("company")}
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="field-message" className="text-xs font-medium text-[#94A3B8]">
                {tForm("message")} <span className="text-red-400">*</span>
              </label>
              <textarea
                id="field-message"
                rows={5}
                placeholder={tForm("message_placeholder")}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                onBlur={() => handleBlur("message")}
                className={`${inputClass("message")} min-h-[120px] resize-y`}
              />
              {errors.message && (
                <p role="alert" className="text-xs text-red-400 mt-0.5">{errors.message}</p>
              )}
            </div>

            <GlowButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full mt-2 gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity="0.25"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  {tForm("submitting")}
                </>
              ) : (
                <>
                  {tForm("submit")}
                  <Send size={14} />
                </>
              )}
            </GlowButton>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
}
