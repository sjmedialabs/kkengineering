"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { Testimonial } from "@/types"

export function TestimonialsGrid() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/testimonials")
        const data = await response.json()
        setTestimonials(data)
      } catch (error) {
        console.error("Failed to fetch testimonials:", error)
        setTestimonials([])
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gray-500 text-lg">Feedback</p>
            <h2 className="text-4xl font-bold text-gray-900">Our Testimonials</h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#141570]"></div>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gray-500 text-lg">Feedback</p>
            <h2 className="text-4xl font-bold text-gray-900">Our Testimonials</h2>
          </div>
          <div className="text-center">
            <p className="text-gray-600">No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gray-500 text-lg">Feedback</p>
          <h2 className="text-4xl font-bold text-gray-900">Our Testimonials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-md p-8 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 20H5V15C5 12.2386 7.23858 10 10 10H12.5V15H10V20ZM25 20H20V15C20 12.2386 22.2386 10 25 10H27.5V15H25V20Z" fill="#E67E22" fillOpacity="0.3"/>
                </svg>
              </div>

              {/* Avatar and info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {testimonial.image ? (
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.title} at {testimonial.company}</p>
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-600 leading-relaxed">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
