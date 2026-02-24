"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

const FALLBACK_CONTENT = {
  title: "ENGINEERING EFFICIENCY  EXCELLENCE",
  description:
    "KK Engineering and Steam Solutions is a trusted manufacturer and supplier based in Shadnagar, Telangana, specializing in high-quality industrial equipment such as dust collectors, chemical tanks, boilers, and custom-engineered steam systems. <br> With a commitment to precision engineering and reliable performance, we cater to the diverse needs of industries including pharmaceuticals, food processing, power plants and manufacturing units.",
  primaryButtonText: "Know More",
  secondaryButtonText: "Enquiry Now",
};

export function AboutPreview() {
  const [content, setContent] = useState(FALLBACK_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/home")
      .then((res) => res.json())
      .then((data) => {
        if (data?.aboutPreview) {
          setContent(data.aboutPreview);
        }
      })
      .catch(() => {
        // silently fall back
      })
      .finally(() => setLoading(false));
  }, []);

  // if (loading) {
  //   return (
  //     <section className="py-10 bg-white">
  //       <div className="container mx-auto px-4">
  //         <div className="space-y-6 animate-pulse">
  //           <div className="h-8 w-40 bg-gray-200 rounded" />
  //           <div className="h-10 w-3/4 bg-gray-200 rounded" />
  //           <div className="h-20 w-full bg-gray-200 rounded" />
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="">
            <Image
              src="/Home/about.png"
              alt="About Us"
              width={1200}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <div className="">
            <h2 className="font-bold text-[32px] color-blue-kk">ABOUT US</h2>

            <h3 className="font-light text-[30px] color-black pt-2">
              {content.title}
            </h3>

            <p className="text-[14px] leading-relaxed color-gray-kk pt-3">
              {content.description}
            </p>

            <div className="flex gap-4 pt-4">
              <Button
                asChild
                className="rounded-full px-8 text-white bg-color-blue-kk"
              >
                <Link href="/about">{content.primaryButtonText}</Link>
              </Button>

              <Button
                asChild
                className="rounded-full px-8 text-white bg-color-orange-kk"
              >
                <Link href="/contact">{content.secondaryButtonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
