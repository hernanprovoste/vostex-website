"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  EMAIL_REGEX,
  EMPTY_ANSWERS,
  EXCLUSIVE,
  LIMITS,
  OPTIONS,
  STEPS,
  WHATSAPP_PHONE,
  type Answers,
  type OptionField,
  type Step,
} from "@/lib/contact-flow";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Contact = { name: string; email: string; company: string };
type ContactErrors = Partial<Record<keyof Contact, string>>;

const inputClass = (hasError: boolean) =>
  `w-full bg-white border rounded-[2px] px-4 py-3 text-[#0D1F3C] text-sm placeholder-[#8A97A8] transition-colors duration-150 focus:outline-none focus:border-[#00C2FF] focus-visible:ring-2 focus-visible:ring-[#00C2FF]/30 min-h-[44px] ${
    hasError ? "border-red-500" : "border-[#0D1F3C]/13"
  }`;

const labelClass =
  "block text-[0.7rem] uppercase tracking-[0.14em] text-[#4A5568] mb-2";

/** A selectable card. Uses a real (visually hidden) radio/checkbox input so
 *  keyboard and screen-reader behavior is native. */
function Choice({
  type,
  name,
  value,
  checked,
  label,
  onChange,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label
      className={`relative flex items-center gap-3 cursor-pointer border rounded-[2px] px-4 py-3.5 min-h-[52px] transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#00C2FF] ${
        checked
          ? "border-[#0D1F3C] bg-[#0D1F3C]/[0.04]"
          : "border-[#0D1F3C]/13 bg-white hover:border-[#0D1F3C]/40"
      }`}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`flex-none flex items-center justify-center w-[18px] h-[18px] border transition-colors duration-150 ${
          type === "radio" ? "rounded-full" : "rounded-[2px]"
        } ${
          checked
            ? "bg-[#0D1F3C] border-[#0D1F3C]"
            : "bg-white border-[#0D1F3C]/30"
        }`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6.5 4.8 9 10 3"
              stroke="#00C2FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-[0.95rem] leading-snug text-[#0D1F3C]">{label}</span>
    </label>
  );
}

// --- Draft: keep the answers if the visitor reloads, goes back or switches
// language mid-way (the language switch remounts the page). Stored only in this
// tab's sessionStorage and never includes name / email / company.
const DRAFT_KEY = "vostex-contact-draft-v1";

type Draft = { index: number; answers: Answers };

function isEmptyDraft(index: number, answers: Answers): boolean {
  return index === 0 && JSON.stringify(answers) === JSON.stringify(EMPTY_ANSWERS);
}

/** Never trust stored data: rebuild the draft keeping only valid values. */
function readDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    const a = d?.answers ?? {};
    const str = (v: unknown, max: number) =>
      typeof v === "string" ? v.slice(0, max) : "";
    const one = (v: unknown, f: "bottleneck" | "timing") =>
      typeof v === "string" && (OPTIONS[f] as readonly string[]).includes(v)
        ? v
        : "";
    const many = (v: unknown, f: "processes" | "tools" | "build") =>
      Array.isArray(v)
        ? v.filter(
            (x): x is string =>
              typeof x === "string" &&
              (OPTIONS[f] as readonly string[]).includes(x)
          )
        : [];

    const answers: Answers = {
      bottleneck: one(a.bottleneck, "bottleneck"),
      bottleneckNote: str(a.bottleneckNote, LIMITS.note),
      processes: many(a.processes, "processes"),
      processesNote: str(a.processesNote, LIMITS.note),
      tools: many(a.tools, "tools"),
      build: many(a.build, "build"),
      goal: str(a.goal, LIMITS.goal),
      timing: one(a.timing, "timing"),
    };
    const index = Number.isInteger(d?.index)
      ? Math.min(Math.max(d.index, 0), STEPS.length - 1)
      : 0;

    return isEmptyDraft(index, answers) ? null : { index, answers };
  } catch {
    return null;
  }
}

export function ContactFlow() {
  const tFlow = useTranslations("contact.flow");
  const tForm = useTranslations("contact.form");
  const tWhatsApp = useTranslations("whatsapp");
  const locale = useLocale();
  const reduced = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [contact, setContact] = useState<Contact>({
    name: "",
    email: "",
    company: "",
  });
  const [stepError, setStepError] = useState("");
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [token, setToken] = useState("");

  const honeypot = useRef<HTMLInputElement>(null);
  const turnstile = useRef<TurnstileInstance>(null);
  const shouldFocus = useRef(false);

  // Restore a saved draft once, after mount (the server-rendered markup is the
  // empty flow, so reading storage during render would cause a hydration
  // mismatch). Deferred with a timer (which also runs in background tabs,
  // unlike animation frames) instead of setting state synchronously.
  const restored = useRef(false);
  useEffect(() => {
    const id = setTimeout(() => {
      const draft = readDraft();
      if (draft) {
        setIndex(draft.index);
        setAnswers(draft.answers);
      }
      restored.current = true;
    }, 0);
    return () => clearTimeout(id);
  }, []);

  // Save the draft as the visitor goes. Skipped until the restore above has
  // run, so an empty first render can never overwrite a saved draft.
  useEffect(() => {
    if (!restored.current) return;
    try {
      if (isEmptyDraft(index, answers)) sessionStorage.removeItem(DRAFT_KEY);
      else sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ index, answers }));
    } catch {
      /* storage unavailable (private mode, blocked): the flow still works */
    }
  }, [index, answers]);

  const step: Step = STEPS[index];
  const total = STEPS.length;
  const isLast = index === total - 1;

  // After the user moves between cards, focus the new question so keyboard and
  // screen-reader users land on it. A ref callback (not an effect) is used
  // because AnimatePresence "wait" mounts the new card only after the old one
  // has finished exiting. Never runs on first render, so the page doesn't jump.
  const headingRef = useCallback((el: HTMLHeadingElement | null) => {
    if (el && shouldFocus.current) {
      shouldFocus.current = false;
      el.focus({ preventScroll: true });
      el.scrollIntoView({ block: "nearest" });
    }
  }, []);

  const hasValue = (s: Step): boolean => {
    switch (s.id) {
      case "bottleneck":
        return answers.bottleneck !== "";
      case "processes":
        return answers.processes.length > 0;
      case "build":
        return answers.build.length > 0;
      default:
        return true;
    }
  };

  const goNext = () => {
    if (step.required && !hasValue(step)) {
      setStepError(
        step.kind === "single" ? tFlow("err_single") : tFlow("err_multi")
      );
      return;
    }
    shouldFocus.current = true;
    setStepError("");
    setDir(1);
    setIndex((i) => Math.min(i + 1, total - 1));
  };

  const goBack = () => {
    shouldFocus.current = true;
    setStepError("");
    setDir(-1);
    setIndex((i) => Math.max(i - 1, 0));
  };

  const setSingle = (field: "bottleneck" | "timing", value: string) => {
    setStepError("");
    setAnswers((a) => ({ ...a, [field]: value }));
  };

  const toggleMulti = (field: "processes" | "tools" | "build", value: string) => {
    setStepError("");
    setAnswers((a) => {
      const current = a[field];
      const exclusive = EXCLUSIVE[field];
      if (current.includes(value)) {
        return { ...a, [field]: current.filter((v) => v !== value) };
      }
      if (exclusive && value === exclusive) return { ...a, [field]: [value] };
      return {
        ...a,
        [field]: [...current.filter((v) => v !== exclusive), value],
      };
    });
  };

  const validateContact = (): ContactErrors => {
    const errs: ContactErrors = {};
    if (!contact.name.trim()) errs.name = tForm("err_name");
    if (!contact.email.trim()) errs.email = tForm("err_email_required");
    else if (!EMAIL_REGEX.test(contact.email.trim()))
      errs.email = tForm("err_email_invalid");
    return errs;
  };

  const submit = async () => {
    const errs = validateContact();
    if (Object.keys(errs).length > 0) {
      setContactErrors(errs);
      document.getElementById(`flow-${Object.keys(errs)[0]}`)?.focus();
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
          name: contact.name.trim(),
          email: contact.email.trim(),
          company: contact.company.trim(),
          answers,
          locale,
          website: honeypot.current?.value ?? "", // honeypot
          turnstileToken: token,
        }),
      });
      if (!res.ok) throw new Error();
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      shouldFocus.current = true;
      setDone(true);
    } catch {
      toast.error(tForm("error"), { duration: 5000 });
      turnstile.current?.reset();
      setToken("");
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * -28 }),
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    tWhatsApp("message")
  )}`;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLast) submit();
    else goNext();
  };

  const renderBody = () => {
    if (step.kind === "contact") {
      return (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="flow-name" className={labelClass}>
                {tForm("name")} <span className="text-red-500">*</span>
              </label>
              <input
                id="flow-name"
                type="text"
                autoComplete="name"
                maxLength={LIMITS.name}
                placeholder={tForm("name_placeholder")}
                value={contact.name}
                aria-invalid={!!contactErrors.name}
                onChange={(e) => {
                  setContact({ ...contact, name: e.target.value });
                  if (contactErrors.name)
                    setContactErrors((p) => ({ ...p, name: undefined }));
                }}
                className={inputClass(!!contactErrors.name)}
              />
              {contactErrors.name && (
                <p role="alert" className="text-xs text-red-500 mt-1.5">
                  {contactErrors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="flow-email" className={labelClass}>
                {tForm("email")} <span className="text-red-500">*</span>
              </label>
              <input
                id="flow-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                maxLength={LIMITS.email}
                placeholder={tForm("email_placeholder")}
                value={contact.email}
                aria-invalid={!!contactErrors.email}
                onChange={(e) => {
                  setContact({ ...contact, email: e.target.value });
                  if (contactErrors.email)
                    setContactErrors((p) => ({ ...p, email: undefined }));
                }}
                className={inputClass(!!contactErrors.email)}
              />
              {contactErrors.email && (
                <p role="alert" className="text-xs text-red-500 mt-1.5">
                  {contactErrors.email}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="flow-company" className={labelClass}>
              {tForm("company")}{" "}
              <span className="normal-case tracking-normal text-[#8A97A8]">
                ({tFlow("optional")})
              </span>
            </label>
            <input
              id="flow-company"
              type="text"
              autoComplete="organization"
              maxLength={LIMITS.company}
              placeholder={tForm("company_placeholder")}
              value={contact.company}
              onChange={(e) =>
                setContact({ ...contact, company: e.target.value })
              }
              className={inputClass(false)}
            />
          </div>

          {/* Honeypot — hidden from users, bots tend to fill it */}
          <div
            aria-hidden
            className="absolute left-[-9999px] w-px h-px overflow-hidden"
          >
            <label htmlFor="flow-website">Website</label>
            <input
              id="flow-website"
              ref={honeypot}
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {SITE_KEY && (
            <Turnstile
              ref={turnstile}
              siteKey={SITE_KEY}
              onSuccess={setToken}
              onExpire={() => setToken("")}
              onError={() => setToken("")}
              options={{
                theme: "light",
                size: "flexible",
                // Show the captcha in the site's language, not the browser's
                language: locale === "es" ? "es" : "en",
              }}
            />
          )}
        </div>
      );
    }

    if (step.kind === "text") {
      return (
        <textarea
          aria-labelledby="flow-question"
          rows={6}
          maxLength={LIMITS.goal}
          placeholder={tFlow(`steps.${step.id}.placeholder`)}
          value={answers.goal}
          onChange={(e) => setAnswers({ ...answers, goal: e.target.value })}
          className={`${inputClass(false)} min-h-[140px] resize-y`}
        />
      );
    }

    // Choice steps (single / multi)
    const field = step.id as OptionField;
    const type = step.kind === "single" ? "radio" : "checkbox";
    const selected = (key: string) =>
      step.kind === "single"
        ? (answers[field as "bottleneck" | "timing"] as string) === key
        : (answers[field as "processes" | "tools" | "build"] as string[]).includes(
            key
          );

    return (
      <>
        <div
          role={step.kind === "single" ? "radiogroup" : "group"}
          aria-labelledby="flow-question"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {OPTIONS[field].map((key) => (
            <Choice
              key={key}
              type={type}
              name={`flow-${step.id}`}
              value={key}
              checked={selected(key)}
              label={tFlow(`steps.${step.id}.options.${key}`)}
              onChange={() =>
                step.kind === "single"
                  ? setSingle(field as "bottleneck" | "timing", key)
                  : toggleMulti(field as "processes" | "tools" | "build", key)
              }
            />
          ))}
        </div>

        {step.note && (
          <div className="mt-5">
            <label htmlFor={`flow-${step.note}`} className={labelClass}>
              {tFlow(`steps.${step.id}.note_label`)}{" "}
              <span className="normal-case tracking-normal text-[#8A97A8]">
                ({tFlow("optional")})
              </span>
            </label>
            <textarea
              id={`flow-${step.note}`}
              rows={3}
              maxLength={LIMITS.note}
              placeholder={tFlow(`steps.${step.id}.note_placeholder`)}
              value={answers[step.note]}
              onChange={(e) =>
                setAnswers({ ...answers, [step.note as string]: e.target.value })
              }
              className={`${inputClass(false)} min-h-[88px] resize-y`}
            />
          </div>
        )}
      </>
    );
  };

  if (done) {
    return (
      <div className="border border-[#0D1F3C]/13 bg-white p-6 sm:p-9">
        <span
          aria-hidden
          className="flex items-center justify-center w-10 h-10 bg-[#0D1F3C] mb-6"
        >
          <svg width="18" height="18" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6.5 4.8 9 10 3"
              stroke="#00C2FF"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h3
          ref={headingRef}
          tabIndex={-1}
          role="status"
          className="font-serif text-[1.7rem] sm:text-[2rem] leading-[1.1] text-[#0D1F3C] focus:outline-none"
        >
          {tFlow("done_title")}
        </h3>
        <p className="mt-4 max-w-[46ch] text-[#4A5568] leading-relaxed">
          {tFlow("done_text")}
        </p>
        <div className="mt-7">
          <GlowButton
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
          >
            {tFlow("done_cta")} <span aria-hidden>→</span>
          </GlowButton>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border border-[#0D1F3C]/13 bg-white p-6 sm:p-9"
    >
      {/* Progress */}
      <div className="flex items-center justify-between gap-4 mb-7">
        <div aria-hidden className="flex flex-1 gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              className={`h-[3px] flex-1 transition-colors duration-200 ${
                i < index
                  ? "bg-[#0D1F3C]"
                  : i === index
                    ? "bg-[#00C2FF]"
                    : "bg-[#0D1F3C]/13"
              }`}
            />
          ))}
        </div>
        <p
          aria-live="polite"
          className="text-[0.7rem] uppercase tracking-[0.14em] text-[#4A5568] tnum whitespace-nowrap"
        >
          {tFlow("progress", { current: index + 1, total })}
        </p>
      </div>

      <div className="min-h-[380px]">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={step.id}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduced ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <h3
              id="flow-question"
              ref={headingRef}
              tabIndex={-1}
              className="font-serif text-[1.5rem] sm:text-[1.85rem] leading-[1.15] text-[#0D1F3C] text-balance focus:outline-none"
            >
              {tFlow(`steps.${step.id}.question`)}
            </h3>
            <p className="mt-2 mb-6 text-[0.92rem] text-[#4A5568] leading-relaxed">
              {tFlow(`steps.${step.id}.hint`)}
            </p>

            {renderBody()}

            {stepError && (
              <p role="alert" className="text-sm text-red-600 mt-4">
                {stepError}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-8 pt-6 border-t border-[#0D1F3C]/13 flex flex-wrap items-center justify-between gap-3">
        <div>
          {index > 0 && (
            <GlowButton variant="ghost" onClick={goBack}>
              <span aria-hidden>←</span> {tFlow("back")}
            </GlowButton>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!step.required && !isLast && (
            <button
              type="button"
              onClick={goNext}
              className="text-[0.8rem] uppercase tracking-[0.1em] font-bold text-[#4A5568] hover:text-[#0D1F3C] min-h-[44px] px-1 cursor-pointer transition-colors duration-150"
            >
              {tFlow("skip")}
            </button>
          )}
          {isLast ? (
            <GlowButton variant="primary" type="submit" disabled={loading}>
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
                  {tForm("submit")} <span aria-hidden>→</span>
                </>
              )}
            </GlowButton>
          ) : (
            <GlowButton variant="primary" type="submit">
              {tFlow("next")} <span aria-hidden>→</span>
            </GlowButton>
          )}
        </div>
      </div>
    </form>
  );
}
