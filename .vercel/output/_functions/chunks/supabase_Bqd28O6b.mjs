import { createClient } from "@supabase/supabase-js";
var supabase = createClient("https://viapfzzkfniawogmmdny.supabase.co", "sb_secret_ngCxdpcSJlbAmbWz94uzPg_TqHF_StY", { auth: {
	flowType: "pkce",
	persistSession: true,
	autoRefreshToken: true,
	storage: typeof window !== "undefined" ? window.sessionStorage : void 0
} });
if (typeof window !== "undefined") window.addEventListener("pagehide", () => {
	const keysToRemove = [];
	for (let i = 0; i < window.sessionStorage.length; i++) {
		const key = window.sessionStorage.key(i);
		if (key && key.includes("supabase.auth.token")) keysToRemove.push(key);
	}
	keysToRemove.forEach((k) => window.sessionStorage.removeItem(k));
});
//#endregion
export { supabase as t };
