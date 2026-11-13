import {
  EMAIL_LABELS,
  EMAIL_NOTES,
  EMAIL_QUESTIONS,
  type Answers,
  type OptionField,
} from "./contact-flow";

/** Escape text before interpolating it into the HTML email. */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Single line (for email subject / header safety). */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ");
}

function labelOf(field: OptionField, key: string): string {
  return (EMAIL_LABELS[field] as Record<string, string>)[key] ?? key;
}

const ROW =
  "padding: 8px 0; color: #8A97A8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;";

function answerBlock(question: string, valueHtml: string): string {
  return `
    <div style="background: #0D1F3C; border: 1px solid #1A2E4A; border-radius: 2px; padding: 20px 24px; margin-bottom: 12px;">
      <p style="color: #8A97A8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">${esc(question)}</p>
      <div style="color: #E8ECF0; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${valueHtml}</div>
    </div>`;
}

const noteLabel = (text: string) =>
  `<span style="color:#8A97A8;">${esc(text)}:</span>\n`;

/**
 * Builds the notification email for a contact request. Every value coming from
 * the visitor is escaped; the inputs are expected to be already sanitized
 * (option keys whitelisted, strings trimmed and length-capped).
 */
export function buildContactEmail(input: {
  name: string;
  email: string;
  company: string;
  answers: Answers;
  locale: "ES" | "EN";
}): { subject: string; html: string } {
  const { name, email, company, answers, locale } = input;

  const list = (field: OptionField, keys: string[]) =>
    keys.map((k) => `• ${esc(labelOf(field, k))}`).join("\n");

  const blocks: string[] = [];

  blocks.push(
    answerBlock(
      EMAIL_QUESTIONS.bottleneck,
      esc(labelOf("bottleneck", answers.bottleneck)) +
        (answers.bottleneckNote
          ? `\n${noteLabel(EMAIL_NOTES.bottleneckNote)}${esc(answers.bottleneckNote)}`
          : "")
    )
  );

  blocks.push(
    answerBlock(
      EMAIL_QUESTIONS.processes,
      list("processes", answers.processes) +
        (answers.processesNote
          ? `\n\n${noteLabel(EMAIL_NOTES.processesNote)}${esc(answers.processesNote)}`
          : "")
    )
  );

  if (answers.tools.length > 0) {
    blocks.push(answerBlock(EMAIL_QUESTIONS.tools, list("tools", answers.tools)));
  }

  blocks.push(answerBlock(EMAIL_QUESTIONS.build, list("build", answers.build)));

  if (answers.goal) {
    blocks.push(answerBlock(EMAIL_QUESTIONS.goal, esc(answers.goal)));
  }

  if (answers.timing) {
    blocks.push(
      answerBlock(EMAIL_QUESTIONS.timing, esc(labelOf("timing", answers.timing)))
    );
  }

  const subject = oneLine(
    `[VOSTEX] Nuevo contacto de ${name}${company ? ` · ${company}` : ""}`
  );

  const html = `
    <div style="font-family: Lato, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #060D1A; color: #FFFFFF; padding: 40px; border-radius: 2px;">
      <div style="margin-bottom: 32px;">
        <p style="color: #00C2FF; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 8px;">Nuevo contacto — vostex.io · ${locale}</p>
        <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 500; margin: 0; color: #FFFFFF;">${esc(name)}</h1>
      </div>

      <div style="background: #0D1F3C; border: 1px solid #1A2E4A; border-radius: 2px; padding: 24px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="${ROW} width: 100px;">Nombre</td>
            <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${esc(name)}</td>
          </tr>
          <tr>
            <td style="${ROW}">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${esc(email)}" style="color: #00C2FF; text-decoration: none; font-size: 14px;">${esc(email)}</a></td>
          </tr>
          ${
            company
              ? `<tr>
            <td style="${ROW}">Empresa</td>
            <td style="padding: 8px 0; color: #FFFFFF; font-size: 14px;">${esc(company)}</td>
          </tr>`
              : ""
          }
        </table>
      </div>

      ${blocks.join("\n")}

      <div style="border-top: 1px solid #1A2E4A; padding-top: 20px; margin-top: 20px; text-align: center;">
        <p style="color: #8A97A8; font-size: 11px; margin: 0;">VOSTEX · vostex.io · Valdivia, Chile</p>
      </div>
    </div>
  `;

  return { subject, html };
}
