import { NextResponse } from "next/server";
import { Resend } from "resend";
import { buildContactEmail } from "@/lib/contact-email";
import {
  EMAIL_REGEX,
  LIMITS,
  OPTIONS,
  type OptionField,
} from "@/lib/contact-flow";

// --- Best-effort in-memory rate limiter (per IP) ---
// Serverless instances don't share memory, so this is a first line of defense,
// layered behind Cloudflare Turnstile + a honeypot field.
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((ts) => now - ts < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // No secret configured (e.g. local dev) → skip verification.
  if (!secret) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.append("remoteip", ip);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body }
    );
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

// --- Input sanitizing: nothing from the client is trusted ---

/** Trimmed string, capped to `max` characters. Non-strings become "". */
function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Keep only values that are valid option keys, without duplicates. */
function pickMany(value: unknown, field: OptionField): string[] {
  if (!Array.isArray(value)) return [];
  const allowed: readonly string[] = OPTIONS[field];
  return [...new Set(value)].filter(
    (v): v is string => typeof v === "string" && allowed.includes(v)
  );
}

function pickOne(value: unknown, field: OptionField): string {
  const allowed: readonly string[] = OPTIONS[field];
  return typeof value === "string" && allowed.includes(value) ? value : "";
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = (await req.json()) as Record<string, unknown>;

    // Honeypot: a real user never fills this. Pretend success, send nothing.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const ok = await verifyTurnstile(
      typeof body.turnstileToken === "string" ? body.turnstileToken : "",
      ip
    );
    if (!ok) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 403 }
      );
    }

    const name = text(body.name, LIMITS.name);
    const email = text(body.email, LIMITS.email);
    const company = text(body.company, LIMITS.company);

    const raw = (body.answers ?? {}) as Record<string, unknown>;
    const answers = {
      bottleneck: pickOne(raw.bottleneck, "bottleneck"),
      bottleneckNote: text(raw.bottleneckNote, LIMITS.note),
      processes: pickMany(raw.processes, "processes"),
      processesNote: text(raw.processesNote, LIMITS.note),
      tools: pickMany(raw.tools, "tools"),
      build: pickMany(raw.build, "build"),
      goal: text(raw.goal, LIMITS.goal),
      timing: pickOne(raw.timing, "timing"),
    };

    if (
      !name ||
      !email ||
      !answers.bottleneck ||
      answers.processes.length === 0 ||
      answers.build.length === 0
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { subject, html } = buildContactEmail({
      name,
      email,
      company,
      answers,
      locale: body.locale === "en" ? "EN" : "ES",
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "VOSTEX Contact <noreply@vostex.io>",
      to: ["hernan.provoste@vostex.io"],
      replyTo: email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
