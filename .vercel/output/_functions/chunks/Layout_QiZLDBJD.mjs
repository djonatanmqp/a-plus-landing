import { T as createAstro, _ as addAttribute, c as renderSlot, d as renderTemplate, g as renderHead, h as maybeRenderHead, i as renderComponent, v as createRenderInstruction } from "./server_BfoGfc14.mjs";
import { t as createComponent } from "./compiler_DytdtreD.mjs";
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/components/ZoomModal.astro
var $$ZoomModal = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<dialog id="zoom-dialog" class="fixed inset-0 m-0 h-full w-full max-w-none bg-transparent p-0 border-none outline-none z-9999" data-astro-cid-swetyxwi><div class="flex h-full w-full items-center justify-center p-4 sm:p-10" data-astro-cid-swetyxwi><div class="relative w-fit" data-astro-cid-swetyxwi><button id="close-zoom" class="absolute -top-4 -right-4 text-white bg-black/50 hover:bg-[#0b3c5d] rounded-full w-10 h-10 flex items-center justify-center text-2xl z-100 shadow-lg transition-all" aria-label="Close zoom" data-astro-cid-swetyxwi>&times;</button><img id="zoom-img" src="" alt="Full view" class="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" data-astro-cid-swetyxwi></div></div></dialog>${renderScript($$result, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/ZoomModal.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/ZoomModal.astro", void 0);
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title, description } = Astro.props;
	new URL(Astro.request.url).origin;
	const currentUrl = new URL(Astro.request.url).href;
	const metaDescription = description ?? "A-Plus Pavers & Grass LLC delivers premium driveway pavers, patios, walkways, artificial turf and sod installation across Orlando, FL.";
	return renderTemplate`<html lang="en" class="scroll-smooth"><head><meta charset="UTF-8"><meta name="description"${addAttribute(metaDescription, "content")}><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#0b3c5d"><link rel="icon" type="image/png" href="/favicon.png"><link rel="canonical"${addAttribute(currentUrl, "href")}><title>${title}</title><!-- Assinatura Técnica (Meta Tags) --><meta name="author" content="Djonatan M. Q. Piehowiak - Full Stack Developer &amp; UX/UI Designer"><meta name="designer" content="Djonatan M. Q. Piehowiak"><meta name="reply-to" content="djonatan.piehowiak@gmail.com"><!-- Comentário direto no HTML (Aparece ao "Exibir código fonte da página") --><!-- 
        	DESIGN & DEVELOPMENT BY:
        	- Name: Djonatan M. Q. Piehowiak
        	- Role: Web Developer & UX/UI Designer
        	- Contact: djonatan.piehowiak@gmail.com
    	--><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(metaDescription, "content")}><meta property="og:url"${addAttribute(currentUrl, "content")}><meta property="og:site_name" content="A-Plus Pavers &amp; Grass LLC"><meta property="og:image" content="/logo.png"><meta property="twitter:card" content="summary_large_image"><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(metaDescription, "content")}><meta property="twitter:image" content="/logo.png"><meta name="robots" content="index, follow"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet"><script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "LocalBusiness",
			"name": "A-Plus Pavers & Grass LLC",
			"image": [
				"/logo.png"
			],
			"@id": currentUrl,
			"url": currentUrl,
			"telephone": "(407) 123-4567",
			"email": "info@apluspaversgrass.com",
			"address": {
				"@type": "PostalAddress",
				"streetAddress": "Orlando Service Area",
				"addressLocality": "Orlando",
				"addressRegion": "FL",
				"postalCode": "32801",
				"addressCountry": "US"
			},
			"geo": {
				"@type": "GeoCoordinates",
				"latitude": 28.538336,
				"longitude": -81.379234
			},
			"areaServed": {
				"@type": "GeoCircle",
				"geoMidpoint": {
					"@type": "GeoCoordinates",
					"latitude": 28.538336,
					"longitude": -81.379234
				},
				"geoRadius": 50
			},
			"openingHoursSpecification": [
				{
					"@type": "OpeningHoursSpecification",
					"dayOfWeek": [
						"Monday",
						"Tuesday",
						"Wednesday",
						"Thursday",
						"Friday"
					],
					"opens": "08:00",
					"closes": "18:00"
				},
				{
					"@type": "OpeningHoursSpecification",
					"dayOfWeek": ["Saturday"],
					"opens": "09:00",
					"closes": "16:00"
				}
			],
			"sameAs": []
		})}
		<\/script>${renderHead($$result)}</head><body class="bg-gray-50 text-gray-800 font-['Montserrat',sans-serif] antialiased">${renderSlot($$result, $$slots["default"])}${renderComponent($$result, "ZoomModal", $$ZoomModal, {})}<script src="/src/scripts/zoom.js" type="module"><\/script></body></html>`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/layouts/Layout.astro", void 0);
//#endregion
export { $$ZoomModal as n, renderScript as r, $$Layout as t };
