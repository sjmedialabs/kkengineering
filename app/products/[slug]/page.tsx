import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRepository } from "@/lib/repo"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { WhatsAppButton } from "@/components/common/whatsapp-button"
import { StructuredData } from "@/components/common/structured-data"
import { generateProductStructuredData, generateBreadcrumbStructuredData, generateSEOMetadata } from "@/lib/seo"
import { ProductDetailHero } from "@/components/products/product-detail-hero"
import { ProductDetailContent } from "@/components/products/product-detail-content"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const repo = getRepository()
  const product = await repo.getProductBySlug(slug)

  if (!product) {
    return generateSEOMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      noIndex: true,
    })
  }

  return generateSEOMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${slug}`,
  })
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const repo = getRepository()
  const product = await repo.getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const breadcrumbs = generateBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: product.name, url: `/products/${slug}` },
  ])

  const productData = generateProductStructuredData(product)

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <StructuredData data={productData} />
      <Header />
      <ProductDetailHero />
      <main className="min-h-screen bg-background">
        <ProductDetailContent product={product} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
