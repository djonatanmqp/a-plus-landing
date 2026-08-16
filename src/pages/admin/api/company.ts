// src/pages/admin/api/company.ts
import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { getFirestore } from "firebase-admin/firestore";

type JsonObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// A2/A3 — Deep merge recursivo: preserva campos aninhados (contact/address/links)
// que não são editados pelo formulário (ex.: whatsapp, googleMapsEmbed).
function deepMerge(base: JsonObject, override: JsonObject): JsonObject {
  const result: JsonObject = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = result[key];
    if (isPlainObject(value) && isPlainObject(current)) {
      result[key] = deepMerge(current, value);
    } else if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized", 303);
  }

  try {
    const formData = await request.formData();

    const db = getFirestore();
    const companyRef = db.collection("settings").doc("company");

    // Dados enviados pelo formulário (objetos aninhados parciais)
    const formDataObj: JsonObject = {
      name: formData.get("name")?.toString().trim() || "",
      tagline: formData.get("tagline")?.toString().trim() || "",
      address: {
        street: formData.get("street")?.toString().trim() || "",
        city: formData.get("city")?.toString().trim() || "",
        state: formData.get("state")?.toString().trim() || "FL",
        zip: formData.get("zip")?.toString().trim() || "",
        full: formData.get("fullAddress")?.toString().trim() || "",
        serviceArea: formData.get("serviceArea")?.toString().trim() || "",
      },
      contact: {
        phone: formData.get("phone")?.toString().trim() || "",
        phoneRaw: formData.get("phoneRaw")?.toString().trim() || "",
        facetime: formData.get("facetime")?.toString().trim() || "",
        email: formData.get("email")?.toString().trim() || "",
      },
      links: {
        facebook: formData.get("facebook")?.toString().trim() || "#",
        instagram: formData.get("instagram")?.toString().trim() || "#",
        tiktok: formData.get("tiktok")?.toString().trim() || "#",
        googleReview: formData.get("googleReview")?.toString().trim() || "",
        googleMapsEmbed: formData.get("googleMapsEmbed")?.toString().trim() || "",
      },
      updatedAt: new Date().toISOString(),
    };

    // Lê o documento atual e faz deep merge para nunca sobrescrever campos
    // desconhecidos que existem apenas no Firestore.
    const docSnap = await companyRef.get();
    const currentData: JsonObject = (docSnap.exists ? docSnap.data() : {}) ?? {};
    const updateData = deepMerge(currentData, formDataObj);

    await companyRef.set(updateData, { merge: true });

    return redirect("/admin?tab=company&message=Company+settings+saved+successfully.", 303);
  } catch (error: unknown) {
    console.error("Error updating company settings:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return redirect(
      `/admin?tab=company&message=${encodeURIComponent("Error: " + errorMessage)}`,
      303
    );
  }
};