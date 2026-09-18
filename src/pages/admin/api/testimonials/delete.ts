// src/pages/admin/api/testimonials/delete.ts
import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../../lib/admin.ts";
import { supabaseAdmin } from "../../../../lib/supabase-admin.ts";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized", 303);
  }

  try {
    const formData = await request.formData();
    const id = formData.get("id")?.toString();

    if (!id) {
      return redirect("/admin?tab=testimonials&message=Invalid+ID", 303);
    }

    const { error: deleteError } = await supabaseAdmin
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return redirect("/admin?tab=testimonials&message=Testimonial+deleted+successfully!", 303);
  } catch (error: any) {
    console.error("Error deleting testimonial:", error);
    return redirect(`/admin?tab=testimonials&message=${encodeURIComponent("Error deleting testimonial: " + error.message)}`, 303);
  }
};