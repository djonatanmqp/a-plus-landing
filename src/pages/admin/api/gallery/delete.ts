// src/pages/admin/api/gallery/delete.ts
import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../../lib/admin.ts";
import { supabaseAdmin } from "../../../../lib/supabase-admin.ts";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized", 303);
  }

  try {
    const formData = await request.formData();
    const serviceId = formData.get("serviceId")?.toString();
    const imageUrl = formData.get("imageUrl")?.toString();

    if (!serviceId || !imageUrl) {
      return redirect("/admin?tab=galleries&message=Missing+required+fields", 303);
    }

    // 1. Busca o serviço atual no Supabase
    const { data: service, error: fetchError } = await supabaseAdmin
      .from("services")
      .select("images")
      .eq("id", serviceId)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    if (service) {
      const currentGallery: string[] = service.images || [];
      const updatedGallery = currentGallery.filter((url) => url !== imageUrl);

      // 2. Atualiza o array filtrado no banco de dados
      const { error: updateError } = await supabaseAdmin
        .from("services")
        .update({
          images: updatedGallery,
          updated_at: new Date().toISOString(),
        })
        .eq("id", serviceId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // 3. Deleta o arquivo do Supabase Storage
      try {
        // A URL pública do Supabase costuma ser algo como: 
        // https://<project>.supabase.co/storage/v1/object/public/images/gallery/123/file.webp
        // Precisamos extrair a parte após o nome do bucket ('images/')
        const urlObj = new URL(imageUrl);
        const pathParts = urlObj.pathname.split("/public/images/");
        
        if (pathParts.length > 1) {
          const filePath = pathParts[1]; // Ex: gallery/123/file.webp
          
          const { error: storageError } = await supabaseAdmin.storage
            .from("images")
            .remove([filePath]);

          if (storageError) {
            console.error("Warning: Could not delete file from storage:", storageError.message);
          }
        }
      } catch (storageErr) {
        console.error("Error parsing image URL for deletion:", storageErr);
        // Não interrompe o fluxo principal caso a exclusão do storage falhe, 
        // mas o registro já foi removido do banco.
      }
    }

    return redirect("/admin?tab=galleries&message=Image+deleted+successfully", 303);
  } catch (error: any) {
    console.error("Error deleting gallery image:", error);
    return redirect(`/admin?tab=galleries&message=${encodeURIComponent("Error deleting image: " + error.message)}`, 303);
  }
};