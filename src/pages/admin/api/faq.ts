import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { type FAQ } from "../../../types/firebase";
import { addFaqData, updateFaqData } from "../../../lib/firebase-admin.ts";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized", 303);
  }

  try {
    const formData = await request.formData();
    const id = formData.get("id")?.toString().trim();
    const question = formData.get("question")?.toString().trim() || "";
    const answer = formData.get("answer")?.toString().trim() || "";
    const serviceId = formData.get("serviceId")?.toString().trim() || "";

    if (!question || !answer) {
      return redirect("/admin?tab=faq&message=Please+fill+in+all+fields", 303);
    }

    if (id) {
      await updateFaqData(id, {
        question,
        answer,
        ...(serviceId ? { serviceId } : {})
      } as any);

      return redirect("/admin?tab=faq&message=FAQ+updated+successfully!", 303);
    } else {
      await addFaqData({
        question,
        answer,
        ...(serviceId ? { serviceId } : {})
      } as any);

      return redirect("/admin?tab=faq&message=FAQ+added+successfully!", 303);
    }
  } catch (error: any) {
    console.error("Error saving FAQ:", error);
    return redirect(`/admin?tab=faq&message=${encodeURIComponent("Error saving FAQ: " + error.message)}`, 303);
  }
};