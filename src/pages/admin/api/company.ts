// src/pages/admin/api/company.ts
import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { supabase } from "../../../lib/supabase.ts";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized", 303);
  }

  try {
    const formData = await request.formData();

    // Construção dos dados seguindo a estrutura esperada pelo Supabase
    const updateData = {
      id: "company", // Garante que o upsert sempre afete o mesmo registro
      name: formData.get("name")?.toString().trim() || "",
      tagline: formData.get("tagline")?.toString().trim() || "",
      description: formData.get("description")?.toString().trim() || "",
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
      updated_at: new Date().toISOString(),
    };

    // Upsert no Supabase
    const { error: upsertError } = await supabase
      .from("settings")
      .upsert(updateData, { onConflict: "id" });

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    return redirect("/admin?tab=company&message=Company+settings+saved+successfully.", 303);
    
  } catch (error: unknown) {
    console.error("Error updating company settings:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return redirect(
      `/admin?tab=company&message=${encodeURIComponent("Error: " + errorMessage)}`,
      303
    );
  }
};