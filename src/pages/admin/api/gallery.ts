import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { uploadAndCommitImage } from "../../../lib/github-storage.ts";
import { validateImage } from "../../../lib/image-optimizer.ts";
import { adminDb } from "../../../lib/firebase-server.ts";

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

  // Filtra apenas arquivos válidos e preenchidos
  const validFiles = galleryFiles.filter((file) => file && file instanceof File && file.size > 0);

  if (validFiles.length === 0) {
    return redirect("/admin?tab=galleries&message=Error:+No+images+selected", 303);
  }

  // Validação de formato e tamanho (máx 5MB e formatos aceitos) para cada imagem
  for (const file of validFiles) {
    if (!validateImage(file)) {
      return redirect(
        "/admin?tab=galleries&message=Error:+Invalid+image+format+or+size+exceeds+5MB",
        303
      );
    }
  }

  try {
    const uploadedImageUrls: string[] = [];
    const targetFolder = `public/assets/services/${serviceId}`;

    const serviceRef = adminDb.collection("services").doc(serviceId);
    const doc = await serviceRef.get();
    const currentGallery = doc.exists ? doc.data()?.galleryImages || [] : [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const buffer = Buffer.from(await file.arrayBuffer());

      // Gera nome único usando timestamp para evitar colisões e sobrescritas (A-3)
      const timestamp = Date.now();
      const filename = `gallery-${timestamp}-${i + 1}`;
      
      const relativeUrl = await uploadAndCommitImage(buffer, targetFolder, filename);
      uploadedImageUrls.push(relativeUrl);
    }

    if (uploadedImageUrls.length > 0) {
      await serviceRef.set(
        {
          galleryImages: [...currentGallery, ...uploadedImageUrls],
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    return redirect("/admin?tab=galleries&message=Gallery+updated+successfully", 303);
  } catch (error: unknown) {
    console.error("Error uploading gallery images:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return redirect(
      `/admin?tab=galleries&message=${encodeURIComponent("Error: " + errorMessage)}`,
      303
    );
  }
};