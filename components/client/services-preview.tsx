"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Service } from "@/types";
import { ServiceCard } from "@/components/services/service-card";

export function ServicesPreview() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-[42px] font-bold text-black">SERVICES</h2>
            <p className="text-4xl font-light text-black">
              COMPREHENSIVE PHARMA SUPPORT SOLUTIONS
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#141570]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-[42px] font-bold text-black">SERVICES</h2>
            <p className="text-4xl font-light text-black">
              COMPREHENSIVE PHARMA SUPPORT SOLUTIONS
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">
              No services available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-[42px] font-bold text-black">SERVICES</h2>
          <p className="text-4xl font-light text-black">
            COMPREHENSIVE PHARMA SUPPORT SOLUTIONS
          </p>
        </div>

        <div className="relative">
          {/* Left Navigation Arrow */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous service"
          >
            <ChevronLeft className="w-6 h-6 text-brand-primary" />
          </button>

          {/* Right Navigation Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next service"
          >
            <ChevronRight className="w-6 h-6 text-brand-primary" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / Math.min(services.length, 3))}%)`,
              }}
            >
              {services.map((service) => (
                <div
                  key={service.id}
                  className="w-full md:w-1/3 flex-shrink-0 px-4"
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
