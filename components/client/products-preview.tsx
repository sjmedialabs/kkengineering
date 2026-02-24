"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category } from "@/types";

const DEFAULT_PLACEHOLDER = "/product-placeholder.svg";

export function ProductsPreview() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data || []);
      })
      .catch((err) => console.error("Failed to fetch categories:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#5d7aa7]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/product-background.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-[42px] font-bold text-white">PRODUCTS</h2>
          <p className="text-[24px] font-light text-white">
            wide range of industrial equipment and systems
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-[200px] bg-gray-200" />
                <div className="p-6 text-center">
                  <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-white py-12">
            <p>No categories found. Add categories from the admin panel.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                {/* Image Container */}
                <div className="h-[200px] flex items-center justify-center bg-white p-8">
                  <img
                    src={category.image || DEFAULT_PLACEHOLDER}
                    alt={category.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER;
                    }}
                  />
                </div>

                {/* Title */}
                <div className="py-5 px-4 text-center border-t border-gray-100">
                  <h3 className="text-[#3b5998] font-bold text-lg group-hover:text-[#2d4373] transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-[#5d7aa7] bg-transparent rounded-full px-10 py-6 text-base transition-all duration-300"
          >
            <Link href="/products">View all products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
