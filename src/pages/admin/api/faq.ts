// src/pages/admin/api/faq.ts
import type { APIRoute } from "astro";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { supabase } from "../../../lib/supabase.ts";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Unauthorized", 303);
  }

  try {
    const formData = await request.formData();
    const idInput = formData.get("id")?.toString().trim();
    const question = formData.get("question")?.toString().trim() || "";
    const answer = formData.get("answer")?.toString().trim() || "";
    const category = formData.get("serviceId")?.toString().trim() || null; // Mapeado para a coluna 'category' do schema

    if (!question || !answer) {
      return redirect("/admin?tab=faq&message=Please+fill+in+all+fields", 303);
    }

    // Se não houver ID, gera um ID único baseado em timestamp ou slug simples
    const faqId = idInput || `faq-${Date.now()}`;

    const faqData = {
      id: faqId,
      question,
      answer,
      category,
      updated_at: new Date().toISOString(),
    };

    // O upsert lida tanto com a inserção (novo) quanto com a atualização (se o id já existir)
    const { error: upsertError } = await supabase
      .from("faqs")
      .upsert(faqData);

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    const successMessage = idInput ? "FAQ+updated+successfully!" : "FAQ+added+successfully!";
    return redirect(`/admin?tab=faq&message=${successMessage}`, 303);
  } catch (error: any) {
    console.error("Error saving FAQ:", error);
    return redirect(`/admin?tab=faq&message=${encodeURIComponent("Error saving FAQ: " + error.message)}`, 303);
  }
};