// src/pages/admin/api/faq.ts
import type { APIRoute } from "astro";
import { addFaqData } from "../../../lib/firebase-admin";

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const question = formData.get("question")?.toString().trim();
    const answer = formData.get("answer")?.toString().trim();
    const serviceId = formData.get("serviceId")?.toString().trim() || "global";

    if (!question || !answer) {
      return redirect("/admin?tab=faq&message=Missing+required+fields");
    }

    await addFaqData({
      question,
      answer,
      serviceId,
    });

    return redirect("/admin?tab=faq&message=FAQ+added+successfully!");
  } catch (error) {
    console.error("Error adding FAQ:", error);
    return redirect("/admin?tab=faq&message=Error+adding+FAQ");
  }
};