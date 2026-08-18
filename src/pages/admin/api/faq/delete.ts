// src/pages/admin/api/faq/delete.ts
import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../../lib/admin.ts";
import { supabase } from "../../../../lib/supabase.ts";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized", 303);
  }

  try {
    const formData = await request.formData();
    const id = formData.get("id")?.toString();

    if (!id) {
      return redirect("/admin?tab=faq&message=Invalid+ID", 303);
    }

    const { error: deleteError } = await supabase
      .from("faqs")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return redirect("/admin?tab=faq&message=FAQ+deleted+successfully!", 303);
  } catch (error: any) {
    console.error("Error deleting FAQ:", error);
    return redirect(`/admin?tab=faq&message=${encodeURIComponent("Error deleting FAQ: " + error.message)}`, 303);
  }
};