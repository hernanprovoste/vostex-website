import { track } from "@vercel/analytics";

/**
 * Custom analytics events, in one place so names stay consistent.
 * Page views are tracked automatically by <Analytics /> in the layout.
 * Note: Vercel only records custom events on Pro/Enterprise plans; on Hobby
 * these calls are harmless no-ops on the dashboard side.
 */
type Events = {
  /** A card of the contact flow was shown (one event per step reached). */
  contact_step: { step: string; index: number };
  /** The contact flow was sent. */
  contact_submit: { result: "success" | "error"; source: string };
  /** A WhatsApp link was clicked. */
  whatsapp_click: { placement: "floating" | "contact_aside" | "flow_done" };
};

export function trackEvent<K extends keyof Events>(name: K, props: Events[K]) {
  try {
    track(name, props);
  } catch {
    /* analytics must never break the page */
  }
}
