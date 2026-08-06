import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { bufferToWebpBase64 } from "../../../lib/image-optimizer.ts";
import { getFirestore } from "firebase-admin/firestore";

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
    const shortDescription = formData.get("shortDescription")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const bulletPoints = formData.getAll("bulletPoints[]").map((b) => b.toString().trim()).filter(Boolean);

    const db = getFirestore();
    const serviceRef = db.collection("services").doc(serviceId);
    
    const docSnap = await serviceRef.get();
    const existingData = docSnap.exists ? docSnap.data() : {};

    const updateData: any = {
      id: serviceId,
      title,
      subtitle,
      shortDescription,
      description,
      bulletPoints,
      updatedAt: new Date().toISOString(),
    };

    // 1. Processamento da Hero Image otimizada via Sharp (se enviada uma nova)
    const heroFile = formData.get("heroImage") as File;
    if (heroFile && heroFile.size > 0) {
      const buffer = Buffer.from(await heroFile.arrayBuffer());
      updateData.heroImage = await bufferToWebpBase64(buffer);
    } else if (existingData?.heroImage) {
      updateData.heroImage = existingData.heroImage;
    }

    // 2. Processamento da Cover Image otimizada via Sharp (se enviada uma nova)
    const coverFile = formData.get("coverImage") as File;
    if (coverFile && coverFile.size > 0) {
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      updateData.coverImage = await bufferToWebpBase64(buffer);
    } else if (existingData?.coverImage) {
      updateData.coverImage = existingData.coverImage;
    }

    await serviceRef.set(updateData, { merge: true });

    return redirect("/admin?tab=services&message=Service+updated+successfully.", 303);
  } catch (error: any) {
    console.error("Error updating service:", error);
    return redirect(`/admin?tab=services&message=${encodeURIComponent("Error updating service: " + error.message)}`, 303);
  }
};