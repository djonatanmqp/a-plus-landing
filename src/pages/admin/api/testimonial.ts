// src/pages/admin/api/testimonial.ts
import type { APIRoute } from "astro";
import { parseCookies, validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { supabase } from "../../../lib/supabase.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
    const action = formData.get("action")?.toString();
    const idInput = (formData.get("id") ?? "").toString().trim();

    if (action === "delete" && idInput) {
      const { error: deleteError } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", idInput);

      if (deleteError) throw new Error(deleteError.message);
      return redirect("/admin?tab=testimonial&message=Testimonial+deleted+successfully", 303);
    }

    const service_id = (formData.get("service_id") ?? "").toString().trim();
    const name = (formData.get("name") ?? "").toString().trim();
    const location = (formData.get("location") ?? "").toString().trim();
    const date = (formData.get("date") ?? "").toString().trim();
    const rating = parseInt((formData.get("rating") ?? "5").toString(), 10);
    const content = (formData.get("content") ?? "").toString().trim();

    if (!name || !service_id || !content || !location || !date) {
      return redirect("/admin?tab=testimonial&message=Fill+in+all+required+fields", 303);
    }

    const beforeFile = formData.get("before_image_file") as File | null;
    const afterFile = formData.get("after_image_file") as File | null;

    const testimonialId = idInput || `testimonial-${Date.now()}`;

    const uploadImageToSupabase = async (file: File, type: string): Promise<string> => {
      if (!ALLOWED_MIME_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
        throw new Error(`Invalid ${type} image type or size exceeded (max 5MB)`);
      }

      const sanitizedName = file.name.replace(/\s+/g, '-');
      const fileName = `testimonials/${testimonialId}/${type}-${sanitizedName}`;

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

      return `${publicUrlData.publicUrl}?t=${Date.now()}`;
    };

    let beforeImagePath: string | undefined;
    let afterImagePath: string | undefined;

    if (beforeFile && beforeFile instanceof File && beforeFile.size > 0) {
      beforeImagePath = await uploadImageToSupabase(beforeFile, "before");
    }

    if (afterFile && afterFile instanceof File && afterFile.size > 0) {
      afterImagePath = await uploadImageToSupabase(afterFile, "after");
    }

    const testimonialData: Record<string, unknown> = {
      id: testimonialId,
      service_id,
      name,
      location,
      date,
      rating,
      content,
      updated_at: new Date().toISOString(),
    };

    if (beforeImagePath) testimonialData.before_image = beforeImagePath;
    if (afterImagePath) testimonialData.after_image = afterImagePath;

    if (idInput) {
      const { data: existing } = await supabase
        .from("testimonials")
        .select("before_image, after_image")
        .eq("id", idInput)
        .single();

      const existingData = (existing as TestimonialImageRecord) || {};
      if (!beforeImagePath && existingData.before_image) testimonialData.before_image = existingData.before_image;
      if (!afterImagePath && existingData.after_image) testimonialData.after_image = existingData.after_image;
    }

    const { error: upsertError } = await supabase
      .from("testimonials")
      .upsert(testimonialData);

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    const successMsg = idInput ? "Testimonial+updated+successfully!" : "Testimonial+added+successfully!";
    return redirect(`/admin?tab=testimonial&message=${successMsg}`, 303);
  } catch (error: unknown) {
    console.error("Error saving testimonial:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return redirect(`/admin?tab=testimonial&message=${encodeURIComponent("Error: " + errorMessage)}`, 303);
  }
};