import Image from "next/image";
import type { AboutPageContent } from "@/types";

interface AboutHeroProps {
  content?: AboutPageContent | null;
}

export function AboutHero({ content }: AboutHeroProps) {
  const backgroundImage =
    content?.hero?.backgroundImage || "/aboutus/banner.png";

  return (
    <section className="relative w-full h-[400px] md:h-[500px]">
      <Image
        src={backgroundImage}
        alt="KK Engineeringceutical Campus"
        fill
        className="object-cover"
        priority
      />
    </section>
  );
}
