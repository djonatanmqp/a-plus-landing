// src/lib/firebase-admin.ts
import { adminDb } from "./firebase-server";
import { type Company, type Service, type Testimonial, type FAQ } from "../types/firebase";

// Fixed order defined for services
export const SERVICES_ORDER = [
  "Driveways",
  "Artificial Turf & Sod",
  "Patios & Walkways",
  "Pergolas & Summer Kitchens",
  "Pool Decks",
  "Other Services"
];

// Helper to sort array of services based on title
export function sortServices(services: any[]) {
  return services.sort((a, b) => {
    const indexA = SERVICES_ORDER.indexOf(a.title);
    const indexB = SERVICES_ORDER.indexOf(b.title);

    const posA = indexA === -1 ? 999 : indexA;
    const posB = indexB === -1 ? 999 : indexB;

    return posA - posB;
  });
}

// --- COMPANY ---

export async function getCompanyData(): Promise<Company | null> {
  try {
    const docSnap = await adminDb.collection("settings").doc("company").get();
    if (docSnap.exists) return docSnap.data() as Company;
  } catch (e) {
    console.error("Error fetching company data:", e);
  }
  
  // Fallback padrão se não encontrar no Firestore
  return {
    name: "A-Plus Pavers & Grass LLC",
    tagline: "QUALITY PAVERS & SYNTHETIC GRASS INSTALLATION",
    contact: { 
      phone: "(321) 496-3060", 
      phoneRaw: "3214963060", 
      facetime: "3214963060", 
      email: "contact@apluspaversgrass.com"
    },
    address: { 
      street: "2459 Cheney Hwy",
      city: "Titusville",
      state: "FL",
      zip: "32780",
      full: "2459 Cheney Hwy, Titusville, FL 32780", 
      serviceArea: "Central Florida and nearby cities" 
    },
    links: { 
      instagram: "#",
      facebook: "#",
      tiktok: "",
      googleMapEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7008.868573171923!2d-80.831329!3d28.556719!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e74df4e89827c7%3A0x62929890360ad056!2sA-Plus%20Pavers%20%26%20Grass%20LLC!5e0!3m2!1spt-BR!2sbr!4v1786839260310!5m2!1spt-BR!2sbr",
      googleReview: ""
    }
  };
}

export async function saveCompanyData(data: Partial<Company>) {
  const currentData = await getCompanyData();
  const updatedData = {
    ...currentData,
    ...data,
    contact: {
      ...(currentData?.contact || {}),
      ...(data.contact || {})
    },
    address: {
      ...(currentData?.address || {}),
      ...(data.address || {})
    },
    links: {
      ...(currentData?.links || {}),
      ...(data.links || {})
    }
  };

  await adminDb.collection("settings").doc("company").set(updatedData, { merge: true });
}

// --- SERVICES ---

export async function getServicesData(): Promise<Service[]> {
  try {
    const querySnapshot = await adminDb.collection("services").get();
    const services: any[] = [];
    querySnapshot.forEach((docSnap) => {
      services.push({ id: docSnap.id, ...docSnap.data() });
    });
    return sortServices(services);
  } catch (e) {
    console.error("Error fetching services:", e);
    return [];
  }
}

export async function updateServiceData(id: string, data: Partial<Service>) {
  await adminDb.collection("services").doc(id).set(data, { merge: true });
}

// --- TESTIMONIALS ---

export async function getTestimonialsData(): Promise<Testimonial[]> {
  try {
    const querySnapshot = await adminDb
      .collection("testimonials")
      .orderBy("date", "desc")
      .get();
      
    const testimonials: Testimonial[] = [];
    querySnapshot.forEach((docSnap) => {
      testimonials.push({ id: docSnap.id, ...docSnap.data() } as Testimonial);
    });
    return testimonials;
  } catch (e) {
    console.error("Error fetching testimonials:", e);
    return [];
  }
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  try {
    const docSnap = await adminDb.collection("testimonials").doc(id).get();
    if (!docSnap.exists) return null;
    return { id: docSnap.id, ...docSnap.data() } as Testimonial;
  } catch (e) {
    console.error("Error fetching testimonial by id:", e);
    return null;
  }
}

export async function addTestimonialData(data: Omit<Testimonial, 'id'>) {
  return await adminDb.collection("testimonials").add({
    ...data,
    date: data.date || new Date().toISOString().split('T')[0],
  });
}

export async function updateTestimonialData(id: string, data: Partial<Testimonial>) {
  await adminDb.collection("testimonials").doc(id).set(
    {
      ...data,
    },
    { merge: true }
  );
}

export async function deleteTestimonialData(id: string) {
  await adminDb.collection("testimonials").doc(id).delete();
}

// --- FAQ ---

export async function getFaqData(): Promise<FAQ[]> {
  try {
    const querySnapshot = await adminDb.collection("faq").get();
    const faqList: FAQ[] = [];
    querySnapshot.forEach((docSnap) => {
      faqList.push({ id: docSnap.id, ...docSnap.data() } as FAQ);
    });
    return faqList;
  } catch (e) {
    console.error("Error fetching FAQ:", e);
    return [];
  }
}

export async function getFaqById(id: string): Promise<FAQ | null> {
  try {
    const docSnap = await adminDb.collection("faq").doc(id).get();
    if (!docSnap.exists) return null;
    return { id: docSnap.id, ...docSnap.data() } as FAQ;
  } catch (e) {
    console.error("Error fetching FAQ by id:", e);
    return null;
  }
}

export async function addFaqData(faq: Omit<FAQ, 'id'>) {
  return await adminDb.collection("faq").add({
    ...faq,
  });
}

export async function updateFaqData(id: string, data: Partial<FAQ>) {
  await adminDb.collection("faq").doc(id).set(
    {
      ...data,
    },
    { merge: true }
  );
}

export async function deleteFaqData(id: string) {
  await adminDb.collection("faq").doc(id).delete();
}