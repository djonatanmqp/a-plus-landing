import { createClient } from "@supabase/supabase-js";
var supabaseAdmin = createClient("https://viapfzzkfniawogmmdny.supabase.co", "sb_secret_ngCxdpcSJlbAmbWz94uzPg_TqHF_StY", { auth: {
	persistSession: false,
	autoRefreshToken: false
} });
async function getCompanyData() {
	const { data, error } = await supabaseAdmin.from("settings").select("*").single();
	if (error) {
		console.error("Erro ao buscar company data:", error.message);
		return null;
	}
	return data;
}
async function getServicesData() {
	const { data, error } = await supabaseAdmin.from("services").select("*").order("display_order", { ascending: true });
	if (error) {
		console.error("Error fetching services:", error.message);
		return [];
	}
	return data;
}
async function getFaqData() {
	const { data, error } = await supabaseAdmin.from("faqs").select("*");
	if (error) {
		console.error("Erro ao buscar FAQs:", error.message);
		return [];
	}
	return data || [];
}
async function getTestimonialsData() {
	const { data, error } = await supabaseAdmin.from("testimonials").select("*");
	if (error) {
		console.error("Erro ao buscar Testimonials:", error.message);
		return [];
	}
	return data || [];
}
//#endregion
export { supabaseAdmin as a, getTestimonialsData as i, getFaqData as n, getServicesData as r, getCompanyData as t };
