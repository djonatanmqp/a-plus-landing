import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { c as validateAdminToken, t as SESSION_COOKIE_NAME } from "./admin_VvIW5NQF.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/pages/admin/api/company.ts
var company_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies, redirect }) => {
	const token = cookies.get(SESSION_COOKIE_NAME)?.value;
	if (!validateAdminToken(token)) return redirect("/admin?message=Unauthorized", 303);
	try {
		const formData = await request.formData();
		const updateData = {
			id: "company",
			name: formData.get("name")?.toString().trim() || "",
			tagline: formData.get("tagline")?.toString().trim() || "",
			address: {
				street: formData.get("address_street")?.toString().trim() || "",
				city: formData.get("address_city")?.toString().trim() || "",
				state: formData.get("address_state")?.toString().trim() || "FL",
				zip: formData.get("address_zip")?.toString().trim() || "",
				full: formData.get("address_full")?.toString().trim() || "",
				serviceArea: formData.get("address_serviceArea")?.toString().trim() || ""
			},
			contact: {
				phone: formData.get("contact_phone")?.toString().trim() || "",
				phoneRaw: formData.get("contact_phoneRaw")?.toString().trim() || "",
				facetime: formData.get("contact_facetime")?.toString().trim() || "",
				email: formData.get("contact_email")?.toString().trim() || ""
			},
			links: {
				facebook: formData.get("links_facebook")?.toString().trim() || "#",
				instagram: formData.get("links_instagram")?.toString().trim() || "#",
				tiktok: formData.get("links_tiktok")?.toString().trim() || "#",
				googleReview: formData.get("links_googleReview")?.toString().trim() || "",
				googleMapsEmbed: formData.get("links_googleMapsEmbed")?.toString().trim() || ""
			},
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		const { error: upsertError } = await supabase.from("settings").upsert(updateData, { onConflict: "id" });
		if (upsertError) throw new Error(upsertError.message);
		return redirect("/admin?tab=company&message=Company+settings+saved+successfully.", 303);
	} catch (error) {
		console.error("Error updating company settings:", error);
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
		return redirect(`/admin?tab=company&message=${encodeURIComponent("Error: " + errorMessage)}`, 303);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/admin/api/company@_@ts
var page = () => company_exports;
//#endregion
export { page };
