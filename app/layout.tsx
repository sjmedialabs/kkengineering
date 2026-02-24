import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/common/analytics";
import { BrandColorsLoader } from "@/components/common/brand-colors-loader";
import { StructuredData } from "@/components/common/structured-data";
import { generateOrganizationStructuredData } from "@/lib/seo";
import { Suspense } from "react";
import { connectDB } from "@/lib/db/mongodb";
import { SettingsModel } from "@/lib/db/models/Settings";

async function getSettings() {
  try {
    await connectDB();
    const settings = await SettingsModel.findOne().lean();
    return settings;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const siteName = settings?.seo?.siteName || "KK Engineeringtech Pvt Ltd";
  const siteDescription =
    settings?.seo?.siteDescription ||
    "Leading pharmaceutical company specializing in high-quality APIs, CMO, CDMO, and partnering services for global pharma needs.";
  const siteUrl = settings?.seo?.siteUrl || "https://kkengineering.com";
  const ogImage = settings?.seo?.ogImage || "/og-image.jpg";
  const twitterHandle = settings?.seo?.twitterHandle || "@kkengineering";
  const keywords = settings?.seo?.keywords || [
    "pharmaceutical",
    "APIs",
    "active pharmaceutical ingredients",
    "CMO",
    "CDMO",
    "contract manufacturing",
    "drug discovery",
    "pharma partnering",
  ];
  const favicon = settings?.branding?.websiteFavicon || "/favicon.ico";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: siteName,
      description: siteDescription,
      siteName: siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [ogImage],
      creator: twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    generator: "v0.app",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  const primaryFont = settings?.branding?.fonts?.primaryFont || "Poppins";
  const fontSource = settings?.branding?.fonts?.fontSource || "google";
  const googleFontUrl = settings?.branding?.fonts?.googleFontUrl;
  const primaryColor = settings?.branding?.colors?.primary || "#4384C5";
  const secondaryColor = settings?.branding?.colors?.secondary || "#053C74";
  const primaryTextColor =
    settings?.branding?.colors?.primaryTextColor || "#000000";
  const secondaryTextColor =
    settings?.branding?.colors?.secondaryTextColor || "#333333";

  // Build Google Fonts URL if using Google Fonts
  let fontLink = null;
  if (fontSource === "google" && googleFontUrl) {
    fontLink = googleFontUrl;
  } else if (fontSource === "google" && primaryFont) {
    // Fallback: construct basic Google Fonts URL
    const fontFamily = primaryFont.replace(/\s+/g, "+");
    fontLink = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@300;400;500;600;700&display=swap`;
  }

  return (
    <html lang="en" style={{ fontFamily: `"${primaryFont}", sans-serif` }}>
      <head>
        {fontLink && <link rel="stylesheet" href={fontLink} />}
        <StructuredData data={generateOrganizationStructuredData()} />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --color-primary: ${primaryColor};
              --color-secondary: ${secondaryColor};
              --color-text-primary: ${primaryTextColor};
              --color-text-secondary: ${secondaryTextColor};
              --font-primary: "${primaryFont}", sans-serif;
            }
          `,
          }}
        />
      </head>
      <body style={{ fontFamily: `"${primaryFont}", sans-serif` }}>
        <Suspense>
          <BrandColorsLoader />
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}

// Force dynamic rendering to ensure settings are always fetched fresh
export const dynamic = "force-dynamic";
export const revalidate = 0;
