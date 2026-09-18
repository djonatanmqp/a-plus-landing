import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { c as validateAdminToken, t as SESSION_COOKIE_NAME } from "./admin_VvIW5NQF.mjs";
import { a as supabaseAdmin } from "./supabase-admin_CcYaQhU7.mjs";
import { t as validateImage } from "./image-optimizer_CqLGBnyO.mjs";
//#region src/pages/admin/api/gallery.ts
var gallery_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies, redirect }) => {
	const token = cookies.get(SESSION_COOKIE_NAME)?.value;
	if (!validateAdminToken(token)) return redirect("/admin?message=Unauthorized", 303);
	const formData = await request.formData();
	const serviceId = formData.get("service_id")?.toString() || formData.get("serviceId")?.toString();
	if (!serviceId) return redirect("/admin?tab=galleries&message=Please+select+a+service", 303);
	const validFiles = formData.getAll("gallery_images").filter((file) => file && file instanceof File && file.size > 0);
	if (validFiles.length === 0) return redirect(`/admin?tab=galleries&service_id=${serviceId}&message=Error:+No+images+selected`, 303);
	for (const file of validFiles) if (!validateImage(file)) return redirect(`/admin?tab=galleries&service_id=${serviceId}&message=Error:+Invalid+image+format`, 303);
	try {
		const { data: service, error: fetchError } = await supabaseAdmin.from("services").select("images").eq("id", serviceId).single();
		if (fetchError) throw fetchError;
		const currentGallery = service?.images || [];
		const uploadedImageUrls = [];
		for (const file of validFiles) {
			const filePath = `gallery/${serviceId}/${file.name.replace(/\s+/g, "-")}`;
			const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from("images").upload(filePath, file, {
				cacheControl: "3600",
				upsert: true
			});
			if (uploadError) throw uploadError;
			const { data: publicUrlData } = supabaseAdmin.storage.from("images").getPublicUrl(uploadData.path);
			const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
			if (!uploadedImageUrls.includes(publicUrl)) uploadedImageUrls.push(publicUrl);
		}
		const combinedGallery = Array.from(/* @__PURE__ */ new Set([...currentGallery, ...uploadedImageUrls]));
		const { error: updateError } = await supabaseAdmin.from("services").update({
			images: combinedGallery,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", serviceId);
		if (updateError) throw updateError;
		return redirect(`/admin?tab=galleries&service_id=${serviceId}&message=Gallery+updated+successfully`, 303);
	} catch (error) {
		console.error("Error uploading gallery images:", error);
		return redirect(`/admin?tab=galleries&service_id=${serviceId}&message=${encodeURIComponent("Error: " + error.message)}`, 303);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/admin/api/gallery@_@ts
var page = () => gallery_exports;
//#endregion
export { page };
