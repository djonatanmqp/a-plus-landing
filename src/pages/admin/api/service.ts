// src/pages/admin/api/service.ts
import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { validateImage } from "../../../lib/image-optimizer.ts";
import { supabaseAdmin } from "../../../lib/supabase-admin.ts";
import type { Database } from "../../../types/supabase";

interface ServiceData {
  main_image?: string | null;
  hero_image?: string | null;
  cover_image?: string | null;
  highlights?: string[];
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized", 303);
  }

  // Declaramos o serviceId fora para ficar acessível em caso de erro no catch
  let serviceId = "";

  try {
    const formData = await request.formData();
    serviceId = formData.get("id")?.toString() || formData.get("serviceId")?.toString() || "";

    if (!serviceId && formData.get("action") !== "create") {
      return redirect("/admin?tab=services&message=Select+a+service", 303);
    }

    const action = formData.get("action")?.toString() || "update";
    const title = formData.get("title")?.toString().trim() || "";
    const subtitle = formData.get("subtitle")?.toString().trim() || "";
    const short_description = formData.get("short_description")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";

    // Permite que o deploy funcione antes de o schema cache do Supabase ser atualizado.
    let usesLegacyImageColumns = false;
    let existingService: ServiceData | null = null;
    let fetchError: { code?: string; message?: string } | null = null;

    const schemaProbe = await supabaseAdmin
      .from("services")
      .select("main_image")
      .limit(1);

    if (schemaProbe.error?.message?.includes("main_image")) {
      usesLegacyImageColumns = true;
    }

    if (serviceId) {
      const result = await supabaseAdmin
        .from("services")
        .select(usesLegacyImageColumns ? "hero_image, cover_image, highlights" : "main_image, highlights")
        .eq("id", serviceId)
        .single();
      existingService = result.data as ServiceData | null;
      fetchError = result.error;
    }

    if (fetchError && fetchError.code !== "PGRST116") {
      console.warn("Notice fetching existing service:", fetchError.message);
    }

    const existingData = existingService || {};
    let highlights: string[] = Array.isArray(existingData.highlights) ? [...existingData.highlights] : [];

    // Tratamento das ações de destaques ou salvamento geral
    if (action === "add_highlight") {
      const newHighlight = formData.get("new_highlight")?.toString().trim();
      if (newHighlight) highlights.push(newHighlight);
    } else if (action.startsWith("delete_highlight_")) {
      const index = parseInt(action.replace("delete_highlight_", ""), 10);
      if (!isNaN(index)) highlights.splice(index, 1);
    } else if (action.startsWith("update_highlight_")) {
      const index = parseInt(action.replace("update_highlight_", ""), 10);
      const updatedValue = formData.get(`highlight_${index}`)?.toString().trim();
      if (!isNaN(index) && updatedValue !== undefined) {
        if (updatedValue === "") highlights.splice(index, 1);
        else highlights[index] = updatedValue;
      }
    } else {
      // Coleta todos os destaques enviados no formulário de salvamento geral
      const submittedHighlights = formData.getAll("highlights[]").map((h) => h.toString().trim()).filter(Boolean);
      if (submittedHighlights.length > 0) {
        highlights = submittedHighlights;
      }
    }

    const updateData: Database["public"]["Tables"]["services"]["Insert"] = {
      id: serviceId || `service-${Date.now()}`,
      title,
      subtitle,
      short_description,
      description,
      highlights,
      updated_at: new Date().toISOString(),
      ...(usesLegacyImageColumns
        ? {
            hero_image: existingData.hero_image || "",
            cover_image: existingData.cover_image || "",
          }
        : { main_image: existingData.main_image || "" }),
    };

    const uploadImageToSupabase = async (file: File): Promise<string> => {
      const targetId = updateData.id;
      const fileName = `services/${targetId}/main.webp`;

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("images")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("images")
        .getPublicUrl(uploadData.path);

      // Adicionamos um parâmetro de cache-busting (?t=timestamp) na URL pública 
      // para forçar o navegador a exibir a imagem nova imediatamente após a substituição
      return `${publicUrlData.publicUrl}?t=${Date.now()}`;
    };

    const mainFile = formData.get("main_image_file");
    if (mainFile && mainFile instanceof File && mainFile.size > 0) {
      if (!validateImage(mainFile)) {
        return redirect("/admin?tab=services&message=Error:+Invalid+main+image+format+or+size", 303);
      }
      const imageUrl = await uploadImageToSupabase(mainFile);
      if (usesLegacyImageColumns) {
        updateData.hero_image = imageUrl;
        updateData.cover_image = imageUrl;
      } else {
        updateData.main_image = imageUrl;
      }
    }

    const { error: upsertError } = await supabaseAdmin
      .from("services")
      .upsert(updateData);

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    // Sucesso: Redireciona mantendo o serviço selecionado ou limpando conforme o fluxo
    return redirect(`/admin?tab=services${serviceId ? `&service_id=${serviceId}` : ""}&message=Service+saved+successfully.`, 303);

  } catch (error: unknown) {
    console.error("Error updating service:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Erro: Mantém o serviço selecionado na tela para o usuário não perder os dados
    const queryParam = serviceId ? `&service_id=${serviceId}` : "";
    return redirect(`/admin?tab=services${queryParam}&message=${encodeURIComponent("Error: " + errorMessage)}`, 303);
  }
};