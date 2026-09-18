// src/pages/admin/api/gallery.ts
import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { validateImage } from "../../../lib/image-optimizer.ts";
import { supabaseAdmin } from "../../../lib/supabase-admin.ts";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized", 303);
  }

  const formData = await request.formData();
  const serviceId = formData.get("service_id")?.toString() || formData.get("serviceId")?.toString();

  if (!serviceId) {
    return redirect("/admin?tab=galleries&message=Please+select+a+service", 303);
  }

  const galleryFiles = formData.getAll("gallery_images") as File[];
  const validFiles = galleryFiles.filter((file) => file && file instanceof File && file.size > 0);

  if (validFiles.length === 0) {
    return redirect(`/admin?tab=galleries&service_id=${serviceId}&message=Error:+No+images+selected`, 303);
  }

  for (const file of validFiles) {
    if (!validateImage(file)) {
      return redirect(`/admin?tab=galleries&service_id=${serviceId}&message=Error:+Invalid+image+format`, 303);
    }
  }

  try {
    // 1. Busca o array atual de imagens na tabela services
    const { data: service, error: fetchError } = await supabaseAdmin
      .from("services")
      .select("images")
      .eq("id", serviceId)
      .single();

    if (fetchError) throw fetchError;
    const currentGallery: string[] = service?.images || [];
    const uploadedImageUrls: string[] = [];

    // 2. Faz o upload de cada arquivo para o Supabase Storage
    for (const file of validFiles) {
      const sanitizedName = file.name.replace(/\s+/g, '-');
      const filePath = `gallery/${serviceId}/${sanitizedName}`;

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Substitui a imagem caso já exista uma com o mesmo nome
        });

      if (uploadError) throw uploadError;

      // 3. Captura a URL pública definitiva
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("images")
        .getPublicUrl(uploadData.path);

      // Adiciona parâmetro de cache-busting para atualizar instantaneamente na tela
      const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

      if (!uploadedImageUrls.includes(publicUrl)) {
        uploadedImageUrls.push(publicUrl);
      }
    }

    // 4. Junta as galerias antigas com as novas (evitando duplicadas idênticas)
    const combinedGallery = Array.from(new Set([...currentGallery, ...uploadedImageUrls]));

    // 5. Atualiza o banco de dados com as URLs públicas do Storage
    const { error: updateError } = await supabaseAdmin
      .from("services")
      .update({
        images: combinedGallery,
        updated_at: new Date().toISOString(),
      })
      .eq("id", serviceId);

    if (updateError) throw updateError;

    return redirect(`/admin?tab=galleries&service_id=${serviceId}&message=Gallery+updated+successfully`, 303);
  } catch (error: any) {
    console.error("Error uploading gallery images:", error);
    return redirect(`/admin?tab=galleries&service_id=${serviceId}&message=${encodeURIComponent("Error: " + error.message)}`, 303);
  }
};