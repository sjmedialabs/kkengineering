"use client"

import { useEffect, useState } from "react"
import type { ContactPageContent } from "@/types"

export function ContactHero() {
  const [content, setContent] = useState<ContactPageContent["hero"] | null>(null)

  useEffect(() => {
    fetch("/api/content/contact")
      .then((res) => res.json())
      .then((data: ContactPageContent) => setContent(data.hero))
      .catch((error) => console.error("Failed to fetch contact hero:", error))
  }, [])

  if (!content) {
    return (
      <section className="relative h-[400px] w-full overflow-hidden bg-gray-200 animate-pulse">
        <div className="container mx-auto max-w-7xl relative z-10 flex h-full items-center px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl h-32 bg-gray-300 rounded" />
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[400px] w-full overflow-hidden bg-[#0A2540]">
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${content.backgroundImage}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/90 to-[#0A2540]/70" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 flex h-full items-center px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-2 font-sans text-[42px] font-medium uppercase tracking-wide text-brand-primary">
            {content.title}
          </p>
          <h1 className="font-sans text-[42px] font-normal leading-tight text-white">{content.subtitle}</h1>
        </div>
      </div>
    </section>
  )
}
