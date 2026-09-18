import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { c as validateAdminToken, t as SESSION_COOKIE_NAME } from "./admin_VvIW5NQF.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
import { t as validateImage } from "./image-optimizer_CqLGBnyO.mjs";
//#region src/pages/admin/api/service.ts
var service_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies, redirect }) => {
	const token = cookies.get(SESSION_COOKIE_NAME)?.value;
	if (!validateAdminToken(token)) return redirect("/admin?message=Unauthorized", 303);
	let serviceId = "";
	try {
		const formData = await request.formData();
		serviceId = formData.get("id")?.toString() || formData.get("serviceId")?.toString() || "";
		if (!serviceId && formData.get("action") !== "create") return redirect("/admin?tab=services&message=Select+a+service", 303);
		const action = formData.get("action")?.toString() || "update";
		const title = formData.get("title")?.toString().trim() || "";
		const subtitle = formData.get("subtitle")?.toString().trim() || "";
		const short_description = formData.get("short_description")?.toString().trim() || "";
		const description = formData.get("description")?.toString().trim() || "";
		const { data: existingService, error: fetchError } = serviceId ? await supabase.from("services").select("hero_image, cover_image, highlights").eq("id", serviceId).single() : {
			data: null,
			error: null
		};
		if (fetchError && fetchError.code !== "PGRST116") console.warn("Notice fetching existing service:", fetchError.message);
		const existingData = existingService || {};
		let highlights = Array.isArray(existingData.highlights) ? [...existingData.highlights] : [];
		if (action === "add_highlight") {
			const newHighlight = formData.get("new_highlight")?.toString().trim();
			if (newHighlight) highlights.push(newHighlight);
		} else if (action.startsWith("delete_highlight_")) {
			const index = parseInt(action.replace("delete_highlight_", ""), 10);
			if (!isNaN(index)) highlights.splice(index, 1);
		} else if (action.startsWith("update_highlight_")) {
			const index = parseInt(action.replace("update_highlight_", ""), 10);
			const updatedValue = formData.get(`highlight_${index}`)?.toString().trim();
			if (!isNaN(index) && updatedValue !== void 0) {
				if (updatedValue === "") highlights.splice(index, 1);
				else highlights[index] = updatedValue;
			}
		} else {
			const submittedHighlights = formData.getAll("highlights[]").map((h) => h.toString().trim()).filter(Boolean);
			if (submittedHighlights.length > 0) highlights = submittedHighlights;
		}
		const updateData = {
			title,
			subtitle,
			short_description,
			description,
			highlights,
			updated_at: (/* @__PURE__ */ new Date()).toISOString(),
			hero_image: existingData.hero_image || "",
			cover_image: existingData.cover_image || ""
		};
		if (serviceId) updateData.id = serviceId;
		const uploadImageToSupabase = async (file, type) => {
			const fileName = `services/${serviceId || "new"}/${type}.webp`;
			const { data: uploadData, error: uploadError } = await supabase.storage.from("images").upload(fileName, file, {
				cacheControl: "3600",
				upsert: true
			});
			if (uploadError) throw new Error(uploadError.message);
			const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(uploadData.path);
			return `${publicUrlData.publicUrl}?t=${Date.now()}`;
		};
		const heroFile = formData.get("hero_image_file");
		if (heroFile && heroFile instanceof File && heroFile.size > 0) {
			if (!validateImage(heroFile)) return redirect("/admin?tab=services&message=Error:+Invalid+hero+image+format+or+size", 303);
			updateData.hero_image = await uploadImageToSupabase(heroFile, "hero");
		}
		const coverFile = formData.get("cover_image_file");
		if (coverFile && coverFile instanceof File && coverFile.size > 0) {
			if (!validateImage(coverFile)) return redirect("/admin?tab=services&message=Error:+Invalid+cover+image+format+or+size", 303);
			updateData.cover_image = await uploadImageToSupabase(coverFile, "cover");
		}
		const { error: upsertError } = await supabase.from("services").upsert(updateData);
		if (upsertError) throw new Error(upsertError.message);
		return redirect(`/admin?tab=services${serviceId ? `&service_id=${serviceId}` : ""}&message=Service+saved+successfully.`, 303);
	} catch (error) {
		console.error("Error updating service:", error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		return redirect(`/admin?tab=services${serviceId ? `&service_id=${serviceId}` : ""}&message=${encodeURIComponent("Error: " + errorMessage)}`, 303);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/admin/api/service@_@ts
var page = () => service_exports;
//#endregion
export { page };
