import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { allowIndexing, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteConfig.url}/`),
  title: {
    default: "Japanese Used Cars for Export | Wazir Trading LLC",
    template: "%s | Wazir Trading LLC",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  robots: allowIndexing
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: "Japanese Used Cars for Export | Wazir Trading LLC",
    description: siteConfig.description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Wazir Trading LLC — Japanese vehicle exporting" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Japanese Used Cars for Export | Wazir Trading LLC",
    description: siteConfig.description,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  category: "automotive",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D1B3E",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
