"use client"

import { useEffect, useState } from "react"
import type { AboutPageContent } from "@/types"

const DEFAULT_IMAGE = "/placeholder.jpg"

export function AboutIntro() {
  const [content, setContent] = useState<AboutPageContent["intro"] | null>(null)

  useEffect(() => {
    fetch("/api/content/about")
      .then((res) => res.json())
      .then((data: AboutPageContent) => {
        if (data.intro) {
          setContent(data.intro)
        }
      })
      .catch((error) => console.error("Failed to fetch about intro:", error))
  }, [])

  // Default content fallback
  const defaultContent = {
    badge: "ABOUT US",
    title: "PIONEERING INNOVATION IN DRUG DISCOVERY",
    description: "We are committed to pushing the boundaries of pharmaceutical innovation, driving forward the development of life-changing medications through cutting-edge research and uncompromising quality standards.",
    image: DEFAULT_IMAGE,
  }

  // Use CMS content if available, otherwise use defaults
  const introContent = {
    badge: content?.badge || defaultContent.badge,
    title: content?.title || defaultContent.title,
    description: content?.description || defaultContent.description,
    image: content?.image || defaultContent.image,
  }

  if (!content) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <img
              src={introContent.image || DEFAULT_IMAGE}
              alt="About KK Engineering"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_IMAGE
              }}
            />
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
              {introContent.badge}
            </div>

            {/* Title */}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-poppins leading-tight">
              {introContent.title}
            </h2>

            {/* Description */}
            <div className="text-gray-600 font-poppins leading-relaxed space-y-4">
              {(introContent.description || '').split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
