import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { T as createAstro, _ as addAttribute, d as renderTemplate, g as renderHead, h as maybeRenderHead, i as renderComponent, t as spreadAttributes } from "./server_BfoGfc14.mjs";
import { t as createComponent } from "./compiler_DytdtreD.mjs";
import { r as renderScript, t as $$Layout } from "./Layout_QiZLDBJD.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/components/VCardHeader.astro
createAstro("https://astro.build");
var $$VCardHeader = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$VCardHeader;
	const { data: settings } = await supabase.from("settings").select("*").eq("id", "company").single();
	const company = settings || {};
	const { data: rawServicesData } = await supabase.from("services").select("*").order("display_order", { ascending: true });
	const servicesData = Array.isArray(rawServicesData) ? rawServicesData : [];
	const getStorageUrl = (path) => {
		if (!path) return "";
		if (path.startsWith("http") || path.startsWith("/")) return path;
		const { data } = supabase.storage.from("services").getPublicUrl(path);
		return data?.publicUrl || "";
	};
	const serviceHeros = servicesData.map((service) => {
		const rawImage = service.hero_image || service.heroImage || service.cover_image || "";
		const version = service.updated_at ? new Date(service.updated_at).getTime() : Date.now();
		const basePath = getStorageUrl(rawImage) || `/assets/services/${service.id}/${service.id}-hero.webp`;
		return `${basePath}${basePath.includes("?") ? "&" : "?"}v=${version}`;
	}).filter(Boolean);
	const { title = company?.name || "A-Plus Pavers & Grass LLC" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="relative w-full bg-transparent overflow-hidden select-none pb-0"><div class="relative w-full"><!-- 1. CARROSSEL DE FOTOS COM DIVISÃO AZUL NA BASE --><div class="relative w-full h-52 sm:h-60 overflow-hidden bg-slate-900 border-b-4 border-[#328cc1] shadow-md"><div id="vcard-carousel" class="flex w-full h-full transition-transform duration-700 ease-in-out">${serviceHeros.length > 0 ? serviceHeros.map((imgUrl, index) => renderTemplate`<div class="w-full h-full shrink-0 relative"><img${addAttribute(imgUrl, "src")}${addAttribute(`Service Hero ${index + 1}`, "alt")} class="w-full h-full object-cover"></div>`) : renderTemplate`<div class="w-full h-full relative"><img src="/assets/images/paver-pattern.webp" alt="Default Hero" class="w-full h-full object-cover"></div>`}</div><!-- Overlay para legibilidade do título --><div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div><!-- Título em Branco no Canto Inferior Direito --><div class="absolute bottom-3 right-4 z-25 text-right max-w-[70%]"><h1 class="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">${title}</h1></div><!-- Indicator Dots -->${serviceHeros.length > 1 && renderTemplate`<div class="absolute top-3 right-4 flex gap-1.5 z-25">${serviceHeros.map((_, index) => renderTemplate`<span${addAttribute(`vcard-dot w-2 h-2 rounded-full transition-all ${index === 0 ? "bg-white w-4" : "bg-white/50"}`, "class")}></span>`)}</div>`}</div><!-- 2. FAIXA DE PAVERS (sincronizada com o fundo do card) --><div class="relative w-full h-20 bg-repeat bg-top" style="background-image: url('/assets/images/paver-pattern.webp'); background-size: 240px;"></div><!-- 3. LOGO NA DIVISÃO DA LINHA AZUL COM SOMBRA PROFUNDA --><div class="max-w-md mx-auto px-4 absolute inset-0 pointer-events-none z-30"><div class="absolute top-52 sm:top-60 -translate-y-1/2 left-4 w-28 sm:w-32"><a href="/" aria-label="Go to homepage" class="inline-block pointer-events-auto"><img src="/assets/images/logo.webp"${addAttribute(`${title} Logo`, "alt")} width="128" height="128" class="w-full h-auto drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)] transition-transform duration-300 hover:scale-105"></a></div></div></div></div>${renderScript($$result, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/VCardHeader.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/VCardHeader.astro", void 0);
//#endregion
//#region ~icons/mdi/download.astro
createAstro("https://astro.build");
var $$Download = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Download;
	const props = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)} viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7z"></path></svg>`;
}, "~icons/mdi/download.astro", void 0);
//#endregion
//#region src/pages/card.astro
var card_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Card,
	file: () => $$file,
	url: () => $$url
});
var $$Card = createComponent(async ($$result, $$props, $$slots) => {
	const defaultCompany = {
		name: "A-Plus Pavers & Grass LLC",
		contact: {
			phone: "(321) 496-3060",
			phoneRaw: "3214963060",
			facetime: "3214963060",
			email: "contact@apluspaversgrass.com",
			whatsapp: "13214963060"
		},
		address: {
			full: "2459 Cheney Hwy, Titusville, FL 32780",
			serviceArea: "Central Florida and nearby cities"
		},
		links: {
			facebook: "#",
			instagram: "#",
			googleReview: "#",
			googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7008.868573171923!2d-80.831329!3d28.556719!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e74df4e89827c7%3A0x62929890360ad056!2sA-Plus%20Pavers%20%26%20Grass%20LLC!5e0!3m2!1spt-BR!2sbr!4v1786839260310!5m2!1spt-BR!2sbr"
		}
	};
	const { data: settings } = await supabase.from("settings").select("*").eq("id", "company").single();
	const company = settings || defaultCompany;
	const phoneRaw = company?.contact?.phoneRaw || company?.phone || defaultCompany.contact.phoneRaw;
	const whatsapp = company?.contact?.whatsapp || company?.whatsapp || defaultCompany.contact.whatsapp;
	const email = company?.contact?.email || company?.email || defaultCompany.contact.email;
	const facetime = company?.contact?.facetime || phoneRaw;
	const serviceAreaText = company?.address?.serviceArea || defaultCompany.address.serviceArea;
	company?.address?.full || company?.address || defaultCompany.address.full;
	const customMapEmbed = company?.links?.googleMapsEmbed || company?.googleMapsEmbed;
	const instagram = company?.links?.instagram || company?.instagram || "#";
	const facebook = company?.links?.facebook || company?.facebook || "#";
	const quickActions = [
		{
			label: "Call",
			href: `tel:${phoneRaw}`,
			iconBg: "bg-[#0b3c5d]",
			icon: "phone"
		},
		{
			label: "SMS",
			href: `sms:${phoneRaw}`,
			iconBg: "bg-[#0b3c5d]",
			icon: "sms"
		},
		{
			label: "FaceTime",
			href: `facetime:${facetime}`,
			iconBg: "bg-[#10b981]",
			icon: "video"
		},
		{
			label: "Email",
			href: `mailto:${email}`,
			iconBg: "bg-[#0b3c5d]",
			icon: "email"
		},
		{
			label: "Website",
			href: "/",
			iconBg: "bg-[#2563eb]",
			icon: "web"
		},
		{
			label: "Instagram",
			href: instagram,
			iconBg: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600",
			icon: "instagram",
			target: "_blank"
		},
		{
			label: "Facebook",
			href: facebook,
			iconBg: "bg-[#1877F2]",
			icon: "facebook",
			target: "_blank"
		},
		{
			label: "WhatsApp",
			href: `https://wa.me/${whatsapp}`,
			iconBg: "bg-[#25D366]",
			icon: "whatsapp",
			target: "_blank"
		}
	];
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Quick Contact | A-Plus Pavers & Grass LLC",
		"description": "PROFESSIONAL PAVER, TURF & SOD INSTALLATION IN CENTRAL FLORIDA AND NEARBY CITIES"
	}, { "default": ($$result) => renderTemplate`<head><meta name="robots" content="noindex, follow">${renderHead($$result)}</head><div class="min-h-screen w-full pb-32 bg-repeat bg-top relative" style="background-image: url('/paver-pattern.png'); background-size: 240px;"><!-- Topo / Header Visual --><div class="drop-shadow-2xl">${renderComponent($$result, "VCardHeader", $$VCardHeader, { "title": company?.name || defaultCompany.name })}</div><!-- Conteúdo principal com gap uniforme entre os elementos --><main class="max-w-md mx-auto px-4 relative z-20 space-y-6 pt-4"><!-- 1. CARD DE 8 ÍCONES (4x2) com margem superior adequada e sombra robusta --><div class="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100/80"><div class="grid grid-cols-4 gap-y-5 gap-x-2 text-center">${quickActions.map((action) => renderTemplate`<a${addAttribute(action.href, "href")}${addAttribute(action.target || "_self", "target")} rel="noopener noreferrer"${addAttribute(action.label, "aria-label")} class="flex flex-col items-center gap-1.5 group"><div${addAttribute(`w-12 h-12 rounded-full ${action.iconBg} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-all active:scale-95`, "class")}>${action.icon === "phone" && renderTemplate`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>`}${action.icon === "sms" && renderTemplate`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>`}${action.icon === "video" && renderTemplate`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`}${action.icon === "email" && renderTemplate`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`}${action.icon === "web" && renderTemplate`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>`}${action.icon === "instagram" && renderTemplate`<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>`}${action.icon === "facebook" && renderTemplate`<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>`}${action.icon === "whatsapp" && renderTemplate`<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"></path></svg>`}</div><span class="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">${action.label}</span></a>`)}</div></div><!-- 2. CARD SERVICE AREA + GOOGLE MAPS com espaçamento uniforme --><div class="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100/80 space-y-4"><!-- Caixa de Service Area --><div class="flex flex-col items-center justify-center gap-1 bg-slate-50 py-3 px-4 rounded-2xl border border-slate-100 text-center shadow-inner"><span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">📍 SERVICE AREA</span><span class="text-xs font-black text-slate-800 uppercase tracking-wide">${serviceAreaText}</span></div><!-- Google Maps --><div class="w-full h-48 rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">${customMapEmbed ? renderTemplate`<iframe width="100%" height="100%" style="border:0;" loading="lazy" allowfullscreen=""${addAttribute(customMapEmbed, "src")} referrerpolicy="no-referrer-when-downgrade"></iframe>` : renderTemplate`<div class="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">Map not available</div>`}</div></div></main><!-- Botão Fixo Inferior --><div class="fixed bottom-4 inset-x-0 z-50 px-4 max-w-md mx-auto pointer-events-none"><div class="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-slate-200 pointer-events-auto"><a href="/api/vcard.vcf" download="A-Plus-Pavers.vcf" class="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 bg-[#328cc1] hover:bg-[#2873a0] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg transition-all text-sm uppercase tracking-wider text-center">${renderComponent($$result, "DownloadIcon", $$Download, { "class": "w-5 h-5" })}<span>Save Contact to Phone</span></a></div></div></div>` })}`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/pages/card.astro", void 0);
var $$file = "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/pages/card.astro";
var $$url = "/card";
//#endregion
//#region \0virtual:astro:page:src/pages/card@_@astro
var page = () => card_exports;
//#endregion
export { page };
