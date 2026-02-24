"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Beaker } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { EnquiryModal } from "@/components/products/enquiry-modal";
import type { Category, Service } from "@/types";

const baseNavigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.branding?.websiteLogo) {
          setLogo(data.branding.websiteLogo);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex h-24 items-center justify-between">
            <Link href="/" className="flex items-center">
              {/* <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kk-engineering-LOGO-original-wWP2iaSaGxp7DpW3TLlb0sTnTqTdst.png"
                alt="KK Engineeringceutical"
                width={300}
                height={90}
                className="h-[90px] w-auto"
                priority
              /> */}

              {logo ? (
                <Image
                  src={logo}
                  alt="Logo"
                  width={266}
                  height={114}
                  className="object-contain"
                />
              ) : (
                <Beaker className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-6">
              {baseNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-base font-medium text-gray-700 hover:text-primary transition-colors relative pb-1 ${
                      isActive
                        ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-secondary"
                        : ""
                    }`}
                    onClick={closeDropdowns}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Services Dropdown */}
              <div className="relative">
                <button
                  className={`flex items-center gap-1 text-base font-medium text-gray-700 hover:text-primary transition-colors relative pb-1 ${
                    pathname.startsWith("/services")
                      ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-secondary"
                      : ""
                  }`}
                  onClick={() => handleDropdownToggle("services")}
                  onMouseEnter={() => setActiveDropdown("services")}
                >
                  Services
                  <ChevronDown className="h-4 w-4" />
                </button>

                {activeDropdown === "services" && (
                  <div
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href="/services"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      onClick={closeDropdowns}
                    >
                      All Services
                    </Link>
                    {services.length > 0 && <hr className="my-2" />}
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        href={`/services#${service.slug}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={closeDropdowns}
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Products Dropdown with Categories */}
              <div className="relative">
                <button
                  className={`flex items-center gap-1 text-base font-medium text-gray-700 hover:text-primary transition-colors relative pb-1 ${
                    pathname.startsWith("/products")
                      ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-secondary"
                      : ""
                  }`}
                  onClick={() => handleDropdownToggle("products")}
                  onMouseEnter={() => setActiveDropdown("products")}
                >
                  Products
                  <ChevronDown className="h-4 w-4" />
                </button>

                {activeDropdown === "products" && (
                  <div
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href="/products"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors font-medium"
                      onClick={closeDropdowns}
                    >
                      All Products
                    </Link>
                    {categories.length > 0 && <hr className="my-2" />}

                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.name}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={closeDropdowns}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/gallery"
                className={`text-base font-medium text-gray-700 hover:text-primary transition-colors relative pb-1 ${
                  pathname === "/gallery"
                    ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-secondary"
                    : ""
                }`}
                onClick={closeDropdowns}
              >
                Gallery
              </Link>

              <Link
                href="/clients"
                className={`text-base font-medium text-gray-700 hover:text-primary transition-colors relative pb-1 ${
                  pathname === "/clients"
                    ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-secondary"
                    : ""
                }`}
                onClick={closeDropdowns}
              >
                Clients
              </Link>

              <Link
                href="/testimonials"
                className={`text-base font-medium text-gray-700 hover:text-primary transition-colors relative pb-1 ${
                  pathname === "/testimonials"
                    ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-secondary"
                    : ""
                }`}
                onClick={closeDropdowns}
              >
                Testimonials
              </Link>

              <Link
                href="/contact"
                className={`text-base font-medium text-gray-700 hover:text-primary transition-colors relative pb-1 ${
                  pathname === "/contact"
                    ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-secondary"
                    : ""
                }`}
                onClick={closeDropdowns}
              >
                Contact Us
              </Link>

              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="px-6 py-2.5 text-white font-medium rounded-full transition-colors"
                style={{ backgroundColor: "var(--color-primary)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ef4444")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-primary)")
                }
              >
                Enquiry Now
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 space-y-2 border-t">
              {baseNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block py-2 text-lg font-medium text-gray-700 hover:text-primary transition-colors ${
                      isActive ? "text-red-600 font-semibold" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Services */}
              <div>
                <Link
                  href="/services"
                  className={`block py-2 text-lg font-medium text-gray-700 hover:text-primary transition-colors ${
                    pathname.startsWith("/services")
                      ? "text-red-600 font-semibold"
                      : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                {services.length > 0 && (
                  <div className="ml-4 space-y-1">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        href={`/services#${service.slug}`}
                        className="block py-1 text-sm text-gray-600 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Products with Categories */}
              <div>
                <Link
                  href="/products"
                  className={`block py-2 text-lg font-medium text-gray-700 hover:text-primary transition-colors ${
                    pathname.startsWith("/products")
                      ? "text-red-600 font-semibold"
                      : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                {categories.length > 0 && (
                  <div className="ml-4 space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.name}`}
                        className="block py-1 text-sm text-gray-600 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/gallery"
                className={`block py-2 text-lg font-medium text-gray-700 hover:text-primary transition-colors ${
                  pathname === "/gallery" ? "text-red-600 font-semibold" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </Link>

              <Link
                href="/clients"
                className={`block py-2 text-lg font-medium text-gray-700 hover:text-primary transition-colors ${
                  pathname === "/clients" ? "text-red-600 font-semibold" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Clients
              </Link>

              <Link
                href="/testimonials"
                className={`block py-2 text-lg font-medium text-gray-700 hover:text-primary transition-colors ${
                  pathname === "/testimonials" ? "text-red-600 font-semibold" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>

              <Link
                href="/contact"
                className={`block py-2 text-lg font-medium text-gray-700 hover:text-primary transition-colors ${
                  pathname === "/contact" ? "text-red-600 font-semibold" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>

              <button
                onClick={() => {
                  setIsEnquiryModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-6 py-2.5 text-white font-medium rounded-full transition-colors mt-4"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Enquiry Now
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* EnquiryModal component */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </>
  );
}
