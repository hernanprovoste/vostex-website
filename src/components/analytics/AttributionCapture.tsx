"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Records UTM tags / referrer of the visit that landed on the site. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
