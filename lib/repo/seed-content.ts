import type {
  HomePageContent,
  AboutPageContent,
  ContactPageContent,
  FooterContent,
} from "@/types";

export const seedHomePageContent: HomePageContent = {
  id: "home_content_1",
  hero: {
    title: "DRIVEN BY CARE, GUIDED BY TRUST.",
    description:
      "A leading pharmaceutical company specializing in high-quality Active Pharmaceutical Ingredients (APIs), contract manufacturing, and innovative drug discovery solutions for global pharma needs.",
    primaryButtonText: "Explore Products",
    primaryButtonLink: "/products",
    secondaryButtonText: "Contact Us",
    secondaryButtonLink: "/contact",
    backgroundImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner%20image-oN5QlzPjYW4Wc0JyrRziWYXocrYEEn.png",
  },
  stats: {
    yearsExperience: 16,
    yearsExperienceLabel: "Years of Experience",
    productsDelivered: 500,
    productsDeliveredLabel: "Products Delivered",
    satisfiedClients: 200,
    satisfiedClientsLabel: "Satisfied Clients",
    countriesServed: 50,
    countriesServedLabel: "Countries Served",
  },
  aboutPreview: {
    badge: "WHO WE ARE",
    title: "PIONEERING INNOVATION IN DRUG DISCOVERY",
    description:
      "Sed ut perspiciatis unde omnis iste natus ut perspic iotis unde omnis iste perspiciatis ut perspiciatis unde omnis iste natus. Sed ut perspiciatis unde omnis iste natus. Perspic iotis unde omnis iste perspiciatis ut perspiciatis unde omnis iste natus. Sed ut perspiciatis.",
    features: [
      {
        icon: "💊",
        title: "Reliability",
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque perspiciatis.",
      },
      {
        icon: "🔬",
        title: "Sustainability",
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque perspiciatis.",
      },
      {
        icon: "💰",
        title: "Quality & Cost-Effectiveness",
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque perspiciatis.",
      },
    ],
    primaryButtonText: "Know more",
    secondaryButtonText: "Enquiry Now",
  },
  process: {
    title: "PROCESS",
    subtitle: "HIGH QUALITY LAB SERVICES",
    steps: [
      {
        number: "01",
        title: "Requirement",
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
        icon: "/images/icons/microscope.png",
      },
      {
        number: "02",
        title: "Proposal Development",
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
        icon: "/images/icons/prescription.png",
      },
      {
        number: "03",
        title: "Quality Manufacturing",
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
        icon: "/images/icons/molecule.png",
      },
      {
        number: "04",
        title: "Product Delivery",
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
        icon: "/images/icons/report.png",
      },
    ],
  },
  updatedAt: new Date(),
};

export const seedAboutPageContent: AboutPageContent = {
  id: "about_content_1",
  hero: {
    backgroundImage: "/images/about-hero.png",
  },
  intro: {
    badge: "ABOUT US",
    title: "PIONEERING INNOVATION IN DRUG DISCOVERY",
    description:
      "At KK Engineeringceuticals, we manufacture our own KSMs for APIs, giving us a distinct advantage over companies that depend on external vendors. Backed by an advanced R&D team of experienced scientists, we develop a wide range of KSMs and intermediates for leading pharmaceutical firms. We also undertake custom manufacturing of KSMs and intermediates on a reliable CDMO partner.",
    features: [
      {
        icon: "reliability",
        title: "Reliability",
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque perspiciatis.",
      },
      {
        icon: "sustainability",
        title: "Sustainability",
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque perspiciatis.",
      },
      {
        icon: "quality",
        title: "Quality & Cost-Effectiveness",
        description:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque perspiciatis.",
      },
    ],
  },
  vision: {
    badge: "OUR APPROACH",
    mainHeading: "STRATEGIC PROCESS BACKED BY PROVEN SCIENCE",
    visionTitle: "OUR VISION",
    visionDescription:
      "To be a globally respected leader in the pharmaceutical and chemical service providing sector, recognized for excellence, reliability, and innovation. We strive to continuously enhance our products and services while upholding our core values of integrity, quality, and sustainable growth.",
    visionImage: "/images/vision-holographic.jpg",
  },
  mission: {
    missionTitle: "OUR MISSION",
    missionDescription:
      "Our mission is to deliver high-quality pharmaceutical and chemical supplies & services with precision, efficiency, and reliability. We are committed to creating tangible value for our customers, partners, and communities by integrating sustainable business practices across all operations. We uphold the highest standards of accountability and responsibility, ensuring that our business practices respect our employees, customers, suppliers, and the environment.",
    missionImage: "/images/compass-mission.jpg",
  },
  whyUs: {
    badge: "WHY kkengineering",
    title: "Why Labrix for Trusted Research Solutions",
    description:
      "At KK Engineeringceuticals, we manufacture our own KSMs for APIs, giving us a distinct advantage over companies that depend on external vendors.",
    features: [
      {
        icon: "expertise",
        title: "Expertise & Experience",
        description:
          "16+ years of pharmaceutical industry experience with proven track record.",
      },
      {
        icon: "quality",
        title: "Quality Assurance",
        description:
          "ISO certified facilities with stringent quality control measures.",
      },
      {
        icon: "innovation",
        title: "Innovation",
        description:
          "Advanced R&D capabilities for custom synthesis and development.",
      },
    ],
  },
  updatedAt: new Date(),
};

export const seedContactPageContent: ContactPageContent = {
  id: "contact_content_1",
  hero: {
    title: "CONTACT US",
    subtitle:
      "Act fast and make kkengineering a part of your daily health routine",
    backgroundImage: "/images/contact/contact-hero-bg.png",
  },
  contactInfo: {
    email: {
      title: "Email",
      description: "Our friendly team is here to help.",
      value: "sales@kkengineeringpharma.com",
    },
    phone: {
      title: "Phone",
      description: "Monday to Saturday | 9:30 AM - 7:00 PM",
      value: "+91 970 49 44477",
    },
    office: {
      title: "Office",
      address:
        "Plot no 118, 3rd Floor, Brundavanam, Road no 3 Kakatiya Hills, Guttala_Begumpet Madhapur, Jubilee Hills, Hyderabad, Telangana 500033",
    },
  },
  updatedAt: new Date(),
};

export const seedFooterContent: FooterContent = {
  id: "footer_content_1",
  logo: "/images/kkengineering-logo-white.png",
  companyInfo:
    "Leading pharmaceutical company specializing in high-quality APIs and innovative solutions.",
  productLinks: [
    { name: "Products", href: "/products" },
    { name: "Import/Export", href: "/products" },
    { name: "Sourcing", href: "/products" },
    { name: "Domestic", href: "/products" },
  ],
  aboutLinks: [
    { name: "About Us", href: "/about" },
    { name: "Our Services", href: "/services" },
    { name: "Our Team", href: "/about" },
    { name: "Pathology", href: "/about" },
  ],
  socialMedia: {
    facebook: "https://facebook.com/kkengineeringpharma",
    twitter: "https://twitter.com/kkengineeringpharma",
    youtube: "https://youtube.com/kkengineeringpharma",
    linkedin: "https://linkedin.com/company/kkengineeringpharma",
  },
  newsletter: {
    heading: "Newsletter",
    placeholder: "Your email address",
  },
  contact: {
    location: "Hyderabad, Telangana India",
    phone: "+91-123 4567 8900",
    email: "hello@kkengineeringPharmatech",
  },
  copyright: "© 2025 KK Engineeringtech. All rights reserved.",
  updatedAt: new Date(),
};
