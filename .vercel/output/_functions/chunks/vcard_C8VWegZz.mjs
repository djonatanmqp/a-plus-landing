import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as supabase } from "./supabase_Bqd28O6b.mjs";
//#region src/pages/api/vcard.vcf.ts
var vcard_vcf_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var defaultCompany = {
	name: "A-Plus Pavers & Grass LLC",
	contact: {
		phone: "(321) 496-3060",
		phoneRaw: "+13214963060",
		facetime: "3214963060",
		email: "contact@apluspaversgrass.com",
		whatsapp: "+13214963060"
	},
	address: {
		full: "2459 Cheney Hwy, Titusville, FL 32780",
		serviceArea: "Central Florida and nearby cities"
	}
};
var generateVCard = (company) => {
	const name = company?.name || defaultCompany.name;
	let phoneRaw = company?.contact?.phoneRaw || company?.phone || defaultCompany.contact.phoneRaw;
	let whatsapp = company?.contact?.whatsapp || company?.whatsapp || defaultCompany.contact.whatsapp;
	const email = company?.contact?.email || company?.email || defaultCompany.contact.email;
	const addressFull = company?.address?.full || company?.address || defaultCompany.address.full;
	if (phoneRaw && !phoneRaw.startsWith("+")) phoneRaw = `+${phoneRaw}`;
	if (whatsapp && !whatsapp.startsWith("+")) whatsapp = `+${whatsapp}`;
	return [
		"BEGIN:VCARD",
		"VERSION:3.0",
		`FN:${name}`,
		`ORG:${name}`,
		`TEL;TYPE=WORK,VOICE:${phoneRaw}`,
		`TEL;TYPE=WORK,CELL:${whatsapp}`,
		`EMAIL:${email}`,
		`URL:https://apluspaversgrass.com`,
		`ADR;TYPE=WORK:;;${addressFull}`,
		"END:VCARD"
	].join("\r\n");
};
var GET = async () => {
	const { data: settings } = await supabase.from("settings").select("*").eq("id", "company").single();
	const vcardContent = generateVCard(settings || defaultCompany);
	return new Response(vcardContent, { headers: {
		"Content-Type": "text/vcard; charset=utf-8",
		"Content-Disposition": `attachment; filename="A-Plus-Pavers.vcf"`
	} });
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/vcard.vcf@_@ts
var page = () => vcard_vcf_exports;
//#endregion
export { page };
