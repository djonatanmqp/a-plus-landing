// src/pages/admin/api/faq.ts
import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { supabase } from "../../../lib/supabase.js";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized", 303);
  }

  try {
    const formData = await request.formData();
    const action = formData.get("action")?.toString();
    const idInput = formData.get("id")?.toString().trim();
    const question = formData.get("question")?.toString().trim() || "";
    const answer = formData.get("answer")?.toString().trim() || "";
    // Ajustado para capturar corretamente 'service_id' enviado pelo formulário
    const service_id = formData.get("service_id")?.toString().trim() || null;

    // Se a ação for delete
    if (action === "delete" && idInput) {
      const { error: deleteError } = await supabase
        .from("faqs")
        .delete()
        .eq("id", idInput);

      if (deleteError) throw new Error(deleteError.message);
      const redirectQuery = service_id ? `&service_id=${service_id}` : "";
      return redirect(`/admin?tab=faq${redirectQuery}&message=FAQ+deleted+successfully`, 303);
    }

    if (!question || !answer) {
      const redirectQuery = service_id ? `&service_id=${service_id}` : "";
      return redirect(`/admin?tab=faq${redirectQuery}&message=Please+fill+in+all+fields`, 303);
    }

    const faqId = idInput || `faq-${Date.now()}`;

    const faqData = {
      id: faqId,
      question,
      answer,
      service_id: service_id === "" ? null : service_id,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase
      .from("faqs")
      .upsert(faqData);

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    const successMessage = idInput ? "FAQ+updated+successfully!" : "FAQ+added+successfully!";
    const redirectQuery = service_id ? `&service_id=${service_id}` : "";
    return redirect(`/admin?tab=faq${redirectQuery}&message=${successMessage}`, 303);
  } catch (error: any) {
    console.error("Error saving FAQ:", error);
    return redirect(`/admin?tab=faq&message=${encodeURIComponent("Error saving FAQ: " + error.message)}`, 303);
  }
};