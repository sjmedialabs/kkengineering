"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { GalleryItem } from "@/types"

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch("/api/gallery")
        const data = await response.json()
        setItems(data)
      } catch (error) {
        console.error("Failed to fetch gallery items:", error)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#141570]"></div>
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No gallery items available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-square relative">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-[#E67E22] text-lg">{item.name}</h3>
                {item.category && (
                  <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
