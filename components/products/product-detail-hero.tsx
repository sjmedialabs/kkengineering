import Image from "next/image";

export function ProductDetailHero() {
  return (
    <section className="relative h-[300px] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/products-hero.jpg"
        alt="Products"
        fill
        className="object-cover"
        priority
      />

      {/* Hexagonal Overlay Pattern */}
      <div className="absolute inset-0 bg-white/60">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hexagons"
              width="100"
              height="87"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M25 0L50 14.43V43.3L25 57.74L0 43.3V14.43L25 0z"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-primary">
              PRODUCTS
            </h2>
            <h1 className="font-sans text-3xl font-normal leading-relaxed text-foreground md:text-4xl">
              Act fast and make kkengineering
              <br />a part of your daily health routine
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
