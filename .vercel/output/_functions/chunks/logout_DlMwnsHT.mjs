import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as SESSION_COOKIE_NAME } from "./admin_VvIW5NQF.mjs";
//#region src/pages/admin/api/logout.ts
var logout_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST
});
async function POST({ cookies, redirect }) {
	cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
	return redirect("/admin?message=Logged+out+successfully", 303);
}
async function GET({ cookies, redirect }) {
	cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
	return redirect("/admin?message=Logged+out+successfully", 303);
}
//#endregion
//#region \0virtual:astro:page:src/pages/admin/api/logout@_@ts
var page = () => logout_exports;
//#endregion
export { page };
