"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { AboutPageContent } from "@/types";

export function WhyLabrix() {
  const [content, setContent] = useState<AboutPageContent | null>(null);

  useEffect(() => {
    fetch("/api/content/about")
      .then((res) => res.json())
      .then((data: AboutPageContent) => {
        setContent(data);
      })
      .catch((error) => console.error("Failed to fetch about content:", error));
  }, []);

  const whyUsData = content?.whyUs || {
    badge: "WHY kkengineering",
    title: "WHY kkengineering FOR TRUSTED RESEARCH SOLUTIONS",
    description:
      "Our demand for a dynamic and technically competent chemical trading company emerged as pharmaceutical companies seek the most efficient and cost-effective ways to source high-quality APIs and intermediates. We understand the critical importance of reliable supply chains and the need for partners who can deliver on their promises, allowing our clients the freedom to focus on their core business.",
    image: "/images/pharmaceutical-research.jpg",
    features: [
      {
        icon: "/images/icon-quality.png",
        title: "Quality Assurance",
        description:
          "Rigorous quality control processes ensure all products meet international standards.",
      },
      {
        icon: "/images/icon-network.png",
        title: "Global Network",
        description:
          "Extensive network of trusted suppliers and partners worldwide.",
      },
      {
        icon: "/images/icon-medicines.png",
        title: "Expert Support",
        description:
          "Dedicated technical support team with deep industry expertise.",
      },
    ],
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <div>
              <span
                className="inline-block px-6 py-2 border-2 rounded-full text-sm font-medium uppercase tracking-wide mb-4"
                style={{
                  borderColor: "var(--color-primary)",
                  color: "var(--color-primary)",
                }}
              >
                {whyUsData.badge}
              </span>
              <h2
                className="font-light mb-6"
                style={{
                  color: "#000000",
                  fontSize: "36px",
                  fontFamily: "Poppins",
                }}
              >
                {whyUsData.title}
              </h2>
            </div>

            <p
              className="leading-relaxed"
              style={{
                color: "#656565",
                fontSize: "14px",
                fontFamily: "Poppins",
              }}
            >
              {whyUsData.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {(whyUsData.features || []).map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 flex justify-center">
                    <Image
                      src={feature.icon || "/images/icon-default.png"}
                      alt={feature.title}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{
                      color: "var(--color-primary)",
                      fontFamily: "Poppins",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "#656565", fontFamily: "Poppins" }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Link
                href="/contact"
                className="inline-block px-8 py-3 text-white font-medium rounded-full transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                GET IN TOUCH
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <Image
              src={whyUsData.image || "/images/pharmaceutical-research.jpg"}
              alt="Pharmaceutical research laboratory"
              width={600}
              height={500}
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
