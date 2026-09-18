import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as isLoginAllowed, i as isAdminEmail, n as createAdminToken, r as getLoginAttemptInfo, s as recordLoginAttempt, t as SESSION_COOKIE_NAME } from "./admin_VvIW5NQF.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/pages/admin/api/login.ts
var login_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
async function POST({ request, cookies, redirect }) {
	try {
		const formData = await request.formData();
		const email = formData.get("username")?.toString().trim();
		const password = formData.get("password")?.toString();
		if (!email || !password) return redirect(`/admin?message=${encodeURIComponent("Error: Email and password are required")}`, 303);
		const rateLimitKey = `${request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"}:${email.toLowerCase()}`;
		if (!isLoginAllowed(rateLimitKey)) {
			const { remainingSeconds } = getLoginAttemptInfo(rateLimitKey);
			return redirect(`/admin?message=${encodeURIComponent(`Error: Too many login attempts. Try again in ${remainingSeconds}s.`)}`, 303);
		}
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (error || !data.user || !data.user.email) {
			console.error("Supabase Auth error:", error);
			recordLoginAttempt(rateLimitKey, false);
			return redirect(`/admin?message=${encodeURIComponent("Error: Invalid email or password.")}`, 303);
		}
		const userEmail = data.user.email.toLowerCase();
		if (!isAdminEmail(userEmail)) {
			console.error("Unauthorized admin login attempt:", userEmail);
			recordLoginAttempt(rateLimitKey, false);
			return redirect(`/admin?message=${encodeURIComponent("Error: This account is not authorized to access the admin panel.")}`, 303);
		}
		recordLoginAttempt(rateLimitKey, true);
		const token = createAdminToken(userEmail);
		cookies.set(SESSION_COOKIE_NAME, token, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax"
		});
		return redirect("/admin?message=Login+successful", 303);
	} catch (error) {
		console.error("Login processing error:", error);
		return redirect(`/admin?message=${encodeURIComponent("Error: Internal server error.")}`, 303);
	}
}
//#endregion
//#region \0virtual:astro:page:src/pages/admin/api/login@_@ts
var page = () => login_exports;
//#endregion
export { page };
