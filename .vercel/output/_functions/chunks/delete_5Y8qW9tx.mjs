import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { c as validateAdminToken, t as SESSION_COOKIE_NAME } from "./admin_VvIW5NQF.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/pages/admin/api/testimonials/delete.ts
var delete_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies, redirect }) => {
	const token = cookies.get(SESSION_COOKIE_NAME)?.value;
	if (!validateAdminToken(token)) return redirect("/admin?message=Unauthorized", 303);
	try {
		const id = (await request.formData()).get("id")?.toString();
		if (!id) return redirect("/admin?tab=testimonials&message=Invalid+ID", 303);
		const { error: deleteError } = await supabase.from("testimonials").delete().eq("id", id);
		if (deleteError) throw new Error(deleteError.message);
		return redirect("/admin?tab=testimonials&message=Testimonial+deleted+successfully!", 303);
	} catch (error) {
		console.error("Error deleting testimonial:", error);
		return redirect(`/admin?tab=testimonials&message=${encodeURIComponent("Error deleting testimonial: " + error.message)}`, 303);
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/admin/api/testimonials/delete@_@ts
var page = () => delete_exports;
//#endregion
export { page };
