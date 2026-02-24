import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { SettingsModel } from "@/lib/db/models/Settings";

export const dynamic = 'force-dynamic'

const defaultPageHeroes = {
  products: { backgroundImage: "/images/products-hero.jpg", title: "PRODUCTS" },
  services: { backgroundImage: "/images/services/services-hero-banner.png", title: "SERVICES" },
  gallery: { backgroundImage: "/images/services/services-hero-banner.png", title: "GALLERY" },
  clients: { backgroundImage: "/images/services/services-hero-banner.png", title: "CLIENTS" },
  testimonials: { backgroundImage: "/images/services/services-hero-banner.png", title: "TESTIMONIALS" },
};

export async function GET() {
  try {
    await connectDB();
    let settings = await SettingsModel.findOne();
    if (!settings) {
      return NextResponse.json({
        company: {
          name: "KK Engineeringtech Pvt Ltd",
          address: {
            street: "123 Pharma Street",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
            country: "IN",
          },
          phone: "+91-22-1234-5678",
          email: "info@kkengineering.com",
          socialMedia: {
            facebook: "",
            twitter: "https://twitter.com/kkengineering",
            linkedin: "https://linkedin.com/company/kkengineering",
            youtube: "",
            instagram: "",
            whatsapp: "",
          },
        },
        branding: {
          websiteLogo: settings?.branding?.websiteLogo || "/logo.png",
          colors: {
            primary: "#4384C5",
            secondary: "#053C74",
          },
        },
        pageHeroes: defaultPageHeroes,
      });
    }
    return NextResponse.json({
      company: settings.company,
      branding: {
        websiteLogo: settings.branding?.websiteLogo || "/logo.png",
        colors: settings.branding?.colors,
      },
      pageHeroes: settings.pageHeroes || defaultPageHeroes,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}
