export interface Service {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  image: string
  slug: string
  features: string[]
  featured?: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  createdAt: Date
  updatedAt: Date
  shortDescription?: string // Add this for frontend compatibility
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: string
  categoryId?: string
  image?: string
  // Industrial equipment specifications
  productType?: string
  capacity?: string
  screenDimension?: string
  numberOfDecks?: string
  motorPower?: string
  gyratoryCircular?: string
  specialFeatures?: string
  availability?: string
  featured?: boolean
  // SEO fields
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  image?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface GalleryItem {
  id: string
  name: string
  image: string
  category?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  id: string
  name: string
  logo: string
  website?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Testimonial {
  id: string
  name: string
  title: string
  company: string
  content: string
  image?: string
  rating?: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Enquiry {
  id: string
  type: "general" | "product" | "general_product" | "bulk" | "service"
  name: string
  email: string
  phone?: string
  company?: string
  productName?: string
  productCategory?: string
  selectedProductId?: string
  message?: string
  status: "pending" | "contacted" | "resolved"
  createdAt: Date
  updatedAt: Date
}

export interface HomePageContent {
  id: string
  hero: {
    title: string
    description: string
    primaryButtonText: string
    primaryButtonLink: string
    secondaryButtonText: string
    secondaryButtonLink: string
    backgroundImage: string
  }
  stats: {
    yearsExperience: number
    yearsExperienceLabel: string
    productsDelivered: number
    productsDeliveredLabel: string
    satisfiedClients: number
    satisfiedClientsLabel: string
    countriesServed: number
    countriesServedLabel: string
  }
  aboutPreview: {
    badge: string
    title: string
    description: string
    features: Array<{
      icon: string
      title: string
      description: string
    }>
    primaryButtonText: string
    secondaryButtonText: string
  }
  process: {
    title: string
    subtitle: string
    steps: Array<{
      number: string
      title: string
      description: string
      icon: string
    }>
  }
  updatedAt: Date
}

export interface AboutPageContent {
  id: string
  hero: {
    backgroundImage: string
  }
  intro: {
    badge: string
    title: string
    description: string
    image?: string
  }
  vision: {
    badge: string
    mainHeading: string
    visionTitle: string
    visionDescription: string
    visionImage: string
  }
  mission: {
    missionTitle: string
    missionDescription: string
    missionImage: string
  }
  whyUs: {
    badge: string
    title: string
    description: string
    image?: string
    features: Array<{
      icon: string
      title: string
      description: string
    }>
  }
  updatedAt: Date
}

export interface ContactPageContent {
  id: string
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  contactInfo: {
    email: {
      title: string
      description: string
      value: string
    }
    phone: {
      title: string
      description: string
      value: string
    }
    office: {
      title: string
      address: string
    }
  }
  updatedAt: Date
}

export interface FooterContent {
  id: string
  logo: string
  companyInfo: string
  productLinks: Array<{
    name: string
    href: string
  }>
  aboutLinks: Array<{
    name: string
    href: string
  }>
  socialMedia: {
    facebook?: string
    twitter?: string
    youtube?: string
    linkedin?: string
  }
  newsletter: {
    heading: string
    placeholder: string
  }
  contact: {
    location: string
    phone: string
    email: string
  }
  copyright: string
  updatedAt: Date
}

export interface PageHero {
  backgroundImage: string
  title: string
}

export interface Settings {
  id: string
  seo: {
    siteName: string
    siteDescription: string
    siteUrl: string
    ogImage: string
    twitterHandle: string
    keywords: string[]
    pages: {
      home: { title: string; description: string; keywords: string[] }
      about: { title: string; description: string; keywords: string[] }
      products: { title: string; description: string; keywords: string[] }
      services: { title: string; description: string; keywords: string[] }
      gallery: { title: string; description: string; keywords: string[] }
      clients: { title: string; description: string; keywords: string[] }
      testimonials: { title: string; description: string; keywords: string[] }
      contact: { title: string; description: string; keywords: string[] }
    }
  }
  pageHeroes: {
    products: PageHero
    services: PageHero
    gallery: PageHero
    clients: PageHero
    testimonials: PageHero
  }
  branding: {
    websiteLogo: string
    websiteFavicon: string
    dashboardLogo: string
    dashboardFavicon: string
    colors: {
      primary: string
      secondary: string
      primaryTextColor: string
      secondaryTextColor: string
    }
    fonts: {
      primaryFont: string
      secondaryFont: string
      paragraphFont: string
      sizes: {
        h1: string
        h2: string
        h3: string
        h4: string
        h5: string
        h6: string
        paragraph: string
      }
    }
  }
  company: {
    name: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    phone: string
    email: string
    socialMedia: {
      facebook?: string
      twitter?: string
      linkedin?: string
      youtube?: string
      instagram?: string
      whatsapp?: string
    }
  }
  updatedAt: Date
}
