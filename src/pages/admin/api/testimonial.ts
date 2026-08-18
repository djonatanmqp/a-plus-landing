// src/pages/admin/api/testimonial.ts
import type { APIRoute } from "astro";
import { parseCookies, validateAdminToken, SESSION_COOKIE_NAME, sanitizeSlug } from "../../../lib/admin.ts";
import { supabase } from "../../../lib/supabase.ts";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Interface para tipar dados existentes do banco e evitar erros de compilação
interface TestimonialImageRecord {
  before_image?: string | null;
  after_image?: string | null;
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value || parseCookies(request.headers.get("cookie"))[SESSION_COOKIE_NAME];
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Authentication+required", 303);
  }

  try {
    const formData = await request.formData();
    const idInput = (formData.get("id") ?? "").toString().trim();
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

    if (!idInput && (!beforeFile || !beforeFile.size || !afterFile || !afterFile.size)) {
      return redirect("/admin?tab=testimonials&message=Upload+both+before+and+after+images", 303);
    }

    const dateString = `${monthValue}-01`;
    const serviceType = services.join(", ");
    const slug = sanitizeSlug(`${clientName}-${services[0] || "service"}-${monthValue}`);

    let beforeImagePath: string | undefined;
    let afterImagePath: string | undefined;

    // Função interna para upload seguro no Supabase Storage
    const uploadImageToSupabase = async (file: File, type: string): Promise<string> => {
      if (!ALLOWED_MIME_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
        throw new Error(`Invalid ${type} image type or size exceeded (max 5MB)`);
      }

      const timestamp = Date.now();
      const fileName = `testimonials/${slug}-${type}-${timestamp}.webp`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(uploadData.path);

      return publicUrlData.publicUrl;
    };

    if (beforeFile && beforeFile.size > 0) {
      beforeImagePath = await uploadImageToSupabase(beforeFile, "before");
    }

    if (afterFile && afterFile.size > 0) {
      afterImagePath = await uploadImageToSupabase(afterFile, "after");
    }

    // Se houver um ID, usa ele. Se não, gera um ID único com base no slug ou timestamp.
    const testimonialId = idInput || `testimonial-${Date.now()}`;

    const testimonialData: Record<string, unknown> = {
      id: testimonialId,
      name: clientName,
      service: services[0] || serviceType,
      location: `${city}, ${state}`,
      date: dateString,
      text: message,
      rating: 5,
      updated_at: new Date().toISOString(),
    };

    if (beforeImagePath) testimonialData.before_image = beforeImagePath;
    if (afterImagePath) testimonialData.after_image = afterImagePath;

    // Caso seja uma edição e o usuário não tenha enviado novas imagens, precisamos buscar as antigas para não sobrescrevê-las
    if (idInput) {
      const { data: existing } = await supabase
        .from("testimonials")
        .select("before_image, after_image")
        .eq("id", idInput)
        .single();

      const existingData = (existing as TestimonialImageRecord) || {};

      if (existingData) {
        if (!beforeImagePath) testimonialData.before_image = existingData.before_image;
        if (!afterImagePath) testimonialData.after_image = existingData.after_image;
      }
    }

    const { error: upsertError } = await supabase
      .from("testimonials")
      .upsert(testimonialData);

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    const successMsg = idInput ? "Testimonial+updated+successfully!" : "Testimonial+added+successfully!";
    return redirect(`/admin?tab=testimonials&message=${successMsg}`, 303);
  } catch (error: unknown) {
    console.error("Error saving testimonial:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return redirect(
      `/admin?tab=testimonials&message=${encodeURIComponent("Error: " + errorMessage)}`,
      303
    );
  }
};