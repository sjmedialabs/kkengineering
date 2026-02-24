"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"
import { EnquiryModal } from "@/components/products/enquiry-modal"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)

  const handleEnquiryClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedProduct(product)
    setIsEnquiryModalOpen(true)
  }

  return (
    <div>
      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 transition-transform hover:scale-105 hover:shadow-xl block"
            >
              {/* Product Info */}
              <div className="p-8 text-center min-h-[180px] flex flex-col justify-center">
                <h3 className="text-[#1a2847] font-semibold text-lg mb-3 leading-tight">{product.name}</h3>
                <p className="text-[#6b7a99] text-sm">Cas No : {product.casNumber}</p>
                {product.inStock ? (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Category Label */}
              <div className="bg-[#5b8dc5] py-3 px-6 text-center">
                <p className="text-white text-sm font-medium">{product.category}</p>
              </div>

              {/* Enquiry Button */}
              <div className="p-8 flex justify-center">
                <Button
                  onClick={(e) => handleEnquiryClick(e, product)}
                  className="bg-[#1a2847] hover:bg-[#2a3857] text-white rounded-full px-10 py-6 text-base font-medium"
                >
                  Enquiry Now
                </Button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  )
}
