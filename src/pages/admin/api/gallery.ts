import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { bufferToWebpBase64 } from "../../../lib/image-optimizer.ts";
import { getFirestore } from "firebase-admin/firestore";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized");
  }

  const formData = await request.formData();
  const serviceId = formData.get("serviceId")?.toString();
  const galleryFiles = formData.getAll("galleryImages") as File[];

  if (!serviceId) {
    return redirect("/admin?tab=galleries&message=Please+select+a+service");
  }

  try {
    const db = getFirestore();
    const uploadedBase64Images: string[] = [];

    for (const file of galleryFiles) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        // Utiliza o otimizador centralizado via Sharp para converter em WebP
        const base64String = await bufferToWebpBase64(buffer);
        uploadedBase64Images.push(base64String);
      }
    }

    if (uploadedBase64Images.length > 0) {
      const serviceRef = db.collection("services").doc(serviceId);
      const doc = await serviceRef.get();
      const currentGallery = doc.exists ? doc.data()?.galleryImages || [] : [];

      await serviceRef.set(
        {
          galleryImages: [...currentGallery, ...uploadedBase64Images],
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    return redirect("/admin?tab=galleries&message=Gallery+updated+successfully");
  } catch (error: any) {
    console.error("Error uploading gallery images:", error);
    return redirect(`/admin?tab=galleries&message=${encodeURIComponent(error.message)}`);
  }
};