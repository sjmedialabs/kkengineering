"use client"

interface GalleryHeroProps {
  backgroundImage?: string;
  title?: string;
}

const DEFAULT_HERO_IMAGE = "/placeholder.jpg";

export function GalleryHero({ 
  backgroundImage,
  title = "GALLERY"
}: GalleryHeroProps) {
  const heroImage = backgroundImage || DEFAULT_HERO_IMAGE;
  
  return (
    <section className="relative h-[400px] bg-gray-200">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Gallery"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_HERO_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-wider">
          {title}
        </h1>
      </div>
    </section>
  );
}
