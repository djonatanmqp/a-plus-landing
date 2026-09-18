import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/pages/admin/api/auth-google.ts
var auth_google_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
async function GET({ request, redirect }) {
	const redirectTo = `${new URL(request.url).origin}/admin/api/auth-callback`;
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo,
			queryParams: {
				access_type: "offline",
				prompt: "select_account"
			}
		}
	});
	if (error || !data.url) {
		console.error("Google OAuth generation error:", error);
		return redirect("/admin?message=" + encodeURIComponent("Error: Could not initialize Google login"), 303);
	}
	return redirect(data.url, 303);
}
//#endregion
//#region \0virtual:astro:page:src/pages/admin/api/auth-google@_@ts
var page = () => auth_google_exports;
//#endregion
export { page };
