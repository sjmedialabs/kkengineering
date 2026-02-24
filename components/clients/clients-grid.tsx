"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { Client } from "@/types"

export function ClientsGrid() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch("/api/clients")
        const data = await response.json()
        setClients(data)
      } catch (error) {
        console.error("Failed to fetch clients:", error)
        setClients([])
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gray-500 text-lg">Clients</p>
            <h2 className="text-4xl font-bold text-gray-900">Our Happy Clients</h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#141570]"></div>
          </div>
        </div>
      </section>
    )
  }

  if (clients.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gray-500 text-lg">Clients</p>
            <h2 className="text-4xl font-bold text-gray-900">Our Happy Clients</h2>
          </div>
          <div className="text-center">
            <p className="text-gray-600">No clients available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gray-500 text-lg">Clients</p>
          <h2 className="text-4xl font-bold text-gray-900">Our Happy Clients</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 max-w-5xl mx-auto border border-gray-200">
          {clients.map((client) => (
            <div
              key={client.id}
              className="aspect-[3/2] relative bg-white border border-gray-200 flex items-center justify-center p-6 hover:shadow-md transition-shadow duration-300"
            >
              {client.website ? (
                <a href={client.website} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                  <Image
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    fill
                    className="object-contain p-4"
                  />
                </a>
              ) : (
                <Image
                  src={client.logo || "/placeholder.svg"}
                  alt={client.name}
                  fill
                  className="object-contain p-4"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
