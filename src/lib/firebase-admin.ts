// src/lib/firebase-admin.ts
import { adminDb } from "./firebase-server";

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
export async function getCompanyData() {
  try {
    const docSnap = await adminDb.collection("settings").doc("company").get();
    if (docSnap.exists) return docSnap.data();
  } catch (e) {
    console.error("Error fetching company data:", e);
  }
  return {
    name: "A-Plus Pavers & Grass",
    description: "QUALITY PAVERS & SYNTHETIC GRASS INSTALLATION",
    contact: { phone: "", phoneRaw: "", facetime: "", email: "" },
    address: { full: "", serviceArea: "Orlando", city: "Orlando", state: "FL" },
    links: { googleReview: "", facebook: "", instagram: "", tiktok: "", googleMapsEmbed: "" }
  };
}

export async function saveCompanyData(data: any) {
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
    }
  };

  await adminDb.collection("settings").doc("company").set(updatedData, { merge: true });
}

// --- SERVICES ---
export async function getServicesData() {
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

export async function updateServiceData(id: string, data: any) {
  await adminDb.collection("services").doc(id).set(data, { merge: true });
}

// --- TESTIMONIALS ---
export async function getTestimonialsData() {
  try {
    const querySnapshot = await adminDb
      .collection("testimonials")
      .orderBy("createdAt", "desc")
      .get();
      
    const testimonials: any[] = [];
    querySnapshot.forEach((docSnap) => {
      testimonials.push({ id: docSnap.id, ...docSnap.data() });
    });
    return testimonials;
  } catch (e) {
    console.error("Error fetching testimonials:", e);
    return [];
  }
}

export async function getTestimonialById(id: string): Promise<any> {
  try {
    const docSnap = await adminDb.collection("testimonials").doc(id).get();
    if (!docSnap.exists) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (e) {
    console.error("Error fetching testimonial by id:", e);
    return null;
  }
}

export async function addTestimonialData(data: any) {
  return await adminDb.collection("testimonials").add({
    ...data,
    createdAt: data.createdAt || new Date(),
  });
}

export async function updateTestimonialData(id: string, data: any) {
  await adminDb.collection("testimonials").doc(id).set(
    {
      ...data,
      updatedAt: new Date(),
    },
    { merge: true }
  );
}

export async function deleteTestimonialData(id: string) {
  await adminDb.collection("testimonials").doc(id).delete();
}

// --- FAQ ---
export async function getFaqData() {
  try {
    const querySnapshot = await adminDb.collection("faq").get();
    const faqList: any[] = [];
    querySnapshot.forEach((docSnap) => {
      faqList.push({ id: docSnap.id, ...docSnap.data() });
    });
    return faqList;
  } catch (e) {
    console.error("Error fetching FAQ:", e);
    return [];
  }
}

export async function getFaqById(id: string): Promise<any> {
  try {
    const docSnap = await adminDb.collection("faq").doc(id).get();
    if (!docSnap.exists) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (e) {
    console.error("Error fetching FAQ by id:", e);
    return null;
  }
}

export async function addFaqData(faq: { question: string; answer: string; serviceId: string }) {
  return await adminDb.collection("faq").add({
    ...faq,
    createdAt: new Date(),
  });
}

export async function updateFaqData(id: string, data: any) {
  await adminDb.collection("faq").doc(id).set(
    {
      ...data,
      updatedAt: new Date(),
    },
    { merge: true }
  );
}

export async function deleteFaqData(id: string) {
  await adminDb.collection("faq").doc(id).delete();
}