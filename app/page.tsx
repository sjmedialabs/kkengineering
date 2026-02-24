import type { Metadata } from "next";
import { HeroSection } from "@/components/client/hero-section";
import { StatsSection } from "@/components/client/stats-section";
import { AboutPreview } from "@/components/client/about-preview";
import { ServicesPreview } from "@/components/client/services-preview";
import { ProductsPreview } from "@/components/client/products-preview";
import { ProcessSection } from "@/components/client/process-section";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { generateSEOMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    path: "/",
  });
}

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <HeroSection />
        {/* <StatsSection /> */}
        <AboutPreview />
        <ProductsPreview />
        <ServicesPreview />
        <ProcessSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
