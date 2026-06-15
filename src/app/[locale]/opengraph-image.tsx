import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VOSTEX";

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060D1A",
          padding: 80,
        }}
      >
        <div
          style={{
            color: "#00C2FF",
            fontSize: 28,
            letterSpacing: 8,
            fontWeight: 700,
          }}
        >
          VOSTEX
        </div>
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          {t("title").replace("VOSTEX — ", "")}
        </div>
        <div style={{ color: "#94A3B8", fontSize: 28 }}>vostex.io</div>
      </div>
    ),
    { ...size }
  );
}
