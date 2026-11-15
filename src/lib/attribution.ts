/**
 * Lead attribution: where a visitor came from (UTM tags, external referrer,
 * ad click ids) and which page they landed on. Captured once in the browser
 * (first touch, kept for 90 days) and sent along with the contact request so
 * every lead says which channel brought it.
 *
 * No personal data is stored here: only campaign tags, a referrer origin and
 * a site path.
 */

export const ATTRIBUTION_KEY = "vostex-attribution-v1";
export const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000;

export const ATTRIBUTION_FIELDS = [
  "source",
  "medium",
  "campaign",
  "term",
  "content",
  "referrer",
  "landing",
] as const;

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number];
export type Attribution = Partial<Record<AttributionField, string>>;

const MAX_LEN = 200;

/** Server-side: keep only known keys with short, single-line string values. */
export function sanitizeAttribution(raw: unknown): Attribution {
  if (!raw || typeof raw !== "object") return {};
  const input = raw as Record<string, unknown>;
  const out: Attribution = {};
  for (const key of ATTRIBUTION_FIELDS) {
    const value = input[key];
    if (typeof value !== "string") continue;
    // Drop control characters (incl. newlines) and cap the length.
    const clean = value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, MAX_LEN);
    if (clean) out[key] = clean;
  }
  return out;
}

/** Ad click ids that imply a paid source when no UTM tags are present. */
const CLICK_IDS: Record<string, { source: string; medium: string }> = {
  gclid: { source: "google", medium: "cpc" },
  fbclid: { source: "facebook", medium: "social" },
  li_fat_id: { source: "linkedin", medium: "cpc" },
  msclkid: { source: "bing", medium: "cpc" },
};

/**
 * Browser-side: derive attribution from the current URL and referrer.
 * Returns null for internal navigations (same-site referrer, no tags), which
 * must never overwrite what brought the visitor in.
 */
export function readAttributionFromLocation(
  href: string,
  referrer: string
): Attribution | null {
  const url = new URL(href);
  const params = url.searchParams;
  const out: Attribution = {};

  for (const key of ["source", "medium", "campaign", "term", "content"] as const) {
    const value = params.get(`utm_${key}`);
    if (value) out[key] = value;
  }

  if (!out.source) {
    for (const [param, implied] of Object.entries(CLICK_IDS)) {
      if (params.has(param)) {
        Object.assign(out, implied);
        break;
      }
    }
  }

  let externalReferrer = "";
  if (referrer) {
    try {
      const ref = new URL(referrer);
      if (ref.hostname !== url.hostname) externalReferrer = ref.hostname;
    } catch {
      /* malformed referrer: ignore */
    }
  }

  const hasTags = Object.keys(out).length > 0;
  if (!hasTags && !externalReferrer && referrer) return null; // internal hop

  if (externalReferrer) out.referrer = externalReferrer;
  if (!out.source) out.source = externalReferrer || "direct";
  out.landing = url.pathname;
  return out;
}

type Stored = { at: number; data: Attribution };

/** Browser-side: the saved attribution, or {} if missing/expired/unreadable. */
export function getStoredAttribution(): Attribution {
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return {};
    const stored = JSON.parse(raw) as Stored;
    if (Date.now() - stored.at > ATTRIBUTION_TTL_MS) return {};
    return sanitizeAttribution(stored.data);
  } catch {
    return {};
  }
}

/**
 * Browser-side: record how this visit started. Policy is "last non-direct
 * touch": a tagged or referred visit replaces what was saved, while a direct
 * visit only fills an empty (or expired) slot. Internal hops change nothing.
 */
let captured = false;

export function captureAttribution(): void {
  // Once per page load: a client-side remount (e.g. switching language) keeps
  // the original document.referrer but drops the UTM query, and must not
  // overwrite the tagged entry.
  if (captured) return;
  captured = true;
  try {
    const current = readAttributionFromLocation(
      window.location.href,
      document.referrer
    );
    if (!current) return;
    const isDirect = current.source === "direct";
    const saved = getStoredAttribution();
    if (isDirect && Object.keys(saved).length > 0) return;
    const value: Stored = { at: Date.now(), data: sanitizeAttribution(current) };
    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable: attribution is best-effort */
  }
}
