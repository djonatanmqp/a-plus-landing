// src/pages/vcard.vcf.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase.js';

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
};

const generateVCard = (company: any) => {
  const name = company?.name || defaultCompany.name;
  let phoneRaw = company?.contact?.phoneRaw || company?.phone || defaultCompany.contact.phoneRaw;
  let whatsapp = company?.contact?.whatsapp || company?.whatsapp || defaultCompany.contact.whatsapp;
  const email = company?.contact?.email || company?.email || defaultCompany.contact.email;
  const addressFull = company?.address?.full || company?.address || defaultCompany.address.full;

  // Garante o prefixo +1 caso venha sem ele
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
  // Busca os dados da empresa/configurações do Supabase
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("id", "company")
    .single();

  const company = settings || defaultCompany;
  const vcardContent = generateVCard(company);

  return new Response(vcardContent, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="A-Plus-Pavers.vcf"`,
    },
  });
};