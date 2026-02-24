"use client";

import Image from "next/image";
import type { Service } from "@/types";

const MAX_DESCRIPTION_WORDS = 7;

function truncateToWords(text: string | undefined, maxWords: number = MAX_DESCRIPTION_WORDS): string {
  if (!text || !text.trim()) return "";
  const words = text.trim().split(/\s+/).slice(0, maxWords);
  return words.join(" ");
}

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className = "" }: ServiceCardProps) {
  const description = truncateToWords(service.subtitle || (service as any).shortDescription);

  return (
    <div
      className={`bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${className}`}
    >
      {/* Image on top */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          fill
          className="object-cover"
        />
      </div>
      {/* Title and description below image */}
      <div className="p-8 pt-6 text-center space-y-2">
        <h3 className="text-[32px] font-bold text-brand-primary">
          {service.title}
        </h3>
        {description && (
          <p className="text-sm text-[#8893B9] uppercase tracking-wide">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
