import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongodb";
import { SettingsModel } from "@/lib/db/models/Settings";

export const siteConfig = {
  name: "KK Engineeringtech Pvt Ltd",
  description:
    "Leading pharmaceutical company specializing in high-quality APIs, CMO, CDMO, and partnering services for global pharma needs.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://kkengineering.com",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/kkengineering",
    linkedin: "https://linkedin.com/company/kkengineering",
  },
};

async function getSettings() {
  try {
    await connectDB();
    const settings = await SettingsModel.findOne().lean();
    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

export async function generateSEOMetadata({
  title,
  description,
  image,
  path = "",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
}): Promise<Metadata> {
  const settings = await getSettings();
  const seoSettings = settings?.seo || {};

  // Use SEO settings from database, fallback to parameters, then to defaults
  const metaTitle = seoSettings.metaTitle || title || siteConfig.name;
  const metaDescription =
    seoSettings.metaDescription || description || siteConfig.description;
  const metaKeywords = seoSettings.metaKeywords || [
    "pharmaceutical",
    "APIs",
    "active pharmaceutical ingredients",
    "CMO",
    "CDMO",
    "contract manufacturing",
    "drug discovery",
    "pharma partnering",
  ];

  const url = `${siteConfig.url}${path}`;
  const ogImage = image || seoSettings.ogImage || siteConfig.ogImage;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
      creator: seoSettings.twitterHandle || "@kkengineering",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateProductStructuredData(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.casNumber,
    mpn: product.hsCode,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    manufacturer: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: "USD",
      url: `${siteConfig.url}/products/${product.slug}`,
    },
  };
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Pharma Street",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400001",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-22-1234-5678",
      contactType: "Customer Service",
      email: "info@kkengineering.com",
      availableLanguage: ["English"],
    },
    sameAs: [siteConfig.links.twitter, siteConfig.links.linkedin],
  };
}

export function generateBreadcrumbStructuredData(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}
