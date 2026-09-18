import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { c as validateAdminToken, t as SESSION_COOKIE_NAME } from "./admin_VvIW5NQF.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/pages/admin/api/faq.ts
var faq_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies, redirect }) => {
	const token = cookies.get(SESSION_COOKIE_NAME)?.value;
	if (!validateAdminToken(token)) return redirect("/admin?message=Unauthorized", 303);
	try {
		const formData = await request.formData();
		const action = formData.get("action")?.toString();
		const idInput = formData.get("id")?.toString().trim();
		const question = formData.get("question")?.toString().trim() || "";
		const answer = formData.get("answer")?.toString().trim() || "";
		const service_id = formData.get("service_id")?.toString().trim() || null;
		if (action === "delete" && idInput) {
			const { error: deleteError } = await supabase.from("faqs").delete().eq("id", idInput);
			if (deleteError) throw new Error(deleteError.message);
			return redirect(`/admin?tab=faq${service_id ? `&service_id=${service_id}` : ""}&message=FAQ+deleted+successfully`, 303);
		}
		if (!question || !answer) return redirect(`/admin?tab=faq${service_id ? `&service_id=${service_id}` : ""}&message=Please+fill+in+all+fields`, 303);
		const faqData = {
			id: idInput || `faq-${Date.now()}`,
			question,
			answer,
			service_id: service_id === "" ? null : service_id,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		const { error: upsertError } = await supabase.from("faqs").upsert(faqData);
		if (upsertError) throw new Error(upsertError.message);
		const successMessage = idInput ? "FAQ+updated+successfully!" : "FAQ+added+successfully!";
		return redirect(`/admin?tab=faq${service_id ? `&service_id=${service_id}` : ""}&message=${successMessage}`, 303);
	} catch (error) {
		console.error("Error saving FAQ:", error);
		return redirect(`/admin?tab=faq&message=${encodeURIComponent("Error saving FAQ: " + error.message)}`, 303);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/admin/api/faq@_@ts
var page = () => faq_exports;
//#endregion
export { page };
