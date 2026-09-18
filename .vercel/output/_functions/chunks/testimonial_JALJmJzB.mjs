import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { c as validateAdminToken, o as parseCookies } from "./admin_VvIW5NQF.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/pages/admin/api/testimonial.ts
var testimonial_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var MAX_FILE_SIZE = 5242880;
var ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp"
];
var POST = async ({ request, cookies, redirect }) => {
	const token = cookies.get("a_plus_admin_session")?.value || parseCookies(request.headers.get("cookie"))["a_plus_admin_session"];
	if (!validateAdminToken(token)) return redirect("/admin?message=Authentication+required", 303);
	try {
		const formData = await request.formData();
		const action = formData.get("action")?.toString();
		const idInput = (formData.get("id") ?? "").toString().trim();
		if (action === "delete" && idInput) {
			const { error: deleteError } = await supabase.from("testimonials").delete().eq("id", idInput);
			if (deleteError) throw new Error(deleteError.message);
			return redirect("/admin?tab=testimonial&message=Testimonial+deleted+successfully", 303);
		}
		const service_id = (formData.get("service_id") ?? "").toString().trim();
		const name = (formData.get("name") ?? "").toString().trim();
		const location = (formData.get("location") ?? "").toString().trim();
		const date = (formData.get("date") ?? "").toString().trim();
		const rating = parseInt((formData.get("rating") ?? "5").toString(), 10);
		const content = (formData.get("content") ?? "").toString().trim();
		if (!name || !service_id || !content || !location || !date) return redirect("/admin?tab=testimonial&message=Fill+in+all+required+fields", 303);
		const beforeFile = formData.get("before_image_file");
		const afterFile = formData.get("after_image_file");
		const testimonialId = idInput || `testimonial-${Date.now()}`;
		const uploadImageToSupabase = async (file, type) => {
			if (!ALLOWED_MIME_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) throw new Error(`Invalid ${type} image type or size exceeded (max 5MB)`);
			const sanitizedName = file.name.replace(/\s+/g, "-");
			const fileName = `testimonials/${testimonialId}/${type}-${sanitizedName}`;
			const { data: uploadData, error: uploadError } = await supabase.storage.from("images").upload(fileName, file, {
				cacheControl: "3600",
				upsert: true
			});
			if (uploadError) throw new Error(uploadError.message);
			const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(uploadData.path);
			return `${publicUrlData.publicUrl}?t=${Date.now()}`;
		};
		let beforeImagePath;
		let afterImagePath;
		if (beforeFile && beforeFile instanceof File && beforeFile.size > 0) beforeImagePath = await uploadImageToSupabase(beforeFile, "before");
		if (afterFile && afterFile instanceof File && afterFile.size > 0) afterImagePath = await uploadImageToSupabase(afterFile, "after");
		const testimonialData = {
			id: testimonialId,
			service_id,
			name,
			location,
			date,
			rating,
			content,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (beforeImagePath) testimonialData.before_image = beforeImagePath;
		if (afterImagePath) testimonialData.after_image = afterImagePath;
		if (idInput) {
			const { data: existing } = await supabase.from("testimonials").select("before_image, after_image").eq("id", idInput).single();
			const existingData = existing || {};
			if (!beforeImagePath && existingData.before_image) testimonialData.before_image = existingData.before_image;
			if (!afterImagePath && existingData.after_image) testimonialData.after_image = existingData.after_image;
		}
		const { error: upsertError } = await supabase.from("testimonials").upsert(testimonialData);
		if (upsertError) throw new Error(upsertError.message);
		return redirect(`/admin?tab=testimonial&message=${idInput ? "Testimonial+updated+successfully!" : "Testimonial+added+successfully!"}`, 303);
	} catch (error) {
		console.error("Error saving testimonial:", error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		return redirect(`/admin?tab=testimonial&message=${encodeURIComponent("Error: " + errorMessage)}`, 303);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/admin/api/testimonial@_@ts
var page = () => testimonial_exports;
//#endregion
export { page };
