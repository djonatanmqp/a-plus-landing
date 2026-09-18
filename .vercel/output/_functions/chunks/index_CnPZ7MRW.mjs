import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { C as unescapeHTML, T as createAstro, _ as addAttribute, c as renderSlot, d as renderTemplate, h as maybeRenderHead, i as renderComponent, t as spreadAttributes } from "./server_BfoGfc14.mjs";
import { t as createComponent } from "./compiler_DytdtreD.mjs";
import { n as $$ZoomModal, r as renderScript, t as $$Layout } from "./Layout_QiZLDBJD.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
import { n as $$Header, t as $$Footer } from "./Footer_DVMQSWxK.mjs";
import { n as $$Phone, r as $$FAQ, t as $$Video } from "./video_BoQByuY_.mjs";
//#region src/components/Hero.astro
var $$Hero = createComponent(async ($$result, $$props, $$slots) => {
	const getHeroImageUrl = (service) => {
		const path = service.cover_image || service.hero_image || "";
		if (!path) return "";
		if (path.startsWith("http")) {
			if (path.includes("supabase.co/storage")) return `${path}${path.includes("?") ? "&" : "?"}width=1200&quality=85`;
			return path;
		}
		const { data } = supabase.storage.from("services").getPublicUrl(path, { transform: {
			width: 1200,
			quality: 85
		} });
		return data?.publicUrl || "";
	};
	const { data: rawServicesData } = await supabase.from("services").select("*").order("display_order", { ascending: true });
	const servicesCarousel = Array.isArray(rawServicesData) ? rawServicesData.map((service) => {
		const image = getHeroImageUrl(service);
		return {
			title: service.title || "",
			subtitle: service.subtitle || service.short_description || "",
			shortDescription: service.short_description || "",
			description: service.description || "",
			image,
			galleryId: service.id
		};
	}) : [];
	return renderTemplate`${maybeRenderHead($$result)}<section class="block bg-white p-0 m-0 overflow-hidden select-none" data-astro-cid-ge2uvauf><div class="max-w-6xl mx-auto px-0 sm:px-4 pb-6 relative group block overflow-visible" data-astro-cid-ge2uvauf><div id="carousel-wrapper" class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth rounded-none sm:rounded-lg shadow-xl aspect-video md:aspect-21/9 no-scrollbar" data-astro-cid-ge2uvauf>${servicesCarousel.map((service, index) => renderTemplate`<div${addAttribute(`slide-${index}`, "id")} class="w-full h-full shrink-0 snap-start relative" data-astro-cid-ge2uvauf><img${addAttribute(service.image, "src")}${addAttribute(service.title, "alt")} class="w-full h-full object-cover"${addAttribute(index === 0 ? "eager" : "lazy", "loading")}${spreadAttributes(index === 0 ? { fetchpriority: "high" } : {})} width="1200" height="514"${addAttribute(`this.onerror=null; this.src='https://placehold.co/1200x600?text=${encodeURIComponent(service.title)}';`, "onerror")} data-astro-cid-ge2uvauf><div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" data-astro-cid-ge2uvauf></div><div class="absolute bottom-6 left-6 right-6 md:left-12 md:bottom-10 text-white max-w-lg z-10" data-astro-cid-ge2uvauf><span class="text-[#d9b310] font-bold text-xs uppercase tracking-widest bg-black/40 px-2 py-1 rounded" data-astro-cid-ge2uvauf>Our Services</span><h2 class="text-xl sm:text-3xl font-extrabold mt-2 tracking-tight" data-astro-cid-ge2uvauf>${service.title}</h2><p class="text-xs sm:text-sm text-gray-200 font-bold mt-1 mb-4 hidden sm:block" data-astro-cid-ge2uvauf>${service.subtitle}</p><a${addAttribute(`/services/${service.galleryId}`, "href")} class="bg-[#328cc1] hover:bg-[#0b3c5d] text-white font-bold py-2.5 px-5 sm:py-3 sm:px-6 rounded-md shadow-lg transition-all inline-block text-xs uppercase tracking-wider border border-white/20" data-astro-cid-ge2uvauf>View ${service.title} Gallery</a></div></div>`)}</div><button id="prev-btn" class="absolute left-8 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#328cc1] text-white p-2 rounded-full hidden md:block opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Previous slide" data-astro-cid-ge2uvauf>&#9664;</button><button id="next-btn" class="absolute right-8 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#328cc1] text-white p-2 rounded-full hidden md:block opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Next slide" data-astro-cid-ge2uvauf>&#9654;</button></div></section>${renderScript($$result, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/Hero.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/Hero.astro", void 0);
//#endregion
//#region src/components/Services.astro
var $$Services = createComponent(async ($$result, $$props, $$slots) => {
	const { data: rawServices } = await supabase.from("services").select("*").order("display_order", { ascending: true });
	const services = Array.isArray(rawServices) ? rawServices : [];
	return renderTemplate`${maybeRenderHead($$result)}<section class="max-w-6xl mx-auto px-4 py-2"><div class="bg-white rounded-xl p-8 sm:p-10 shadow-sm border border-gray-100"><h2 class="text-3xl font-extrabold text-[#0b3c5d] mb-8 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-[#328cc1] pb-2">Our Services</h2><!-- Grid de 2 colunas distribuindo 3 itens em cada lado --><div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">${services.map((service) => renderTemplate`<div class="flex items-start gap-3.5"><span class="text-[#328cc1] text-xl select-none leading-none mt-1">▪</span><div class="flex-1"><h3 class="text-[#0b3c5d] font-bold text-lg sm:text-xl leading-snug">${service.title}</h3><p class="text-gray-600 text-base sm:text-lg ml-4 mt-1.5 leading-relaxed">${service.subtitle || service.short_description || service.tagline || ""}</p></div></div>`)}</div><div class="pt-8 mt-4 border-t border-gray-100"><a href="/services" class="inline-flex items-center justify-center rounded-full bg-[#328cc1] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#2570a2]">All Services</a></div></div></section>`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/Services.astro", void 0);
//#endregion
//#region ~icons/mdi/magnify.astro
createAstro("https://astro.build");
var $$Magnify = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Magnify;
	const props = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)} viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5"></path></svg>`;
}, "~icons/mdi/magnify.astro", void 0);
//#endregion
//#region src/components/Gallery.astro
var $$Gallery = createComponent(async ($$result, $$props, $$slots) => {
	const { data: rawServicesData } = await supabase.from("services").select("*").order("display_order", { ascending: true });
	const getStorageUrl = (path, width = 600) => {
		if (!path) return "";
		if (path.startsWith("http")) {
			if (path.includes("supabase.co/storage")) return `${path}${path.includes("?") ? "&" : "?"}width=${width}&quality=80`;
			return path;
		}
		const { data } = supabase.storage.from("services").getPublicUrl(path, { transform: {
			width,
			quality: 80
		} });
		return data?.publicUrl || "";
	};
	const servicesData = Array.isArray(rawServicesData) ? rawServicesData.map((service) => {
		const version = service.updated_at ? new Date(service.updated_at).getTime() : Date.now();
		const addVersion = (url) => url ? `${url}${url.includes("?") ? "&" : "?"}v=${version}` : url;
		const rawCover = service.cover_image || service.hero_image || "";
		const coverUrl = getStorageUrl(rawCover, 600);
		const imagesUrls = (Array.isArray(service.images) ? service.images : []).map((img) => getStorageUrl(img, 1e3)).filter(Boolean);
		return {
			...service,
			coverImage: addVersion(coverUrl),
			heroImage: addVersion(getStorageUrl(service.hero_image, 1e3)),
			images: imagesUrls.map((img) => addVersion(img))
		};
	}) : [];
	return renderTemplate`${maybeRenderHead($$result)}<section class="max-w-6xl mx-auto px-4 py-2" data-astro-cid-rj65ajc3><div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100" data-astro-cid-rj65ajc3><h2 class="text-3xl font-extrabold text-[#0b3c5d] mb-4 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-[#328cc1] pb-2" data-astro-cid-rj65ajc3>Photo Gallery</h2><p class="text-xs text-gray-500 mb-8 font-semibold uppercase tracking-wider" data-astro-cid-rj65ajc3>Click on a service to view full project gallery</p>${servicesData.length > 0 ? renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" data-astro-cid-rj65ajc3>${servicesData.map((service) => renderTemplate`<div${addAttribute(`gallery-${service.id}`, "id")} class="gallery-trigger group cursor-pointer bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"${addAttribute(JSON.stringify(service), "data-service")} data-astro-cid-rj65ajc3><div class="relative overflow-hidden aspect-video" data-astro-cid-rj65ajc3><img${addAttribute(service.coverImage, "src")}${addAttribute(service.title, "alt")} loading="lazy" width="600" height="338" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"${addAttribute(`this.onerror=null; this.src='https://placehold.co/600x400?text=${encodeURIComponent(service.title)}';`, "onerror")} data-astro-cid-rj65ajc3><div class="absolute inset-0 bg-[#0b3c5d]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" data-astro-cid-rj65ajc3><span class="inline-flex items-center gap-1.5 bg-white/65 text-[#0b3c5d] text-xs font-bold py-2 px-4 rounded-full shadow-md" data-astro-cid-rj65ajc3>View Gallery${renderComponent($$result, "MagnifyIcon", $$Magnify, {
		"class": "w-4 h-4",
		"data-astro-cid-rj65ajc3": true
	})}</span></div></div><div class="p-4 bg-white border-t border-gray-100" data-astro-cid-rj65ajc3><h3 class="font-bold text-lg text-[#0b3c5d] group-hover:text-[#328cc1] transition-colors" data-astro-cid-rj65ajc3>${service.title}</h3><a${addAttribute(`/services/${service.id}`, "href")} class="js-learn-more mt-4 inline-flex items-center justify-center rounded-full bg-[#2570a2] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#0b3c5d]"${addAttribute(`Learn more about ${service.title}`, "aria-label")} data-astro-cid-rj65ajc3>Learn more</a></div></div>`)}</div>` : renderTemplate`<p class="text-gray-500 italic" data-astro-cid-rj65ajc3>No photo galleries available at the moment.</p>`}</div></section><dialog id="gallery-modal" class="fixed inset-0 m-auto rounded-xl p-0 w-11/12 max-w-2xl overflow-hidden shadow-2xl border border-gray-100/50 outline-none bg-white opacity-0 transition-all duration-300 scale-95" data-astro-cid-rj65ajc3><div class="flex flex-col bg-white max-h-[85vh]" data-astro-cid-rj65ajc3><div class="flex justify-between items-center bg-[#0b3c5d] text-white p-5 sm:px-6" data-astro-cid-rj65ajc3><h3 id="modal-title" class="font-extrabold text-xl tracking-tight" data-astro-cid-rj65ajc3>Service Details</h3><button id="close-modal" class="text-white/80 hover:text-[#d9b310] text-3xl font-light transition-colors focus:outline-none leading-none pb-1" aria-label="Close modal" data-astro-cid-rj65ajc3>&times;</button></div><div class="p-6 overflow-y-auto space-y-6 no-scrollbar" data-astro-cid-rj65ajc3><p id="modal-description" class="text-gray-600 leading-relaxed text-sm sm:text-base" data-astro-cid-rj65ajc3></p><div data-astro-cid-rj65ajc3><h4 class="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4" data-astro-cid-rj65ajc3>Project Portfolio</h4><div id="modal-images-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-3" data-astro-cid-rj65ajc3></div></div></div></div></dialog>${renderComponent($$result, "ZoomModal", $$ZoomModal, { "data-astro-cid-rj65ajc3": true })}${renderScript($$result, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/Gallery.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/Gallery.astro", void 0);
//#endregion
//#region ~icons/mdi/calendar-blank.astro
createAstro("https://astro.build");
var $$CalendarBlank = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CalendarBlank;
	const props = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)} viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1"></path></svg>`;
}, "~icons/mdi/calendar-blank.astro", void 0);
//#endregion
//#region ~icons/mdi/map-marker.astro
createAstro("https://astro.build");
var $$MapMarker = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$MapMarker;
	const props = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)} viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"></path></svg>`;
}, "~icons/mdi/map-marker.astro", void 0);
//#endregion
//#region src/components/TestimonialCard.astro
createAstro("https://astro.build");
var $$TestimonialCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TestimonialCard;
	const data = (Astro.props || {}).data || {};
	const rawBefore = data.beforeImage || data.before_image || "";
	const rawAfter = data.afterImage || data.after_image || "";
	const getStorageUrl = (path, fallbackText) => {
		if (!path) return `https://placehold.co/600x400?text=${fallbackText}`;
		if (path.startsWith("http") || path.startsWith("/")) return path;
		const { data: storageData } = supabase.storage.from("testimonials").getPublicUrl(path);
		return storageData?.publicUrl || `https://placehold.co/600x400?text=${fallbackText}`;
	};
	const beforePath = getStorageUrl(rawBefore, "Before");
	const afterPath = getStorageUrl(rawAfter, "After");
	const dateDisplay = data.date ? new Date(data.date).toLocaleString("en-US", {
		month: "long",
		year: "numeric"
	}) : null;
	const serviceType = data.serviceType || data.service || "";
	const clientName = data.clientName || data.name || "";
	const cityName = data.city || data.location || "";
	const stateName = data.state || "";
	return renderTemplate`${maybeRenderHead($$result)}<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full"><div class="flex gap-3 mb-4"><div class="w-1/2"><p class="text-[9px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Before</p><img${addAttribute(beforePath, "src")} alt="Before" class="w-full h-32 object-cover rounded shadow-sm border border-gray-100"></div><div class="w-1/2"><p class="text-[9px] uppercase font-bold text-gray-400 mb-1 tracking-wider">After</p><img${addAttribute(afterPath, "src")} alt="After" class="w-full h-32 object-cover rounded shadow-sm border border-gray-100"></div></div><span class="text-[#328cc1] font-bold text-[10px] uppercase tracking-widest">${serviceType}</span><div class="flex items-center gap-4 mt-1">${dateDisplay && renderTemplate`<span class="flex items-center gap-1 text-[10px] uppercase tracking-widest text-gray-400">${renderComponent($$result, "CalendarIcon", $$CalendarBlank, { "class": "w-3.5 h-3.5 text-gray-400" })}${dateDisplay}</span>`}${cityName && renderTemplate`<span class="flex items-center gap-1 text-[10px] uppercase tracking-widest text-gray-400">${renderComponent($$result, "MapMarkerIcon", $$MapMarker, { "class": "w-3.5 h-3.5 text-gray-400" })}${cityName}${stateName ? `, ${stateName}` : ""}</span>`}</div><h3 class="font-bold text-lg mt-2 text-[#0b3c5d] leading-tight">${clientName}</h3><div class="text-gray-600 mt-3 text-sm leading-relaxed grow italic">${renderSlot($$result, $$slots["default"])}</div></div>`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/TestimonialCard.astro", void 0);
//#endregion
//#region ~icons/mdi/close.astro
createAstro("https://astro.build");
var $$Close = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Close;
	const props = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)} viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path></svg>`;
}, "~icons/mdi/close.astro", void 0);
//#endregion
//#region src/components/Testimonials.astro
var $$Testimonials = createComponent(async ($$result, $$props, $$slots) => {
	const { data: rawTestimonials, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
	const testimonialsList = Array.isArray(rawTestimonials) ? rawTestimonials : [];
	const processedTestimonials = testimonialsList.map((t) => {
		const safeT = t || {};
		const beforeVal = safeT.before_image || safeT.beforeImage || "";
		const afterVal = safeT.after_image || safeT.afterImage || "";
		const getStorageUrl = (path) => {
			if (!path) return "";
			if (path.startsWith("http")) return path;
			const { data } = supabase.storage.from("testimonials").getPublicUrl(path);
			return data?.publicUrl || "";
		};
		return {
			...safeT,
			beforeImageResolved: getStorageUrl(beforeVal) || `https://placehold.co/600x400?text=Before`,
			afterImageResolved: getStorageUrl(afterVal) || `https://placehold.co/600x400?text=After`
		};
	});
	const testimonialsScript = `
const testimonials = ${JSON.stringify(processedTestimonials)};
const grid = document.getElementById("testimonials-grid");
const modal = document.getElementById("testimonial-modal");

if (grid && modal) {
    const closeModalButton = document.getElementById("testimonial-modal-close");
    const serviceEl = document.getElementById("testimonial-modal-service");
    const clientEl = document.getElementById("testimonial-modal-client");
    const dateEl = document.getElementById("testimonial-modal-date");
    const locEl = document.getElementById("testimonial-modal-location");
    const bodyEl = document.getElementById("testimonial-modal-body");
    const beforeImg = document.getElementById("testimonial-modal-before");
    const afterImg = document.getElementById("testimonial-modal-after");

    function openModal(t) {
        if (!t) return;
        serviceEl.textContent = t.serviceType || t.service || "";
        clientEl.textContent = t.clientName || t.name || "";
        dateEl.querySelector('span').textContent = t.date ? new Date(t.date).toLocaleString("en-US", { month: "long", year: "numeric" }) : "";
        
        const city = t.city || t.location || "";
        const state = t.state || "";
        locEl.querySelector('span').textContent = city && state ? city + ", " + state : (city || "");
        
        bodyEl.textContent = t.message || "";
        
        beforeImg.src = t.beforeImageResolved;
        afterImg.src = t.afterImageResolved;
        
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        document.body.style.overflow = "";
    }

    grid.addEventListener("click", (event) => {
        const card = event.target.closest("[data-testimonial-id]");
        if (!card) return;
        openModal(testimonials.find(t => String(t.id) === card.getAttribute("data-testimonial-id")));
    });

    closeModalButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
}
`;
	return renderTemplate`${maybeRenderHead($$result)}<section id="testimonials" class="max-w-6xl mx-auto px-4 py-16"><h2 class="text-3xl font-extrabold text-[#0b3c5d] mb-8 text-center md:text-left">What Our Clients Say</h2>${testimonialsList.length > 0 ? renderTemplate`<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" id="testimonials-grid">${testimonialsList.map((t) => renderTemplate`<article class="testimonial-card cursor-pointer rounded-3xl border border-slate-200 bg-white p-0 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"${addAttribute(t?.id, "data-testimonial-id")}>${renderComponent($$result, "TestimonialCard", $$TestimonialCard, { "data": t }, { "default": ($$result) => renderTemplate`${t?.message}` })}</article>`)}</div>` : renderTemplate`<div class="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50"><p class="text-slate-500 font-medium">Customer testimonials coming soon.</p><p class="text-sm text-slate-400">We are currently gathering feedback from our latest projects.</p></div>`}</section><div id="testimonial-modal" class="hidden fixed inset-0 z-50 items-center justify-center bg-black/70 p-4"><div class="relative w-full max-w-4xl overflow-hidden rounded-4xl bg-white px-6 py8 shadow-2xl sm:px-8"><button id="testimonial-modal-close" class="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 transition-colors" aria-label="Close modal">${renderComponent($$result, "CloseIcon", $$Close, { "class": "w-5 h-5" })}</button><div class="grid gap-6 lg:grid-cols-[1fr_1.3fr]"><div class="space-y-2"><div class="text-slate-500 text-xs uppercase tracking-[0.3em]">Service</div><div id="testimonial-modal-service" class="text-xl font-bold text-[#0b3c5d]"></div><div id="testimonial-modal-client" class="text-sm uppercase tracking-[0.25em] text-[#328cc1] mb-4"></div><div class="flex flex-col gap-2"><div id="testimonial-modal-date" class="flex items-center gap-2 text-sm text-slate-500">${renderComponent($$result, "CalendarIcon", $$CalendarBlank, { "class": "w-4 h-4 text-slate-400" })}<span></span></div><div id="testimonial-modal-location" class="flex items-center gap-2 text-sm text-slate-500">${renderComponent($$result, "MapMarkerIcon", $$MapMarker, { "class": "w-4 h-4 text-slate-400" })}<span></span></div></div><div id="testimonial-modal-body" class="text-slate-700 text-sm leading-relaxed mt-4"></div></div><div class="grid gap-4"><img id="testimonial-modal-before" src="" alt="Before" class="w-full h-64 object-cover rounded-3xl border border-slate-200"><img id="testimonial-modal-after" src="" alt="After" class="w-full h-64 object-cover rounded-3xl border border-slate-200"></div></div></div></div><script type="module">${unescapeHTML(testimonialsScript)}<\/script>`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/Testimonials.astro", void 0);
//#endregion
//#region ~icons/mdi/email.astro
createAstro("https://astro.build");
var $$Email = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Email;
	const props = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)} viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"></path></svg>`;
}, "~icons/mdi/email.astro", void 0);
//#endregion
//#region ~icons/simple-icons/facebook.astro
createAstro("https://astro.build");
var $$Facebook = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Facebook;
	const props = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)} viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978c.401 0 .955.042 1.468.103a9 9 0 0 1 1.141.195v3.325a9 9 0 0 0-.653-.036a27 27 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.7 1.7 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103l-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647"></path></svg>`;
}, "~icons/simple-icons/facebook.astro", void 0);
//#endregion
//#region ~icons/simple-icons/instagram.astro
createAstro("https://astro.build");
var $$Instagram = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Instagram;
	const props = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)} viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388a5.9 5.9 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076s-.069 1.688-.063 4.947s.021 3.667.083 4.947c.061 1.277.264 2.149.563 2.911c.308.789.72 1.457 1.388 2.123a5.9 5.9 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552c1.278.056 1.689.069 4.947.063s3.668-.021 4.947-.082c1.28-.06 2.147-.265 2.91-.563a5.9 5.9 0 0 0 2.123-1.388a5.9 5.9 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912c.056-1.28.07-1.69.063-4.948c-.006-3.258-.02-3.667-.081-4.947c-.06-1.28-.264-2.148-.564-2.911a5.9 5.9 0 0 0-1.387-2.123a5.9 5.9 0 0 0-2.128-1.38c-.764-.294-1.636-.496-2.914-.55C15.647.009 15.236-.006 11.977 0S8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.7 3.7 0 0 1-1.382-.895a3.7 3.7 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228c-.06-1.264-.072-1.644-.08-4.848c-.006-3.204.006-3.583.061-4.848c.05-1.169.246-1.805.408-2.228c.216-.561.477-.96.895-1.382a3.7 3.7 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417c1.265-.06 1.644-.072 4.848-.08c3.203-.006 3.583.006 4.85.062c1.168.05 1.804.244 2.227.408c.56.216.96.475 1.382.895s.681.817.9 1.378c.165.422.362 1.056.417 2.227c.06 1.265.074 1.645.08 4.848c.005 3.203-.006 3.583-.061 4.848c-.051 1.17-.245 1.805-.408 2.23c-.216.56-.477.96-.896 1.38a3.7 3.7 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418c-1.266.06-1.645.072-4.85.079s-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442a1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024a6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16A4 4 0 0 1 8 12.008"></path></svg>`;
}, "~icons/simple-icons/instagram.astro", void 0);
//#endregion
//#region ~icons/simple-icons/tiktok.astro
createAstro("https://astro.build");
var $$Tiktok = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Tiktok;
	const props = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)} viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.57-.26-1.1-.59-1.62-.93c-.01 2.92.01 5.84-.02 8.75c-.08 1.4-.54 2.79-1.35 3.94c-1.31 1.92-3.58 3.17-5.91 3.21c-1.43.08-2.86-.31-4.08-1.03c-2.02-1.19-3.44-3.37-3.65-5.71c-.02-.5-.03-1-.01-1.49c.18-1.9 1.12-3.72 2.58-4.96c1.66-1.44 3.98-2.13 6.15-1.72c.02 1.48-.04 2.96-.04 4.44c-.99-.32-2.15-.23-3.02.37c-.63.41-1.11 1.04-1.36 1.75c-.21.51-.15 1.07-.14 1.61c.24 1.64 1.82 3.02 3.5 2.87c1.12-.01 2.19-.66 2.77-1.61c.19-.33.4-.67.41-1.06c.1-1.79.06-3.57.07-5.36c.01-4.03-.01-8.05.02-12.07"></path></svg>`;
}, "~icons/simple-icons/tiktok.astro", void 0);
//#endregion
//#region ~icons/simple-icons/google.astro
createAstro("https://astro.build");
var $$Google = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Google;
	const props = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)} viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133c-1.147 1.147-2.933 2.4-6.053 2.4c-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0C5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36c2.16-2.16 2.84-5.213 2.84-7.667c0-.76-.053-1.467-.173-2.053z"></path></svg>`;
}, "~icons/simple-icons/google.astro", void 0);
//#endregion
//#region src/components/Contact.astro
var $$Contact = createComponent(async ($$result, $$props, $$slots) => {
	const { data: settings } = await supabase.from("settings").select("*").eq("id", "company").single();
	const company = settings || {};
	return renderTemplate`${maybeRenderHead($$result)}<section id="contact" class="max-w-6xl mx-auto px-4 py-2"><div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 grid md:grid-cols-2 gap-10"><div><h2 class="text-2xl font-extrabold text-[#0b3c5d] mb-2">Contact Us</h2><p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">Contact us for a free estimate</p><div class="space-y-4 text-sm sm:text-base font-semibold text-[#328cc1]">${company?.address?.full && renderTemplate`<a${addAttribute(company.links?.googleReview ? company.links.googleReview.replace("writereview?placeid=", "?q=") : "#", "href")} target="_blank" rel="noopener noreferrer" class="flex items-start gap-3 text-[#0b3c5d] hover:text-[#328cc1] transition-colors">${renderComponent($$result, "MapMarker", $$MapMarker, { "class": "w-5 h-5 text-gray-400 shrink-0 mt-0.5" })}<span>${company.address.full}</span></a>`}${company?.contact?.phone && renderTemplate`<a${addAttribute(`tel:${company.contact?.phoneRaw || company.contact.phone}`, "href")} class="flex items-center gap-3 text-[#0b3c5d] hover:text-[#328cc1] transition-colors">${renderComponent($$result, "Phone", $$Phone, { "class": "w-5 h-5 text-gray-400" })} ${company.contact.phone}</a>`}${company?.contact?.facetime && renderTemplate`<a${addAttribute(`facetime:${company.contact.facetime}`, "href")} class="flex items-center gap-3 text-[#0b3c5d] hover:text-[#328cc1] transition-colors">${renderComponent($$result, "Video", $$Video, { "class": "w-5 h-5 text-gray-400" })} FaceTime</a>`}${company?.contact?.email && renderTemplate`<a${addAttribute(`mailto:${company.contact.email}`, "href")} class="flex items-center gap-3 text-[#0b3c5d] hover:text-[#328cc1] transition-colors">${renderComponent($$result, "Email", $$Email, { "class": "w-5 h-5 text-gray-400" })} ${company.contact.email}</a>`}</div><div class="flex gap-5 mt-8 pt-6 border-t border-gray-100">${company?.links?.googleReview && renderTemplate`<a${addAttribute(company.links.googleReview, "href")} target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#4285F4] transition-colors" aria-label="Google Reviews">${renderComponent($$result, "GoogleIcon", $$Google, { "class": "w-8 h-8" })}</a>`}${company?.links?.facebook && renderTemplate`<a${addAttribute(company.links.facebook, "href")} target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#1877F2] transition-colors" aria-label="Facebook">${renderComponent($$result, "Facebook", $$Facebook, { "class": "w-8 h-8" })}</a>`}${company?.links?.instagram && renderTemplate`<a${addAttribute(company.links.instagram, "href")} target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#E1306C] transition-colors" aria-label="Instagram">${renderComponent($$result, "Instagram", $$Instagram, { "class": "w-8 h-8" })}</a>`}${company?.links?.tiktok && renderTemplate`<a${addAttribute(company.links.tiktok, "href")} target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#000000] transition-colors" aria-label="TikTok">${renderComponent($$result, "Tiktok", $$Tiktok, { "class": "w-8 h-8" })}</a>`}</div></div><div class="w-full h-64 md:h-auto min-h-62.5 rounded-xl overflow-hidden border border-gray-100 shadow-inner">${company?.links?.googleMapsEmbed ? renderTemplate`<iframe width="100%" height="100%" style="border:0" loading="lazy" allowfullscreen${addAttribute(company.links.googleMapsEmbed, "src")} referrerpolicy="no-referrer-when-downgrade" title="Company Location Map">
                </iframe>` : renderTemplate`<div class="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">Map not available</div>`}</div></div></section>`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/components/Contact.astro", void 0);
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const { data: settingsData } = await supabase.from("settings").select("*").eq("id", "company").single();
	const companyData = settingsData;
	const pageTitle = companyData?.name || "A-Plus Pavers & Grass | Orlando Driveways, Patios & Turf";
	const pageDescription = companyData?.tagline || "A-Plus Pavers & Grass LLC creates premium driveway pavers, patios, walkways and artificial turf for Orlando, FL homeowners and businesses.";
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": pageTitle,
		"description": pageDescription
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Header", $$Header, {
		"isHome": true,
		"showServicesLinks": true
	})}${maybeRenderHead($$result)}<main id="main-content" class="space-y-16">${renderComponent($$result, "Hero", $$Hero, {})}${renderComponent($$result, "Services", $$Services, {})}${renderComponent($$result, "Gallery", $$Gallery, {})}${renderComponent($$result, "Testimonials", $$Testimonials, {})}${renderComponent($$result, "FAQ", $$FAQ, {})}${renderComponent($$result, "Contact", $$Contact, {})}</main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/pages/index.astro", void 0);
var $$file = "/Users/djonatanpiehowiak/Documents/react/a-plus-landing/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
