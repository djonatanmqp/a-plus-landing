import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { c as validateAdminToken, t as SESSION_COOKIE_NAME } from "./admin_VvIW5NQF.mjs";
import { a as supabaseAdmin } from "./supabase-admin_CcYaQhU7.mjs";
//#region src/pages/admin/api/gallery/delete.ts
var delete_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies, redirect }) => {
	const token = cookies.get(SESSION_COOKIE_NAME)?.value;
	if (!validateAdminToken(token)) return redirect("/admin?message=Unauthorized", 303);
	try {
		const formData = await request.formData();
		const serviceId = formData.get("serviceId")?.toString();
		const imageUrl = formData.get("imageUrl")?.toString();
		if (!serviceId || !imageUrl) return redirect("/admin?tab=galleries&message=Missing+required+fields", 303);
		const { data: service, error: fetchError } = await supabaseAdmin.from("services").select("images").eq("id", serviceId).single();
		if (fetchError) throw new Error(fetchError.message);
		if (service) {
			const updatedGallery = (service.images || []).filter((url) => url !== imageUrl);
			const { error: updateError } = await supabaseAdmin.from("services").update({
				images: updatedGallery,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", serviceId);
			if (updateError) throw new Error(updateError.message);
			try {
				const pathParts = new URL(imageUrl).pathname.split("/public/images/");
				if (pathParts.length > 1) {
					const filePath = pathParts[1];
					const { error: storageError } = await supabaseAdmin.storage.from("images").remove([filePath]);
					if (storageError) console.error("Warning: Could not delete file from storage:", storageError.message);
				}
			} catch (storageErr) {
				console.error("Error parsing image URL for deletion:", storageErr);
			}
		}
		return redirect("/admin?tab=galleries&message=Image+deleted+successfully", 303);
	} catch (error) {
		console.error("Error deleting gallery image:", error);
		return redirect(`/admin?tab=galleries&message=${encodeURIComponent("Error deleting image: " + error.message)}`, 303);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/admin/api/gallery/delete@_@ts
var page = () => delete_exports;
//#endregion
export { page };
