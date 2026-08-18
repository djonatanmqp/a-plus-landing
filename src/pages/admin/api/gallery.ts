// src/pages/admin/api/gallery.ts
import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { validateImage } from "../../../lib/image-optimizer.ts";
import { supabase } from "../../../lib/supabase.ts"; // Usando o cliente padrão

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized", 303);
  }

  const formData = await request.formData();
  const serviceId = formData.get("serviceId")?.toString();
  const galleryFiles = formData.getAll("galleryImages") as File[];

  if (!serviceId) {
    return redirect("/admin?tab=galleries&message=Please+select+a+service", 303);
  }

  const validFiles = galleryFiles.filter((file) => file && file instanceof File && file.size > 0);
  if (validFiles.length === 0) {
    return redirect("/admin?tab=galleries&message=Error:+No+images+selected", 303);
  }

  for (const file of validFiles) {
    if (!validateImage(file)) {
      return redirect("/admin?tab=galleries&message=Error:+Invalid+image+format", 303);
    }
  }

  try {
    const uploadedImageUrls: string[] = [];
    
    // 1. Busca o array atual no banco
    const { data: service, error: fetchError } = await supabase
      .from("services")
      .select("images")
      .eq("id", serviceId)
      .single();

    if (fetchError) throw fetchError;
    const currentGallery: string[] = service?.images || [];

    // 2. Upload para o Supabase Storage
    for (const file of validFiles) {
      const timestamp = Date.now();
      const fileName = `gallery/${serviceId}/${timestamp}-${file.name.replace(/\s+/g, '-')}`;

      // Upload do arquivo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images") // Substitua pelo nome do seu bucket no Supabase
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Pegar URL pública
      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(uploadData.path);

      uploadedImageUrls.push(publicUrlData.publicUrl);
    }

    // 3. Atualizar o banco com as novas URLs
    const { error: updateError } = await supabase
      .from("services")
      .update({
        images: [...currentGallery, ...uploadedImageUrls],
        updated_at: new Date().toISOString(),
      })
      .eq("id", serviceId);

    if (updateError) throw updateError;

    return redirect("/admin?tab=galleries&message=Gallery+updated+successfully", 303);
  } catch (error: any) {
    console.error("Error uploading to Supabase Storage:", error);
    return redirect(`/admin?tab=galleries&message=${encodeURIComponent("Error: " + error.message)}`, 303);
  }
};