"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { EnquiryModal } from "@/components/products/enquiry-modal"

interface ProductDetailContentProps {
  product: Product
}

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="lg:w-1/3">
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={product.image || "/images/placeholder.png"}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-2/3">
            {/* Product Title */}
            <h1 className="text-2xl font-semibold text-[#1a2847] mb-6">
              {product.name}
            </h1>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Key Features and Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#e87c2e] mb-4">Key features and details</h3>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y">
                    {product.productType && (
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700 w-1/3">Product Type</td>
                        <td className="px-4 py-3 text-gray-600">{product.productType}</td>
                      </tr>
                    )}
                    {product.capacity && (
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Capacity</td>
                        <td className="px-4 py-3 text-gray-600">{product.capacity}</td>
                      </tr>
                    )}
                    {product.screenDimension && (
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Screen Dimension</td>
                        <td className="px-4 py-3 text-gray-600">{product.screenDimension}</td>
                      </tr>
                    )}
                    {product.numberOfDecks && (
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Number of Decks</td>
                        <td className="px-4 py-3 text-gray-600">{product.numberOfDecks}</td>
                      </tr>
                    )}
                    {product.motorPower && (
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Motor Power</td>
                        <td className="px-4 py-3 text-gray-600">{product.motorPower}</td>
                      </tr>
                    )}
                    {product.gyratoryCircular && (
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Gyratory / Circular</td>
                        <td className="px-4 py-3 text-gray-600">{product.gyratoryCircular}</td>
                      </tr>
                    )}
                    {product.specialFeatures && (
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Special Features</td>
                        <td className="px-4 py-3 text-gray-600">{product.specialFeatures}</td>
                      </tr>
                    )}
                    {product.availability && (
                      <tr>
                        <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Availability</td>
                        <td className="px-4 py-3 text-gray-600">{product.availability}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enquiry Button */}
            <div>
              <Button
                onClick={() => setIsEnquiryOpen(true)}
                size="lg"
                className="bg-[#1a2847] hover:bg-[#2a3a5a] rounded-full px-12"
              >
                Enquiry Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} product={product} />
    </>
  )
}
