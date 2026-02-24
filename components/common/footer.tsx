"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Facebook, Linkedin, Youtube } from "lucide-react"

interface FooterSettings {
  logo: string
  copyright: string
}

interface CompanySettings {
  name: string
  address: { street: string; city: string; state: string; zipCode: string; country: string }
  phone: string
  secondaryPhone?: string
  email: string
  website?: string
  socialMedia: { facebook?: string; twitter?: string; linkedin?: string; youtube?: string; instagram?: string }
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LocationIcon = () => (
  <svg className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const EmailIcon = () => (
  <svg className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const navLinksLeft = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Services", href: "/services" },
  { name: "Enquiry", href: "/contact" },
]

const navLinksRight = [
  { name: "Testimonials", href: "/testimonials" },
  { name: "Gallery", href: "/gallery" },
  { name: "Clients", href: "/clients" },
  { name: "Contact", href: "/contact" },
]

export function Footer() {
  const [footer, setFooter] = useState<FooterSettings | null>(null)
  const [company, setCompany] = useState<CompanySettings | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/content/footer").then((res) => res.json()),
      fetch("/api/settings").then((res) => res.json()),
    ])
      .then(([footerData, settingsData]) => {
        setFooter(footerData)
        setCompany(settingsData.company)
      })
      .catch((error) => console.error("Failed to fetch footer data:", error))
  }, [])

  const defaultCopyright = `${new Date().getFullYear()} KK engineering & steam solutions . All rights reserved`

  return (
    <>
      {/* Main Footer */}
      <footer className="bg-[#0a1628] py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
            {/* Left Section: Logo */}
            <div className="flex items-center flex-shrink-0">
              <img
                src={footer?.logo || "/logo-footer.png"}
                alt="KK Engineering Logo"
                className="h-28 w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
              />
            </div>

            {/* Center Section: Nav Links + Follow Us */}
            <div className="flex flex-col sm:flex-row gap-8 lg:gap-16">
              {/* Navigation Links */}
              <div className="flex gap-12 sm:gap-16">
                <ul className="space-y-2">
                  {navLinksLeft.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-[15px]">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2">
                  {navLinksRight.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-[15px]">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Follow Us */}
              <div>
                <p className="text-gray-300 mb-3 text-[15px]">Follow Us</p>
                <div className="flex gap-4">
                  <a href={company?.socialMedia?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href={company?.socialMedia?.twitter || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <XIcon />
                  </a>
                  <a href={company?.socialMedia?.youtube || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Youtube className="h-5 w-5" />
                  </a>
                  <a href={company?.socialMedia?.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Section: Contact Info with vertical line */}
            <div className="flex gap-8 lg:border-l lg:border-gray-600 lg:pl-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Get in Touch with us</h3>
                <p className="text-[#7eb8d8] font-medium mb-4">Head Office</p>
                
                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex gap-3">
                    <LocationIcon />
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {company?.address?.street || "No.509, 5th Floor, Meridian Plaza,"}<br />
                      {company?.address?.city || "Madhapur"} {company?.address?.state || "Hyderabad, Telangana,"}<br />
                      {company?.address?.country || "India"}-{company?.address?.zipCode || "500016"}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-3">
                    <PhoneIcon />
                    <div className="text-gray-300 text-sm">
                      <p>{company?.phone || "+91 73373 27303"}</p>
                      {company?.secondaryPhone && <p>{company.secondaryPhone}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-3">
                    <EmailIcon />
                    <div className="text-gray-300 text-sm">
                      <p>{company?.email || "info@kkengineering.com"}</p>
                      <p>{company?.website || "www.kkengineering.com"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Bar */}
      <div className="bg-[#1a3050] py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            {footer?.copyright || defaultCopyright}
          </p>
        </div>
      </div>
    </>
  )
}
