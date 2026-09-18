import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as isAdminEmail, n as createAdminToken, t as SESSION_COOKIE_NAME } from "./admin_VvIW5NQF.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/pages/admin/api/set-session.ts
var set_session_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
async function POST({ request, cookies }) {
	try {
		const { accessToken } = await request.json();
		if (!accessToken) return new Response("Token required", { status: 400 });
		const { data: { user }, error } = await supabase.auth.getUser(accessToken);
		if (error || !user?.email || !isAdminEmail(user.email.toLowerCase())) return new Response("Unauthorized", { status: 403 });
		const token = createAdminToken(user.email.toLowerCase());
		cookies.set(SESSION_COOKIE_NAME, token, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax"
		});
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		return new Response("Internal Error", { status: 500 });
	}
}
//#endregion
//#region \0virtual:astro:page:src/pages/admin/api/set-session@_@ts
var page = () => set_session_exports;
//#endregion
export { page };
