import type { APIContext } from "astro";
import { getFirestore } from "firebase-admin/firestore";
import { validateAdminToken, SESSION_COOKIE_NAME } from "../../../../lib/admin";

export async function POST({ request, cookies, redirect }: APIContext) {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!validateAdminToken(token)) {
    return redirect("/admin?message=Acesso+não+autorizado", 303);
  }

  try {
    const formData = await request.formData();
    const id = formData.get("id")?.toString();

    if (!id) {
      return redirect("/admin?tab=faq&message=ID+inválido", 303);
    }

    const db = getFirestore();
    await db.collection("faq").doc(id).delete();

    return redirect("/admin?tab=faq&message=FAQ+removido+com+sucesso!", 303);
  } catch (error) {
    console.error("Erro ao deletar FAQ:", error);
    return redirect("/admin?tab=faq&message=Erro+ao+deletar+FAQ", 303);
  }
}