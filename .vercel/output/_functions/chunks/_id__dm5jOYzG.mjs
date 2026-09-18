import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { T as createAstro, _ as addAttribute, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_BfoGfc14.mjs";
import { t as createComponent } from "./compiler_DytdtreD.mjs";
import { n as $$ZoomModal, r as renderScript, t as $$Layout } from "./Layout_QiZLDBJD.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
import { n as $$Header, t as $$Footer } from "./Footer_DVMQSWxK.mjs";
import { n as $$Phone, r as $$FAQ, t as $$Video } from "./video_BoQByuY_.mjs";
import { n as getServicesData, t as getServiceImageUrl } from "./services_BjV8KkQY.mjs";
//#region src/pages/services/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	url: () => $$url
});
createAstro("https://astro.build");
async function getStaticPaths() {
	const { data: services } = await supabase.from("services").select("id");
	return (services || []).map((s) => ({ params: { id: s.id } }));
}
var $$Id = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const { id } = Astro.params;
	const servicesData = await getServicesData();
	const { data: settings } = await supabase.from("settings").select("*").eq("id", "company").single();
	const company = settings || {
		name: "A-Plus Pavers & Grass",
		address: {
			serviceArea: "Orlando",
			full: "",
			city: "Orlando",
			state: "FL"
		},
		contact: {
			phone: "",
			phoneRaw: "",
			facetime: "",
			email: ""
		}
	};
	const service = servicesData.find((item) => item.id === id);
	if (!service) throw new Error(`Service not found: ${id}`);
	const s = service;
	const serviceSubtitle = s.subtitle || s.tagline || "";
	const fullDescription = s.description || s.full_description || s.details || "";
	const bulletItems = Array.isArray(s.highlights) ? s.highlights : Array.isArray(s.features) ? s.features : [];
	const galleryImages = Array.isArray(s.images) ? s.images : Array.isArray(s.gallery_images) ? s.gallery_images : [];
	const heroOrCover = s.hero_image || s.cover_image || (galleryImages.length > 0 ? galleryImages[0] : null) ? getServiceImageUrl(s, s.hero_image ? "hero" : "cover") : null;
	const getPublicUrl = (imagePath) => {
		if (!imagePath) return "";
		if (imagePath.startsWith("http")) return imagePath;
		const { data } = supabase.storage.from("services").getPublicUrl(imagePath);
		return data?.publicUrl || "";
	};
	const pageTitle = `${s.title} | ${company.address?.serviceArea || "Orlando"} | ${company.name}`;
	const pageDescription = `${s.short_description || s.subtitle || ""} Learn how ${company.name} delivers quality installation for homes in ${company.address?.serviceArea || "Orlando"}.`;
	const breadcrumbData = [
		{
			label: "Home",
			href: "/"
		},
		{
			label: "Services",
			href: "/services"
		},
		{
			label: s.title,
			current: true
		}
	];
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": pageTitle,
		"description": pageDescription,
		"data-astro-cid-3ofntftn": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {
		"headerTitle": s.title,
		"headerSubtitle": serviceSubtitle,
		"breadcrumb": breadcrumbData,
		"isHome": false,
		"showServicesLinks": false,
		"data-astro-cid-3ofntftn": true
	})}${maybeRenderHead($$result)}<main class="max-w-6xl mx-auto px-4 py-8" data-astro-cid-3ofntftn><section class="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100 mb-10" data-astro-cid-3ofntftn><div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start" data-astro-cid-3ofntftn><div data-astro-cid-3ofntftn><p class="text-sm uppercase tracking-widest text-[#328cc1] font-bold" data-astro-cid-3ofntftn>${s.title}</p><h1 class="mt-3 text-3xl sm:text-4xl font-extrabold text-[#0b3c5d] leading-tight" data-astro-cid-3ofntftn>${s.title} in ${company.address?.serviceArea || "Orlando"}</h1><div class="mt-4 text-gray-600 leading-relaxed text-base sm:text-lg whitespace-pre-line space-y-4" data-astro-cid-3ofntftn>${fullDescription}</div>${bulletItems.length > 0 && renderTemplate`<div class="mt-6 rounded-2xl bg-slate-50 p-5 border border-slate-200" data-astro-cid-3ofntftn><h3 class="text-sm uppercase font-bold text-[#0b3c5d] mb-3 tracking-wide" data-astro-cid-3ofntftn>Key Features & Highlights</h3><ul class="grid gap-2 sm:grid-cols-2 text-sm text-gray-700" data-astro-cid-3ofntftn>${bulletItems.map((point) => renderTemplate`<li class="flex items-start gap-2" data-astro-cid-3ofntftn><span class="text-[#328cc1] font-bold select-none" data-astro-cid-3ofntftn>•</span><span data-astro-cid-3ofntftn>${point}</span></li>`)}</ul></div>`}<div class="mt-8 grid gap-4 sm:grid-cols-2" data-astro-cid-3ofntftn><a${addAttribute(`tel:${company.contact?.phoneRaw}`, "href")} class="inline-flex items-center justify-center gap-3 rounded-full bg-[#0b3c5d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2570a2]" data-astro-cid-3ofntftn>${renderComponent($$result, "Phone", $$Phone, {
		"class": "w-5 h-5 text-gray-400",
		"data-astro-cid-3ofntftn": true
	})} Call now</a><a${addAttribute(`facetime:${company.contact?.facetime}`, "href")} class="inline-flex items-center justify-center gap-3 rounded-full border border-[#328cc1] bg-white px-5 py-3 text-sm font-semibold text-[#328cc1] transition hover:bg-[#ebf4ff]" data-astro-cid-3ofntftn>${renderComponent($$result, "Video", $$Video, {
		"class": "w-5 h-5 text-gray-400",
		"data-astro-cid-3ofntftn": true
	})} FaceTime</a></div></div><div class="rounded-3xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video w-full lg:aspect-auto lg:h-full lg:min-h-80" data-astro-cid-3ofntftn>${heroOrCover ? renderTemplate`<img${addAttribute(heroOrCover, "src")}${addAttribute(`${s.title} main image`, "alt")} class="js-zoom-trigger h-full w-full object-cover cursor-zoom-in" loading="lazy" data-astro-cid-3ofntftn>` : renderTemplate`<div class="flex w-full h-full items-center justify-center bg-[#eef6ff]" data-astro-cid-3ofntftn>📷</div>`}</div></div></section><section class="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100 mb-10" data-astro-cid-3ofntftn><h2 class="text-3xl font-extrabold text-[#0b3c5d] mb-4" data-astro-cid-3ofntftn>Project Gallery</h2>${galleryImages.length > 0 ? renderTemplate`<div data-astro-cid-3ofntftn><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-astro-cid-3ofntftn>${galleryImages.map((image, index) => {
		if (index >= 6) return null;
		const imageUrl = getPublicUrl(image);
		return renderTemplate`<figure class="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 aspect-video cursor-zoom-in hover:scale-[1.02] transition" data-astro-cid-3ofntftn><img${addAttribute(imageUrl, "src")}${addAttribute(s.title, "alt")} class="js-zoom-trigger h-full w-full object-cover"${addAttribute(`this.onerror=null; this.src='https://placehold.co/800x600?text=${encodeURIComponent(s.title)}';`, "onerror")} data-astro-cid-3ofntftn></figure>`;
	})}</div>${galleryImages.length > 6 && renderTemplate`<div class="mt-8 text-center" data-astro-cid-3ofntftn><button id="open-gallery-modal" class="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0b3c5d] bg-white px-6 py-3 text-sm font-bold text-[#0b3c5d] hover:bg-[#0b3c5d] hover:text-white transition" data-astro-cid-3ofntftn>View All Photos (+${galleryImages.length - 6})</button></div>`}</div>` : renderTemplate`<p class="text-gray-500" data-astro-cid-3ofntftn>Gallery coming soon</p>`}</section>${renderComponent($$result, "FAQ", $$FAQ, {
		"serviceId": s.id,
		"data-astro-cid-3ofntftn": true
	})}</main><div id="gallery-modal" class="fixed inset-0 z-40 hidden items-center justify-center bg-black/70 p-4 backdrop-blur-sm" data-astro-cid-3ofntftn><div class="relative w-full max-w-5xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl flex flex-col max-h-[90vh]" data-astro-cid-3ofntftn><div class="flex items-center justify-between border-b pb-4 mb-6" data-astro-cid-3ofntftn><h3 class="text-2xl font-extrabold text-[#0b3c5d]" data-astro-cid-3ofntftn>${s.title} — Full Gallery</h3><button id="close-gallery-modal" class="text-3xl text-gray-500 hover:text-black" data-astro-cid-3ofntftn>✕</button></div><div class="overflow-y-auto pr-2 grid gap-4 grid-cols-2 md:grid-cols-3 flex-1 fn-custom-scrollbar" data-astro-cid-3ofntftn>${galleryImages.map((image) => {
		const imageUrl = getPublicUrl(image);
		return renderTemplate`<figure class="aspect-video rounded-2xl overflow-hidden border border-gray-200 cursor-zoom-in" data-astro-cid-3ofntftn><img${addAttribute(imageUrl, "src")} class="js-zoom-trigger w-full h-full object-cover"${addAttribute(`this.onerror=null; this.src='https://placehold.co/800x600?text=${encodeURIComponent(s.title)}';`, "onerror")} data-astro-cid-3ofntftn></figure>`;
	})}</div></div></div>${renderComponent($$result, "ZoomModal", $$ZoomModal, { "data-astro-cid-3ofntftn": true })}${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-3ofntftn": true })}` })}${renderScript($$result, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/pages/services/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/pages/services/[id].astro", void 0);
var $$file = "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/pages/services/[id].astro";
var $$url = "/services/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/services/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
