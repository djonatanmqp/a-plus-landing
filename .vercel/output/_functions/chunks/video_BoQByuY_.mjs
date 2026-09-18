import { T as createAstro, d as renderTemplate, h as maybeRenderHead, t as spreadAttributes } from "./server_BfoGfc14.mjs";
import { t as createComponent } from "./compiler_DytdtreD.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/components/FAQ.astro
createAstro("https://astro.build");
var $$FAQ = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FAQ;
	const { serviceId = "global" } = Astro.props;
	let query = supabase.from("faqs").select("*");
	if (serviceId === "global") query = query.is("service_id", null);
	else query = query.eq("service_id", serviceId);
	const { data: faqData = [] } = await query;
	return renderTemplate`${maybeRenderHead($$result)}<section id="faq" class="max-w-6xl mx-auto px-4 py-2"><div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100"><h2 class="text-3xl font-extrabold text-[#0b3c5d] mb-4">Frequently Asked Questions</h2><p class="text-sm text-gray-600 mb-8">Answers to the most common questions from homeowners.</p>${faqData && faqData.length > 0 ? renderTemplate`<div class="space-y-6">${faqData.map((item) => renderTemplate`<article class="border-b border-gray-50 pb-4 last:border-none last:pb-0"><h3 class="text-lg font-semibold text-[#0b3c5d] mb-2">${item.question}</h3><p class="text-gray-600 leading-relaxed">${item.answer}</p></article>`)}</div>` : renderTemplate`<p class="text-gray-500 italic">No frequently asked questions available.</p>`}</div></section>`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/FAQ.astro", void 0);
//#endregion
//#region ~icons/mdi/phone.astro
createAstro("https://astro.build");
var $$Phone = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Phone;
	const props = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)} viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"></path></svg>`;
}, "~icons/mdi/phone.astro", void 0);
//#endregion
//#region ~icons/mdi/video.astro
createAstro("https://astro.build");
var $$Video = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Video;
	const props = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)} viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z"></path></svg>`;
}, "~icons/mdi/video.astro", void 0);
//#endregion
export { $$Phone as n, $$FAQ as r, $$Video as t };
