import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as isAdminEmail, n as createAdminToken, t as SESSION_COOKIE_NAME } from "./admin_VvIW5NQF.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/pages/admin/api/auth-callback.ts
var auth_callback_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
async function GET({ request, cookies, redirect }) {
	const code = new URL(request.url).searchParams.get("code");
	if (code) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error && data.user?.email) {
			const userEmail = data.user.email.toLowerCase();
			if (isAdminEmail(userEmail)) {
				const token = createAdminToken(userEmail);
				cookies.set(SESSION_COOKIE_NAME, token, {
					path: "/",
					httpOnly: true,
					secure: true,
					sameSite: "lax"
				});
				return redirect("/admin", 303);
			} else return redirect("/admin?message=" + encodeURIComponent("Error: Email not authorized"), 303);
		}
	}
	return redirect("/admin?message=" + encodeURIComponent("Error: Google authentication failed"), 303);
}
//#endregion
//#region \0virtual:astro:page:src/pages/admin/api/auth-callback@_@ts
var page = () => auth_callback_exports;
//#endregion
export { page };
