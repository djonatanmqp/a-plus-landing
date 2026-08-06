import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../../lib/admin.ts";
import { getFirestore } from "firebase-admin/firestore";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized");
  }

  const formData = await request.formData();
  const serviceId = formData.get("serviceId")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString(); // Na prática, conterá a string Base64 ou URL antiga

  if (!serviceId || !imageUrl) {
    return redirect("/admin?tab=galleries&message=Missing+required+fields");
  }

  try {
    const db = getFirestore();
    const serviceRef = db.collection("services").doc(serviceId);
    const doc = await serviceRef.get();

    if (doc.exists) {
      const data = doc.data();
      const currentGallery: string[] = data?.galleryImages || [];
      const updatedGallery = currentGallery.filter((url) => url !== imageUrl);

      await serviceRef.update({
        galleryImages: updatedGallery,
        updatedAt: new Date().toISOString(),
      });
    }

    return redirect("/admin?tab=galleries&message=Image+deleted+successfully");
  } catch (error: any) {
    console.error("Error deleting gallery image:", error);
    return redirect(`/admin?tab=galleries&message=${encodeURIComponent(error.message)}`);
  }
};