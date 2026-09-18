import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { _ as addAttribute, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_BfoGfc14.mjs";
import { t as createComponent } from "./compiler_DytdtreD.mjs";
import { t as $$Layout } from "./Layout_QiZLDBJD.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
import { n as $$Header, t as $$Footer } from "./Footer_DVMQSWxK.mjs";
import { n as getServicesData, t as getServiceImageUrl } from "./services_BjV8KkQY.mjs";
//#region src/pages/services.astro
var services_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Services,
	file: () => $$file,
	url: () => $$url
});
var $$Services = createComponent(async ($$result, $$props, $$slots) => {
	const defaultCompany = {
		name: "A-Plus Pavers & Grass",
		description: "QUALITY PAVERS & SYNTHETIC GRASS INSTALLATION",
		contact: {
			phone: "",
			phoneRaw: "",
			facetime: "",
			email: ""
		},
		address: {
			full: "",
			serviceArea: "Orlando",
			city: "Orlando",
			state: "FL"
		},
		links: {
			googleReview: "",
			facebook: "",
			instagram: "",
			tiktok: "",
			googleMapsEmbed: ""
		}
	};
	const { data: settings } = await supabase.from("settings").select("*").eq("id", "company").single();
	const company = settings || defaultCompany;
	const servicesData = await getServicesData() || [];
	const breadcrumbData = [{
		label: "Home",
		url: "/"
	}, {
		label: "Services",
		url: "/services"
	}];
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `Our Services | ${company.name}`,
		"description": company.description
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {
		"headerTitle": "Our Services",
		"headerSubtitle": `Explore what we can do for your property in ${company.address?.serviceArea || "Orlando"}`,
		"breadcrumb": breadcrumbData,
		"isHome": false,
		"showServicesLinks": false
	})}${maybeRenderHead($$result)}<div id="services" class="max-w-6xl mx-auto px-4 py-8"><div class="grid gap-6 md:grid-cols-3">${servicesData.map((service) => {
		const cover = getServiceImageUrl(service, "cover");
		const cardDescription = service.short_description || service.subtitle || service.description;
		return renderTemplate`<article class="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"><div>${cover ? renderTemplate`<img${addAttribute(cover, "src")}${addAttribute(`${service.title} project image`, "alt")} class="h-48 w-full object-cover" loading="lazy">` : renderTemplate`<div class="flex h-48 w-full items-center justify-center bg-[#eef6ff] px-4 text-center"><div class="space-y-2"><div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe] text-[#328cc1] text-lg">📷</div><p class="text-sm font-semibold text-[#0b3c5d]">${service.title} image coming soon</p></div></div>`}<div class="p-6"><h2 class="text-xl font-bold text-[#0b3c5d] mb-3">${service.title}</h2><p class="text-gray-600 text-sm leading-relaxed mb-6">${cardDescription}</p></div></div><div class="px-6 pb-6 pt-0"><a${addAttribute(`/services/${service.id}`, "href")} class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0b3c5d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2570a2]">Learn more<span aria-hidden="true">→</span></a></div></article>`;
	})}</div></div>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/pages/services.astro", void 0);
var $$file = "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/pages/services.astro";
var $$url = "/services";
//#endregion
//#region \0virtual:astro:page:src/pages/services@_@astro
var page = () => services_exports;
//#endregion
export { page };
