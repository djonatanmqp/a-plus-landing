import type { APIRoute } from "astro";
import { parseCookies, validateAdminToken, SESSION_COOKIE_NAME, sanitizeSlug } from "../../../lib/admin.ts";
import { uploadAndCommitImage } from "../../../lib/github-storage.ts";
import { addTestimonialData, updateTestimonialData, getTestimonialById } from "../../../lib/firebase-admin.ts";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value || parseCookies(request.headers.get("cookie"))[SESSION_COOKIE_NAME];
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Authentication+required", 303);
  }

  try {
    const formData = await request.formData();
    const id = (formData.get("id") ?? "").toString().trim();
    const clientName = (formData.get("clientName") ?? "").toString().trim();
    const services = formData.getAll("services") as string[];
    const city = (formData.get("city") ?? "").toString().trim();
    const state = (formData.get("state") ?? "").toString().trim();
    const message = (formData.get("message") ?? "").toString().trim();
    const monthValue = (formData.get("date") ?? "").toString().trim();

    if (!clientName || services.length === 0 || !city || !state || !message || !monthValue) {
      return redirect("/admin?tab=testimonials&message=Fill+in+all+the+testimonial+details+and+select+at+least+one+service", 303);
    }

    const beforeFile = formData.get("beforeImage") as File | null;
    const afterFile = formData.get("afterImage") as File | null;

    if (!id && (!beforeFile || !beforeFile.size || !afterFile || !afterFile.size)) {
      return redirect("/admin?tab=testimonials&message=Upload+both+before+and+after+images", 303);
    }

    const dateString = `${monthValue}-01`;
    const serviceType = services.join(", ");
    const slug = sanitizeSlug(`${clientName}-${services[0] || "service"}-${monthValue}`);

    let beforeImagePath: string | undefined;
    let afterImagePath: string | undefined;
    const targetFolder = "public/assets/content/testimonials";

    if (beforeFile && beforeFile.size > 0) {
      if (!ALLOWED_MIME_TYPES.includes(beforeFile.type) || beforeFile.size > MAX_FILE_SIZE) {
        return redirect("/admin?tab=testimonials&message=Invalid+before+image+type+or+size+exceeded", 303);
      }
      const buffer = Buffer.from(await beforeFile.arrayBuffer());
      beforeImagePath = await uploadAndCommitImage(buffer, targetFolder, `${slug}-before`);
    }

    if (afterFile && afterFile.size > 0) {
      if (!ALLOWED_MIME_TYPES.includes(afterFile.type) || afterFile.size > MAX_FILE_SIZE) {
        return redirect("/admin?tab=testimonials&message=Invalid+after+image+type+or+size+exceeded", 303);
      }
      const buffer = Buffer.from(await afterFile.arrayBuffer());
      afterImagePath = await uploadAndCommitImage(buffer, targetFolder, `${slug}-after`);
    }

    if (id) {
      const existingData = await getTestimonialById(id);
      
      await updateTestimonialData(id, {
        clientName,
        services,
        serviceType,
        city,
        state,
        date: dateString,
        message,
        beforeImage: beforeImagePath || existingData?.beforeImage,
        afterImage: afterImagePath || existingData?.afterImage,
        updatedAt: new Date().toISOString()
      });

      return redirect("/admin?tab=testimonials&message=Testimonial+updated+successfully!", 303);
    } else {
      await addTestimonialData({
        slug,
        clientName,
        services,
        serviceType,
        city,
        state,
        beforeImage: beforeImagePath!,
        afterImage: afterImagePath!,
        date: dateString,
        message,
        createdAt: new Date().toISOString()
      });

      return redirect("/admin?tab=testimonials&message=Testimonial+added+successfully!", 303);
    }
  } catch (error: any) {
    console.error("Error saving testimonial:", error);
    return redirect(`/admin?tab=testimonials&message=${encodeURIComponent("Error saving testimonial: " + error.message)}`, 303);
  }
};