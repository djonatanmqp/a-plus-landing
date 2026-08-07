import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { uploadAndCommitImage } from "../../../lib/github-storage.ts";
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

  try {
    const uploadedImageUrls: string[] = [];
    const targetFolder = `public/assets/services/${serviceId}`;

    const serviceRef = adminDb.collection("services").doc(serviceId);
    const doc = await serviceRef.get();
    const currentGallery = doc.exists ? doc.data()?.galleryImages || [] : [];

    for (let i = 0; i < galleryFiles.length; i++) {
      const file = galleryFiles[i];
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        // Padroniza a nomenclatura da imagem da galeria baseada na posição
        const filename = `gallery-${String(currentGallery.length + i + 1).padStart(2, '0')}`;
        const relativeUrl = await uploadAndCommitImage(buffer, targetFolder, filename);
        uploadedImageUrls.push(relativeUrl);
      }
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
  } catch (error: any) {
    console.error("Error uploading gallery images:", error);
    return redirect(`/admin?tab=galleries&message=${encodeURIComponent(error.message)}`, 303);
  }
};