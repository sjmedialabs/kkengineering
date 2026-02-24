import { type NextRequest, NextResponse } from "next/server"
import { getRepository } from "@/lib/repo"
import { getSession } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return await updateProduct(request, params)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return await updateProduct(request, params)
}

async function updateProduct(request: NextRequest, params: Promise<{ id: string }>) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const data = await request.json()

    // Basic validation - only name is required
    if (!data.name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      )
    }

    // Handle category mapping
    let categoryName = data.category
    if (data.categoryId) {
      const repo = getRepository()
      const categories = await repo.getAllCategories()
      const category = categories.find(c => c.id === data.categoryId)
      if (category) {
        categoryName = category.name
      }
    }

    // Prepare update data for industrial equipment
    const updateData: any = {
      name: data.name,
      description: data.description || null,
      category: categoryName,
      categoryId: data.categoryId || null,
      image: data.image || null,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"),
      // Industrial equipment specifications
      productType: data.productType || null,
      capacity: data.capacity || null,
      screenDimension: data.screenDimension || null,
      numberOfDecks: data.numberOfDecks || null,
      motorPower: data.motorPower || null,
      gyratoryCircular: data.gyratoryCircular || null,
      specialFeatures: data.specialFeatures || null,
      availability: data.availability || "In Stock",
      featured: data.featured || false,
      // SEO fields
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      metaKeywords: data.metaKeywords || [],
    }

    const repo = getRepository()
    const product = await repo.updateProduct(id, updateData)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Failed to update product:", error)
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const repo = getRepository()
    const success = await repo.deleteProduct(id)

    if (!success) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete product:", error)
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 })
  }
}