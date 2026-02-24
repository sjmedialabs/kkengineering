"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import type { AboutPageContent } from "@/types"

export function VisionMission() {
  const [content, setContent] = useState<AboutPageContent | null>(null)

  useEffect(() => {
    fetch("/api/content/about")
      .then((res) => res.json())
      .then((data: AboutPageContent) => {
        setContent(data)
      })
      .catch((error) => console.error("Failed to fetch about content:", error))
  }, [])

  const visionData = content?.vision || {
    badge: "OUR APPROACH",
    mainHeading: "STRATEGIC PROCESS BACKED BY PROVEN SCIENCE",
    visionTitle: "OUR VISION", 
    visionDescription: "To be a globally respected leader in the pharmaceutical and chemical service providing sector, recognized for excellence, reliability, and innovation. We strive to continuously enhance our products and services while upholding our core values of integrity, quality, and sustainable growth.",
    visionImage: "/images/vision-holographic.png"
  }

  const missionData = content?.mission || {
    missionTitle: "OUR MISSION",
    missionDescription: "We are committed to providing comprehensive solutions that support the pharmaceutical industry in creating safe, effective, and accessible healthcare products. Through continuous innovation and adherence to global quality standards, we aim to contribute meaningfully to improving human health worldwide.",
    missionImage: "/images/mission-research.png"
  }

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: "var(--color-secondary)" }}>
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="inline-block px-4 py-2 rounded-full border-2 border-white/30">
            <p className="text-sm font-medium text-white uppercase tracking-wide">
              {visionData.badge}
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-4">
            <h2
              className="font-light text-white mb-6"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "36px",
                fontWeight: 300,
                lineHeight: "1.3",
              }}
            >
              {visionData.mainHeading}
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {visionData.visionTitle}
            </h3>
            <p
              className="text-white/90 leading-relaxed"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px" }}
            >
              {visionData.visionDescription}
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={visionData.visionImage}
              alt="Vision concept"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
            <Image
              src={missionData.missionImage}
              alt="Mission research"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {missionData.missionTitle}
            </h3>
            <p
              className="text-white/90 leading-relaxed"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "15px" }}
            >
              {missionData.missionDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
