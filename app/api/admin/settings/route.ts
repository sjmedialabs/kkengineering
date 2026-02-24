import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { SettingsModel } from "@/lib/db/models/Settings";
import { getSession } from "@/lib/auth";

const defaultSettings = {
  seo: {
    siteName: "KK Engineeringtech Pvt Ltd",
    siteDescription:
      "Leading pharmaceutical company specializing in high-quality APIs, CMO, CDMO, and partnering services for global pharma needs.",
    siteUrl: "https://kkengineering.com",
    ogImage: "/og-image.jpg",
    twitterHandle: "@kkengineering",
    keywords: [
      "pharmaceutical",
      "APIs",
      "active pharmaceutical ingredients",
      "CMO",
      "CDMO",
      "contract manufacturing",
      "drug discovery",
      "pharma partnering",
    ],
    pages: {
      home: { title: "Home", description: "", keywords: [] },
      about: { title: "About Us", description: "", keywords: [] },
      products: { title: "Products", description: "", keywords: [] },
      services: { title: "Services", description: "", keywords: [] },
      contact: { title: "Contact Us", description: "", keywords: [] },
    },
  },
  branding: {
    websiteLogo: "/logo.png",
    websiteFavicon: "/favicon.ico",
    dashboardLogo: "/logo.png",
    dashboardFavicon: "/favicon.ico",
    colors: {
      primary: "#4977bb",
      secondary: "#d77423",
    },
    fonts: {
      primaryFont: "Poppins",
      secondaryFont: "Inter",
      paragraphFont: "Poppins",
      fontSource: "google",
      googleFontUrl: "",
      uploadedFonts: [],
      sizes: {
        h1: "3rem",
        h2: "2.5rem",
        h3: "2rem",
        h4: "1.5rem",
        h5: "1.25rem",
        h6: "1rem",
        paragraph: "1rem",
      },
    },
  },
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
    },
  },
};

export async function GET() {
  try {
    await connectDB();
    let settings = await SettingsModel.findOne();
    if (!settings) {
      settings = await SettingsModel.create(defaultSettings);
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    let settings = await SettingsModel.findOne();
    if (!settings) {
      settings = await SettingsModel.create(data);
    } else {
      settings = await SettingsModel.findOneAndUpdate({}, data, {
        new: true,
        runValidators: true,
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
