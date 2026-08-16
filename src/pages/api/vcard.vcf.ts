import type { APIRoute } from 'astro';
import { getCompanyData } from "../../lib/firebase-admin";

const defaultCompany = {
  name: "A-Plus Pavers & Grass LLC",
  contact: {
    phone: "(321) 496-3060",
    phoneRaw: "+13214963060",
    facetime: "3214963060",
    email: "contact@apluspaversgrass.com",
    whatsapp: "+13214963060",
  },
  address: {
    full: "2459 Cheney Hwy, Titusville, FL 32780",
    serviceArea: "Central Florida and nearby cities",
  },
  links: {
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7008.868573171923!2d-80.831329!3d28.556719!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e74df4e89827c7%3A0x62929890360ad056!2sA-Plus%20Pavers%20%26%20Grass%20LLC!5e0!3m2!1spt-BR!2sbr!4v1786839260310!5m2!1spt-BR!2sbr",
  },
};

const generateVCard = (company: any) => {
  const name = company?.name || defaultCompany.name;
  let phoneRaw = company?.contact?.phoneRaw || defaultCompany.contact.phoneRaw;
  let whatsapp = company?.contact?.whatsapp || defaultCompany.contact.whatsapp;
  const email = company?.contact?.email || defaultCompany.contact.email;
  const addressFull = company?.address?.full || defaultCompany.address.full;

  // Garante o prefixo +1 caso venha sem ele do Firebase
  if (phoneRaw && !phoneRaw.startsWith("+")) {
    phoneRaw = `+${phoneRaw}`;
  }
  if (whatsapp && !whatsapp.startsWith("+")) {
    whatsapp = `+${whatsapp}`;
  }

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${name}`,
    `ORG:${name}`,
    /* `TITLE:CONTACT`, */
    `TEL;TYPE=WORK,VOICE:${phoneRaw}`,
    `TEL;TYPE=WORK,CELL:${whatsapp}`,
    `EMAIL:${email}`,
    `URL:https://apluspaversgrass.com`,
    `ADR;TYPE=WORK:;;${addressFull}`,
    "END:VCARD",
  ].join("\r\n");

  return vcard;
};

export const GET: APIRoute = async () => {
  const companyData = await getCompanyData();
  const company = companyData || defaultCompany;
  const vcardContent = generateVCard(company);

  return new Response(vcardContent, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="A-Plus-Pavers.vcf"`,
    },
  });
};