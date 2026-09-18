import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/lib/services.ts
/**
* Retorna a URL pública da imagem do Supabase Storage ou um placeholder se não houver.
*/
function getServiceImageUrl(service, type = "hero", index = 0) {
	let imagePath = "";
	if (type === "hero") imagePath = service.hero_image || "";
	else if (type === "cover") imagePath = service.cover_image || "";
	else if (type === "gallery") imagePath = (service.images || [])[index] || "";
	if (imagePath) {
		if (imagePath.startsWith("http")) return imagePath;
		const { data } = supabase.storage.from("services").getPublicUrl(imagePath);
		if (data?.publicUrl) return data.publicUrl;
	}
	return `https://placehold.co/1200x600/0b3c5d/ffffff?text=${encodeURIComponent(`${service.title || "Service"} (${type})`)}`;
}
async function getServicesData() {
	const { data, error } = await supabase.from("services").select("*").order("display_order", { ascending: true });
	if (error) {
		console.error("Erro ao buscar serviços do Supabase:", error.message);
		return [];
	}
	return data || [];
}
//#endregion
export { getServicesData as n, getServiceImageUrl as t };
