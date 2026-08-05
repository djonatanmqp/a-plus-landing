// src/lib/firebase-admin.ts
import { adminDb } from "./firebase-server";

// --- COMPANY ---
export async function getCompanyData() {
  try {
    const docSnap = await adminDb.collection("settings").doc("company").get();
    if (docSnap.exists) return docSnap.data();
  } catch (e) {
    console.error("Erro ao buscar dados da empresa:", e);
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
    return services;
  } catch (e) {
    console.error("Erro ao buscar serviços:", e);
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
    console.error("Erro ao buscar depoimentos:", e);
    return [];
  }
}

export async function addTestimonialData(data: any) {
  await adminDb.collection("testimonials").add({
    ...data,
    createdAt: data.createdAt || new Date(),
  });
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
    console.error("Erro ao buscar FAQ:", e);
    return [];
  }
}