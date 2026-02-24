"use client"

import { useEffect, useState } from "react"
import type { Service } from "@/types"
import { ServiceCard } from "@/components/services/service-card"

export function ServicesGrid() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/services")
        const data = await response.json()
        setServices(data)
      } catch (error) {
        console.error("Failed to fetch services:", error)
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">SERVICES</h2>
            <p className="text-[#E67E22] text-lg">The Services page will include detailed service descriptions for</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#141570]"></div>
          </div>
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">SERVICES</h2>
            <p className="text-[#E67E22] text-lg">The Services page will include detailed service descriptions for</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">No services available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">SERVICES</h2>
          <p className="text-[#E67E22] text-lg">The Services page will include detailed service descriptions for</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
