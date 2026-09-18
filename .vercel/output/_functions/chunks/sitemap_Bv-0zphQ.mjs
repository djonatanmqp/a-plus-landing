import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/pages/sitemap.xml.ts
var sitemap_xml_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
async function GET({ request }) {
	const baseUrl = process.env.SITE_URL || new URL(request.url).origin;
	let servicesData = [];
	try {
		const { data, error } = await supabase.from("services").select("id");
		if (error) throw error;
		if (data) servicesData = data;
	} catch (error) {
		console.error("Erro ao carregar serviços do Supabase para o sitemap:", error);
	}
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
		`${baseUrl}/`,
		`${baseUrl}/services`,
		...servicesData.filter((service) => service && service.id).map((service) => `${baseUrl}/services/${service.id}`)
	].map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${loc === `${baseUrl}/` ? "1.0" : "0.8"}</priority>\n  </url>`).join("\n")}
</urlset>`;
	return new Response(xml, { headers: { "Content-Type": "application/xml;charset=UTF-8" } });
}
//#endregion
//#region \0virtual:astro:page:src/pages/sitemap.xml@_@ts
var page = () => sitemap_xml_exports;
//#endregion
export { page };
