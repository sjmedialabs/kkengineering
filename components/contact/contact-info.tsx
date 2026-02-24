"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface CompanySettings {
  name: string
  address: { street: string; city: string; state: string; zipCode: string; country: string }
  phone: string
  email: string
  socialMedia: { facebook?: string; twitter?: string; linkedin?: string; youtube?: string; instagram?: string }
}

export function ContactInfo() {
  const [company, setCompany] = useState<CompanySettings | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setCompany(data.company))
      .catch((error) => console.error("Failed to fetch company info:", error))
  }, [])

  if (!company) {
    return (
      <div className="space-y-10">
        <div className="h-32 bg-gray-200 animate-pulse rounded" />
        <div className="space-y-8">
          <div className="h-24 bg-gray-200 animate-pulse rounded" />
          <div className="h-24 bg-gray-200 animate-pulse rounded" />
          <div className="h-24 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    )
  }

  const fullAddress = `${company.address.street}\n${company.address.city}, ${company.address.state} ${company.address.zipCode}\n${company.address.country}`

  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-3 font-sans text-4xl font-bold text-gray-900">We'd love to hear from you</h2>
        <p className="font-sans text-base text-gray-600">Need something cleared up? Please contact our team</p>
      </div>

      <div className="space-y-8">
        {/* Email */}
        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
            <Image src="/images/icons/email-icon.png" alt="Email" width={28} height={28} />
          </div>
          <div>
            <h3 className="mb-2 font-sans text-xl font-semibold text-gray-900">Email</h3>
            <p className="mb-2 font-sans text-base text-gray-600">Our friendly team is here to help.</p>
            <a
              href={`mailto:${company.email}`}
              className="font-sans text-base font-medium text-brand-primary hover:underline"
            >
              {company.email}
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
            <Image src="/images/icons/phone-icon.png" alt="Phone" width={28} height={28} />
          </div>
          <div>
            <h3 className="mb-2 font-sans text-xl font-semibold text-gray-900">Phone</h3>
            <p className="mb-2 font-sans text-base text-gray-600">Mon-Fri from 9am to 6pm.</p>
            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className="font-sans text-base font-medium text-brand-primary hover:underline"
            >
              {company.phone}
            </a>
          </div>
        </div>

        {/* Office / Location */}
        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
            <Image src="/images/icons/location-icon.png" alt="Location" width={28} height={28} />
          </div>
          <div>
            <h3 className="mb-2 font-sans text-xl font-semibold text-gray-900">Office</h3>
            <p className="font-sans text-base leading-relaxed text-gray-600 whitespace-pre-line">
              {fullAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
