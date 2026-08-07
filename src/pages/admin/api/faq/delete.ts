import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../../lib/admin.ts";
import { deleteFaqData } from "../../../../lib/firebase-admin.ts";

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

    await deleteFaqData(id);

    return redirect("/admin?tab=faq&message=FAQ+deleted+successfully!", 303);
  } catch (error: any) {
    console.error("Error deleting FAQ:", error);
    return redirect(`/admin?tab=faq&message=${encodeURIComponent("Error deleting FAQ: " + error.message)}`, 303);
  }
};