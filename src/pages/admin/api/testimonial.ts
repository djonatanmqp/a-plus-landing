import type { APIRoute } from "astro";
import { parseCookies, validateAdminToken, SESSION_COOKIE_NAME, sanitizeSlug } from "../../../lib/admin.ts";
import { bufferToWebpBase64 } from "../../../lib/image-optimizer.ts";
import { addTestimonialData } from "../../../lib/firebase-admin.ts";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value || parseCookies(request.headers.get("cookie"))[SESSION_COOKIE_NAME];
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Authentication+required", 303);
  }

  try {
    const formData = await request.formData();
    const clientName = (formData.get("clientName") ?? "").toString().trim();
    const serviceType = (formData.get("serviceType") ?? "").toString().trim();
    const city = (formData.get("city") ?? "").toString().trim();
    const state = (formData.get("state") ?? "").toString().trim();
    const message = (formData.get("message") ?? "").toString().trim();
    const monthValue = (formData.get("date") ?? "").toString().trim();

    if (!clientName || !serviceType || !city || !state || !message || !monthValue) {
      return redirect("/admin?tab=testimonials&message=Fill+in+all+the+testimonial+details", 303);
    }

    const beforeFile = formData.get("beforeImage") as File;
    const afterFile = formData.get("afterImage") as File;

    if (!beforeFile || !beforeFile.size || !afterFile || !afterFile.size) {
      return redirect("/admin?tab=testimonials&message=Upload+both+before+and+after+images", 303);
    }

    const dateString = `${monthValue}-01`;
    const slug = sanitizeSlug(`${clientName}-${serviceType}-${monthValue}`);

    // Conversão e Otimização da imagem "Before" via Sharp
    const beforeBuffer = Buffer.from(await beforeFile.arrayBuffer());
    const beforeImagePath = await bufferToWebpBase64(beforeBuffer);

    // Conversão e Otimização da imagem "After" via Sharp
    const afterBuffer = Buffer.from(await afterFile.arrayBuffer());
    const afterImagePath = await bufferToWebpBase64(afterBuffer);

    // Salva no Firestore via helper
    await addTestimonialData({
      slug,
      clientName,
      serviceType,
      city,
      state,
      beforeImage: beforeImagePath,
      afterImage: afterImagePath,
      date: dateString,
      message,
      createdAt: new Date().toISOString()
    });

    return redirect("/admin?tab=testimonials&message=Testimonial+added+successfully!", 303);
  } catch (error: any) {
    console.error("Error adding testimonial:", error);
    return redirect(`/admin?tab=testimonials&message=${encodeURIComponent("Error adding testimonial: " + error.message)}`, 303);
  }
};