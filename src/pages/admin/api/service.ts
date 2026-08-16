import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { uploadAndCommitImage } from "../../../lib/github-storage.ts";
import { validateImage } from "../../../lib/image-optimizer.ts";
import { updateServiceData } from "../../../lib/firebase-admin.ts";
import { adminDb } from "../../../lib/firebase-server.ts";

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

    // Coleta correta dos destaques (substitui bulletPoints/features)
    const highlights = formData.getAll("highlights[]").map((h) => h.toString().trim()).filter(Boolean);

    const docSnap = await adminDb.collection("services").doc(serviceId).get();
    const existingData = docSnap.exists ? docSnap.data() : {};

    const updateData: Record<string, unknown> = {
      id: serviceId,
      title,
      subtitle,
      shortDescription,
      description,
      highlights,
      updatedAt: new Date().toISOString(),
    };

    const targetFolder = `public/assets/services/${serviceId}`;

    // 1. Hero Image Process (Validação + Nome padronizado)
    const heroFile = formData.get("heroImage");
    if (heroFile && heroFile instanceof File && heroFile.size > 0) {
      if (!validateImage(heroFile)) {
        return redirect(
          "/admin?tab=services&message=Error:+Invalid+hero+image+format+or+size+exceeds+5MB",
          303
        );
      }
      const buffer = Buffer.from(await heroFile.arrayBuffer());
      updateData.heroImage = await uploadAndCommitImage(buffer, targetFolder, `${serviceId}-hero`);
    } else {
      updateData.heroImage = existingData?.heroImage || `/assets/services/${serviceId}/${serviceId}-hero.webp`;
    }

    // 2. Cover Image Process (Validação + Nome padronizado)
    const coverFile = formData.get("coverImage");
    if (coverFile && coverFile instanceof File && coverFile.size > 0) {
      if (!validateImage(coverFile)) {
        return redirect(
          "/admin?tab=services&message=Error:+Invalid+cover+image+format+or+size+exceeds+5MB",
          303
        );
      }
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      updateData.coverImage = await uploadAndCommitImage(buffer, targetFolder, `${serviceId}-cover`);
    } else {
      updateData.coverImage = existingData?.coverImage || `/assets/services/${serviceId}/${serviceId}-cover.webp`;
    }

    await updateServiceData(serviceId, updateData);

    return redirect("/admin?tab=services&message=Service+updated+successfully.", 303);
  } catch (error: unknown) {
    console.error("Error updating service:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return redirect(`/admin?tab=services&message=${encodeURIComponent("Error: " + errorMessage)}`, 303);
  }
};