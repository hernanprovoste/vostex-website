import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "sonner";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vostex.io"),
  title: "VOSTEX — Engineered systems for real-world operations.",
  description:
    "Software engineering studio. We design and build custom software, platforms and automations so your business can run with clarity, speed and control. Based in Valdivia, Chile.",
  keywords: [
    "software engineering studio",
    "custom software",
    "internal systems",
    "platforms",
    "process automation",
    "Chile",
    "Latin America",
  ],
  alternates: {
    canonical: "https://vostex.io",
  },
  openGraph: {
    title: "VOSTEX — Engineered systems for real-world operations.",
    description:
      "We design and build custom software, platforms and automations so your business can run with clarity, speed and control.",
    url: "https://vostex.io",
    siteName: "VOSTEX",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VOSTEX — Engineered systems for real-world operations.",
    description:
      "We design and build custom software, platforms and automations so your business can run with clarity, speed and control.",
  },
  icons: {
    icon: "/assets/isotipo.svg",
    apple: "/assets/isotipo.svg",
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0D1F3C",
                border: "1px solid #1A2E4A",
                color: "#FFFFFF",
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
