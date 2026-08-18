// src/pages/admin/api/service.ts
import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { validateImage } from "../../../lib/image-optimizer.ts";
import { supabase } from "../../../lib/supabase.ts";

// Interface para tipar corretamente os dados vindos do banco e evitar erros de compilação
interface ServiceData {
  hero_image?: string | null;
  cover_image?: string | null;
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized", 303);
  }

  try {
    const formData = await request.formData();
    const serviceId = formData.get("id")?.toString() || formData.get("serviceId")?.toString();

    if (!serviceId) {
      return redirect("/admin?tab=services&message=Select+a+service", 303);
    }

    const title = formData.get("title")?.toString().trim() || "";
    const subtitle = formData.get("subtitle")?.toString().trim() || "";
    const short_description = formData.get("shortDescription")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";

    // Coleta correta dos destaques
    const highlights = formData.getAll("highlights[]").map((h) => h.toString().trim()).filter(Boolean);

    // Busca o registro atual no Supabase para preservar imagens existentes caso não sejam enviadas novas
    const { data: existingService, error: fetchError } = await supabase
      .from("services")
      .select("hero_image, cover_image")
      .eq("id", serviceId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // Ignora erro se o registro ainda não existir (PGRST116 = row not found)
      console.warn("Notice fetching existing service:", fetchError.message);
    }

    // Aplica a tipagem para o objeto existente
    const existingData = (existingService as ServiceData) || {};

    const updateData: Record<string, unknown> = {
      id: serviceId,
      title,
      subtitle,
      short_description,
      description,
      highlights,
      updated_at: new Date().toISOString(),
      hero_image: existingData.hero_image || "",
      cover_image: existingData.cover_image || "",
    };

    // Função auxiliar interna para lidar com o upload individual para o Supabase Storage
    const uploadImageToSupabase = async (file: File, suffix: string): Promise<string> => {
      const timestamp = Date.now();
      const fileName = `services/${serviceId}/${serviceId}-${suffix}-${timestamp}.webp`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(uploadData.path);

      return publicUrlData.publicUrl;
    };

    // 1. Processamento da Hero Image
    const heroFile = formData.get("heroImage");
    if (heroFile && heroFile instanceof File && heroFile.size > 0) {
      if (!validateImage(heroFile)) {
        return redirect(
          "/admin?tab=services&message=Error:+Invalid+hero+image+format+or+size+exceeds+5MB",
          303
        );
      }
      updateData.hero_image = await uploadImageToSupabase(heroFile, "hero");
    }

    // 2. Processamento da Cover Image
    const coverFile = formData.get("coverImage");
    if (coverFile && coverFile instanceof File && coverFile.size > 0) {
      if (!validateImage(coverFile)) {
        return redirect(
          "/admin?tab=services&message=Error:+Invalid+cover+image+format+or+size+exceeds+5MB",
          303
        );
      }
      updateData.cover_image = await uploadImageToSupabase(coverFile, "cover");
    }

    // Atualiza ou insere o serviço no Supabase
    const { error: upsertError } = await supabase
      .from("services")
      .upsert(updateData);

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    return redirect("/admin?tab=services&message=Service+updated+successfully.", 303);
  } catch (error: unknown) {
    console.error("Error updating service:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return redirect(`/admin?tab=services&message=${encodeURIComponent("Error: " + errorMessage)}`, 303);
  }
};