import { NextResponse } from "next/server";
import { Resend } from "resend";

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

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { name, email, company, message, website, turnstileToken } =
      await req.json();

    // Honeypot: a real user never fills this. Pretend success, send nothing.
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const ok = await verifyTurnstile(turnstileToken ?? "", ip);
    if (!ok) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 403 }
      );
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "VOSTEX Contact <noreply@vostex.io>",
      to: ["hernan.provoste@vostex.io"],
      replyTo: email,
      subject: `[VOSTEX] New contact from ${name}${company ? ` · ${company}` : ""}`,
      html: `
        <div style="font-family: Lato, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #060D1A; color: #FFFFFF; padding: 40px; border-radius: 2px;">
          <div style="margin-bottom: 32px;">
            <p style="color: #00C2FF; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 8px;">New Contact — vostex.io</p>
            <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 500; margin: 0; color: #FFFFFF;">Message from ${name}</h1>
          </div>

          <div style="background: #0D1F3C; border: 1px solid #1A2E4A; border-radius: 2px; padding: 24px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #8A97A8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; width: 100px;">Name</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8A97A8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #00C2FF; text-decoration: none; font-size: 14px;">${email}</a></td>
              </tr>
              ${
                company
                  ? `<tr>
                <td style="padding: 8px 0; color: #8A97A8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Company</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${company}</td>
              </tr>`
                  : ""
              }
            </table>
          </div>

          <div style="background: #0D1F3C; border: 1px solid #1A2E4A; border-radius: 2px; padding: 24px; margin-bottom: 32px;">
            <p style="color: #8A97A8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px;">Message</p>
            <p style="color: #E8ECF0; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="border-top: 1px solid #1A2E4A; padding-top: 20px; text-align: center;">
            <p style="color: #8A97A8; font-size: 11px; margin: 0;">VOSTEX · vostex.io · Valdivia, Chile</p>
          </div>
        </div>
      `,
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
