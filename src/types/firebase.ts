interface Service {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  heroImage: string; // Caminho: /assets/services/[id]/[id]-hero.webp
  coverImage: string; // Caminho: /assets/services/[id]/[id]-cover.webp
  images: string[]; // Caminhos: /assets/services/[id]/[id]-[n].webp
  faq: Array<{ question: string; answer: string }>;
}

interface Company {
  name: string;
  tagline: string; // Substitui description
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    full: string;
    serviceArea: string;
  };
  contact: {
    phone: string;
    phoneRaw: string;
    facetime: string;
    email: string;
  };
  links: {
    instagram: string;
    facebook: string;
    tiktok: string;
    googleMapEmbed: string;
    googleReview: string;
  };
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  service: string;
  date: string;
  beforeImage: string; // Caminho: /assets/testimonials/[id]-before.webp
  afterImage: string; // Caminho: /assets/testimonials/[id]-after.webp
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export type {
  Service,
  Company,
  Testimonial,
  FAQ,
};