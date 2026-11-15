"use client";

import { trackEvent } from "@/lib/analytics";

type Props = {
  href: string;
  placement: "floating" | "contact_aside" | "flow_done";
  className?: string;
  children: React.ReactNode;
};

/** External WhatsApp link that records a click event. */
export function WhatsAppLink({ href, placement, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackEvent("whatsapp_click", { placement })}
    >
      {children}
    </a>
  );
}
